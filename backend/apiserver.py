import os
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from supabase import acreate_client, AsyncClient
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger 

#other file imports for separation of concerns
from utils import generate_otp, send_otp_sms, number_in_db, create_session
from database import DuplicateMobileError, SessionNotFoundError, clean_up_expired_otp\
, delete_existing_otp,add_user_to_database,insert_otp_entry, get_session, logout_user\
, get_user
from auth import checkOTP, OTPNotFoundError, ExpiredOTPError
from payloadmodels import AuthOTPPayload, RequestOTPPayload

scheduler = AsyncIOScheduler()
load_dotenv()

async def handle_registration(mobile_number, db_client):
    await add_user_to_database(mobile_number, db_client)
    return JSONResponse(status_code = 201, content = {"detail": "User is registered"})

async def handle_login(mobile_number: str, db_client):
    current_user_id = await get_user(mobile_number, db_client)
    await logout_user(current_user_id, db_client)
    session_id = await create_session(mobile_number, db_client)
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
async def get_current_user(session_id = Header(), db_client = Depends(get_db_client)):
    try:
        current_user = await get_session(session_id, db_client)
    except SessionNotFoundError: 
        raise HTTPException(status_code = 401, detail="You've been logged out")
    except Exception as e:
        raise HTTPException(status_code= 500, detail=str(e))
    return current_user
      
@app.get("/")
def root():
    return {"message": "this is the main"}

@app.post("/api/v1/requestOTP")
async def request_OTP(payload: RequestOTPPayload, db_client = Depends(get_db_client)):
    try:
        if payload.purpose == "registration" and await number_in_db(payload.mobile_number, db_client):
            raise HTTPException(status_code= 409, detail="You cannot register as the number has been registered")
        otp = generate_otp() #generate a string OTP
        #await send_otp_sms(payload.mobile_number, otp)
        await delete_existing_otp(payload.mobile_number, db_client)
        otp_code = await insert_otp_entry(payload.mobile_number, otp, payload.purpose, db_client)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
    return {"message":f"OTP is sent to your number: +({payload.mobile_number})"}

@app.post("/api/v1/authOTP")
async def auth_otp(payload:AuthOTPPayload, db_client: AsyncClient = Depends(get_db_client)):
    try:
        isvalid = await checkOTP(payload.mobile_number, payload.purpose,payload.otp,db_client)
        if isvalid:
            await delete_existing_otp(payload.mobile_number, db_client)
            handler = HANDLERS.get(payload.purpose)
            return await handler(payload.mobile_number, db_client)
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
    
@app.delete("/api/v1/logout")
async def logout(current_user = Depends(get_current_user), db_client = Depends(get_db_client)):
    await logout_user(current_user, db_client)
    return {"detail": "User logged out"}