from fastapi import FastAPI, Request, HTTPException, Depends
from contextlib import asynccontextmanager
from pydantic import BaseModel, field_validator
from supabase import acreate_client, AsyncClient
from dotenv import load_dotenv
from utils import generate_otp
from database import clean_up_expired_otp, delete_existing_otp
from auth import checkOTP
import os
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

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

#Payload Models
class RegisterPayload(BaseModel):
    mobile_number: str

    @field_validator("mobile_number")
    @classmethod
    def check_digits(cls, v):
        v = v.strip()
        MAX_DIGITS = 12
        if v[:3] != "639":
            raise ValueError("Mobile Number must be Philippine Based")
        if len(v) != MAX_DIGITS:
            raise ValueError("Mobile number must be 11 digits")
        return v
class AuthOTPPayload(BaseModel):
    mobile_number: str
    purpose: str
    otp: str
      
@app.get("/")
def root():
    return {"message": "this is the main"}

#TODO EDIT REGISTER NUMBER TO ACTUALLY REGISTER AND SEND AN OTP
@app.post("/api/v1/registeruser")
async def register_user(payload: RegisterPayload, db_client: AsyncClient = Depends(get_db_client)):
    try:
        otp = generate_otp() #generate a string OTP
        #await send_otp_sms(payload.mobile_number, otp)
        db_payload = {
        "mobile_number":payload.mobile_number,
        "otp_code": otp,
        "purpose":"registration",
        }
        await delete_existing_otp(payload.mobile_number, db_client)
        db_response = await db_client.table("otp_verifications").insert(db_payload).execute()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
    return {"otp_code":db_response.data[0]["otp_code"]}

#TODO CREATE A CHECKOTP ENDPOINT
@app.post("/api/v1/checkOTP")
async def auth_otp(payload:AuthOTPPayload, db_client: AsyncClient = Depends(get_db_client)):
    try:
        isvalid = await checkOTP(payload.mobile_number, payload.purpose,payload.otp,db_client)
    except Exception as e:
        raise HTTPException(status_code=404, detail="OTP not found")
    print(isvalid)

#TODO CREATE A LOGIN ENDPOINT
@app.post("/api/v1/loginuser")
async def login_user():
    pass


    
