from fastapi import FastAPI, Request, HTTPException, Depends
from contextlib import asynccontextmanager
from pydantic import BaseModel, field_validator
from supabase import acreate_client, AsyncClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import os
import secrets
import httpx
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

class MobileNumberPayload(BaseModel):
    mobile_number: str

    @field_validator("mobile_number")
    @classmethod
    def check_digits(cls, v):
        v = v.strip()
        MAX_DIGITS = 12
        if len(v) != MAX_DIGITS:
            raise ValueError("Mobile number must be 11 digits")
        elif v[:3] != "639":
            raise ValueError("Mobile Number must be Philippine Based")
        return v
        
@app.get("/")
def root():
    return {"message": "this is the main"}

@app.post("/api/v1/registerNumber")
async def register_number(payload: MobileNumberPayload, db_client: AsyncClient = Depends(get_db_client)):
    otp = generate_otp()
    #response = await send_otp_sms(payload.mobile_number, otp)
    try:
        db_payload = {
        "mobile_number":payload.mobile_number,
        "otp_code": otp,
        "purpose":"registration",
        }
        await db_client.table("otp_verifications").delete().eq("mobile_number", payload.mobile_number).execute() #delete all all previous otps of the number before asking for another
        db_response = await db_client.table("otp_verifications").insert(db_payload).execute()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
    return db_response.data[0]

@app.post("/api/v1/checkOTP")
async def auth_otp(payload: MobileNumberPayload, auth_client: AsyncClient = Depends(get_auth_client)):
    pass

def generate_otp(length: int = 6) -> str:
    return str(secrets.randbelow(10**length)).zfill(length)

async def clean_up_expired_otp(db_client):
    try:
        await db_client.table("otp_verifications").delete().lt("expires_at", datetime.now(timezone.utc).isoformat()).execute()
    except Exception as e:
        print("An error happened",e)

async def send_otp_sms(mobile_number: str, otp: str):
    message = f"Your SafePulse verification code is: {otp}. It expires in 10 minutes. Do not share this with anyone."
    PHILSMS_API_TOKEN = os.getenv("PHIL_SMS_API")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://dashboard.philsms.com/api/v3/sms/send",
                headers={
                    "Authorization": f"Bearer {PHILSMS_API_TOKEN}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json={
                    "recipient":mobile_number,
                    "sender_id":"PhilSMS",
                    "type":"plain",
                    "message":"Hello ako ni si royce gina try ko ang hackathon ng messaging namon",
            }
        )
        return response
    except Exception as e:
        raise HTTPException(status_code= 500, detail=e)