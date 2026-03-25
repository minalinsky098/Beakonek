import secrets
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

def generate_otp(length: int = 6) -> str:
    return str(secrets.randbelow(10**length)).zfill(length)

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
                    "message":message,
            }
        )
        return response
    except Exception as e:
        raise Exception 
    
