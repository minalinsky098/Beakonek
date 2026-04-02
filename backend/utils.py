import secrets
import httpx
import os
from dotenv import load_dotenv
from supabase import AsyncClient
from database import insert_session, get_user
from haversine import haversine, Unit


load_dotenv()
PHILSMS_API_TOKEN = os.getenv("PHIL_SMS_API")

def generate_otp(length: int = 6):
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

#DOUBLE CHECK
async def send_alert_sms(mobile_numbers: list):
    try:
        message = "Your relative in this place is in danger"
        mobile_number_list = (", ").join(mobile_numbers)
        async with httpx.AsyncClient() as client:
                response = await client.post(
                "https://dashboard.philsms.com/api/v3/sms/send",
                headers={
                    "Authorization": f"Bearer {PHILSMS_API_TOKEN}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json={
                    "recipient":mobile_number_list,
                    "sender_id":"PhilSMS",
                    "type":"plain",
                    "message":message,
            }
            )
        return response   
    except Exception:
        raise
    
async def create_session(mobile_number: str, db_client, length: int = 32):
    session_id = secrets.token_urlsafe(length)
    user_id = await get_user(mobile_number, db_client)
    await insert_session(user_id, session_id, db_client)
    return session_id
 
async def fetch_earthquakes(starttime):
    pass

async def check_earthquakes(db_client):
    pass
   
def get_alert_radius(magnitude: float) -> float:
    if magnitude >= 7.0:
        return 500
    elif magnitude >= 6.0:
        return 300
    elif magnitude >= 5.0:
        return 150
    else:
        return 75
    
#finds the distance of the user to the epicenter using haversine
def get_distance_km(user_lat, user_long, earthquake_center_lat, earthquake_center_long):
    earthquake_center = (earthquake_center_lat, earthquake_center_long)  # earthquake epicenter
    user_location = (user_lat, user_long)  # user location
    distance_km = haversine(earthquake_center, user_location, unit=Unit.KILOMETERS)
    
    return distance_km



