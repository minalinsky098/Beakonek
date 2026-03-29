import secrets
import httpx
import os
from dotenv import load_dotenv
from supabase import AsyncClient

load_dotenv()

def generate_otp(length: int = 6) -> str:
    return str(secrets.randbelow(10**length)).zfill(length)

async def send_otp_sms(mobile_number: str, otp: str):
    message = f"Your SafePulse verification code is: {otp}. It expires in 5 minutes. Do not share this with anyone."
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
                    "message":message,
            }
        )
        return response
    except Exception:
        raise

async def number_in_db(mobile_number: str, db_client: AsyncClient):
    res = await db_client.table("users").select().eq("mobile_number", mobile_number).execute()
    return res.data