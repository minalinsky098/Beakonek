import os
from fastapi import FastAPI, Request, HTTPException, Response,Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from supabase import acreate_client, AsyncClient
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger 
from uuid import UUID

#other file imports for separation of concerns
from utils import send_otp_sms, generate_otp, create_session
from database import DuplicateMobileError, SessionNotFoundError, DatabaseError,RelativeNotFoundError\
,RelativeAlreadyAdded,NumberNotInDatabase,clean_up_expired_otp, delete_existing_otp\
,add_user_to_database,insert_otp_entry,get_session, logout_user, get_user, update_coordinates\
,add_relative, get_user_coordinates,get_relatives, update_relatives, delete_relatives, number_in_db\
,update_name
from auth import checkOTP, OTPNotFoundError, ExpiredOTPError
from payloadmodels import AuthOTPPayload, RequestOTPPayload, LocationPayload, RelativesPayload\
,UpdateNamePayload

scheduler = AsyncIOScheduler()
load_dotenv()
last_poll_time = None

async def handle_registration(payload, db_client):
    await add_user_to_database(payload.mobile_number,payload.first_name,payload.last_name, db_client)
    return JSONResponse(status_code = 201, content = {"detail": "User is registered"})

async def handle_login(payload, db_client):
    current_user_id = await get_user(payload.mobile_number, db_client)
    await logout_user(current_user_id, db_client)
    session_id = await create_session(payload.mobile_number, db_client)
    return JSONResponse(status_code = 200,content = {"detail": "User is logged in", "session id": session_id})

HANDLERS = {
    "registration": handle_registration,
    "login": handle_login
    }

#startup logic
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.auth_client = await acreate_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_ANON_KEY")
    )
    app.state.db_client = await acreate_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_ROLE_KEY") # service role — for db
    )
    
    scheduler.add_job(
        clean_up_expired_otp,
        trigger=IntervalTrigger(minutes=5),
        args=[app.state.db_client]
    )
    scheduler.start()
    yield
    scheduler.shutdown()
    await clean_up_expired_otp(app.state.db_client)
    
#start app
app = FastAPI(lifespan=lifespan)

#dependencies
async def get_db_client(request: Request):
    return request.app.state.db_client
async def get_auth_client(request: Request):
    return request.app.state.auth_client
async def get_current_usersession(authorization: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)), db_client = Depends(get_db_client)):
    try:
        session_id = authorization.credentials
        current_user = await get_session(session_id, db_client)
    except SessionNotFoundError as e: 
        raise HTTPException(status_code = 401, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code= 500, detail=str(e))
    return current_user
      
@app.get("/")
def root():
    return {"message": "this is the main"}

#REMOVE ON DEPLOYEMENT
@app.get("/coords")
async def coords(db_client = Depends(get_db_client)):
    res = await get_user_coordinates(db_client)
    relatives = await get_relatives(res["user_id"], db_client)
    return [res, relatives]

@app.post("/api/v1/otp/requests")
async def request_OTP(payload: RequestOTPPayload, db_client = Depends(get_db_client)):
    try:
        if payload.purpose == "login":
            await get_user(payload.mobile_number, db_client)
        if payload.purpose == "registration" and await number_in_db(payload.mobile_number, db_client):
            raise HTTPException(status_code= 409, detail="You cannot register as the number has been registered")
        otp = generate_otp() #generate a string OTP
        #await send_otp_sms(payload.mobile_number, otp)
        await delete_existing_otp(payload.mobile_number, db_client)
        otp_code = await insert_otp_entry(payload.mobile_number, otp, payload.purpose, db_client)
    except NumberNotInDatabase as e:
        raise HTTPException(status_code=404, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message":f"OTP is sent to your number: +({payload.mobile_number})"}

@app.post("/api/v1/otp/authentications")
async def auth_otp(payload:AuthOTPPayload, db_client: AsyncClient = Depends(get_db_client)):
    try:
        isvalid = await checkOTP(payload.mobile_number, payload.purpose,payload.otp,db_client)
        if isvalid:
            await delete_existing_otp(payload.mobile_number, db_client)
            handler = HANDLERS.get(payload.purpose)
            return await handler(payload, db_client)
        else:
            raise HTTPException(401, detail="Incorrect OTP")
    except OTPNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ExpiredOTPError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except HTTPException:
        raise 
    except DuplicateMobileError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
@app.post("/api/v1/relatives")
async def add_relatives(payload: RelativesPayload, db_client = Depends(get_db_client), user_id = Depends(get_current_usersession)):
    try: 
        res = await add_relative(user_id, payload.relative_name, payload.relative_number, db_client)
        return res
    except RelativeAlreadyAdded as e:
        raise HTTPException(409, detail = str(e))
    except Exception as e:
        raise HTTPException(500, detail = "Internal Server Error")
    
#UPDATE============================================================================
@app.put("/api/v1/relatives/{relative_id}")
async def update_relative(payload: RelativesPayload,relative_id:UUID, db_client = Depends(get_db_client), user_id = Depends(get_current_usersession)):
    try:
        res = await update_relatives(user_id, relative_id,payload.relative_name, payload.relative_number,db_client)
        return res.data[0]
    except RelativeNotFoundError:
        raise HTTPException(404, detail="Relative not found")
    except DatabaseError as e:
        raise HTTPException(500, detail=f"Internal Server Error: {e}")
    
@app.patch("/api/v1/location")
async def update_location(payload: LocationPayload, db_client = Depends(get_db_client), user_id = Depends(get_current_usersession)):
    await update_coordinates(payload.latitude, payload.longitude, user_id, db_client)
    return {"message":f"Users location has been updated"}

@app.put("/api/v1/users")
async def update_user_name(payload:UpdateNamePayload, db_client = Depends(get_db_client), user_id = Depends(get_current_usersession)):
    await update_name(user_id, payload.first_name, payload.last_name, db_client)
    return {"message":f"User name has been updated"}

#DELETE==============================================================================
@app.delete("/api/v1/relatives/{relative_id}")
async def delete_relative(relative_id:UUID, db_client = Depends(get_db_client), user_id = Depends(get_current_usersession)):
    try:
        await delete_relatives(user_id, relative_id,db_client)
        return Response(status_code=204)
    except RelativeNotFoundError:
        raise HTTPException(404, detail="Relative not found")
    except DatabaseError as e:
        raise HTTPException(500, detail=f"Internal Server Error: {e}")
    
@app.post("/api/v1/logout")
async def logout(current_user = Depends(get_current_usersession), db_client = Depends(get_db_client)):
    await logout_user(current_user, db_client)
    return {"detail": "User logged out"}