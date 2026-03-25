import os
from fastapi import FastAPI, Request, HTTPException, Depends
from contextlib import asynccontextmanager
from supabase import acreate_client, AsyncClient
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger 
from utils import generate_otp #other file imports for separation of concerns
from database import clean_up_expired_otp, delete_existing_otp, add_user_to_database\
,DuplicateMobileError
from auth import checkOTP
from payloadmodels import AuthOTPPayload, RequestOTPPayload

scheduler = AsyncIOScheduler()
load_dotenv()

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
        trigger=IntervalTrigger(hours=1),
        args=[app.state.db_client]
    )
    scheduler.start()
    yield
    scheduler.shutdown()
    await clean_up_expired_otp(app.state.db_client)
    
#start app
app = FastAPI(lifespan=lifespan)

#dependencies
async def get_db_client(request: Request) ->AsyncClient:
    return request.app.state.db_client
async def get_auth_client(request: Request) ->AsyncClient:
    return request.app.state.auth_client
      
@app.get("/")
def root():
    return {"message": "this is the main"}

@app.post("/api/v1/requestOTP")
async def request_OTP(payload: RequestOTPPayload, db_client = Depends(get_db_client)):
    try:
        otp = generate_otp() #generate a string OTP
        #await send_otp_sms(payload.mobile_number, otp)
        db_payload = {
        "mobile_number":payload.mobile_number,
        "otp_code": otp,
        "purpose":payload.purpose,
        }
        await delete_existing_otp(payload.mobile_number, db_client)
        db_response = await db_client.table("otp_verifications").insert(db_payload).execute()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
    return {"otp_code":db_response.data[0]["otp_code"]}
    pass

#TODO CREATE A CHECKOTP ENDPOINT
@app.post("/api/v1/authOTP")
async def auth_otp(payload:AuthOTPPayload, db_client: AsyncClient = Depends(get_db_client)):
    try:
        isvalid = await checkOTP(payload.mobile_number, payload.purpose,payload.otp,db_client)
        if isvalid:
            if payload.purpose == "registration":
                await delete_existing_otp(payload.mobile_number, db_client)
                await add_user_to_database(payload.mobile_number, db_client)
            elif payload.purpose == "login":
                await delete_existing_otp(payload.mobile_number, db_client)
                raise HTTPException(200,detail="User is logged in")
            return {"detail":"Correct OTP"}
        else:
            raise HTTPException(401, detail="Incorrect OTP")
    except HTTPException:
        raise 
    except DuplicateMobileError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


    
