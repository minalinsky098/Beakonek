import secrets
import httpx
import os
from dotenv import load_dotenv
from database import insert_session, get_user, get_users_with_coordinates, log_alert, get_all_relatives
from haversine import haversine, Unit
from datetime import datetime, timezone, timedelta

alerted_ids = {} 
load_dotenv()
PHILSMS_API_TOKEN = os.getenv("PHIL_SMS_API")

def generate_otp(length: int = 6):
    return str(secrets.randbelow(10**length)).zfill(length)

async def send_otp_sms(mobile_number: str, otp: str):
    message = f"Your Beakonek verification code is: {otp}. It expires in 5 minutes. Do not share this with anyone."
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

async def send_alert_sms(mobile_number: str, message: str):
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
            })
        return response   
    except Exception:
        raise
    
async def create_session(mobile_number: str, db_client, length: int = 32):
    session_id = secrets.token_urlsafe(length)
    user_id = await get_user(mobile_number, db_client)
    await insert_session(user_id, session_id, db_client)
    return session_id
 
async def fetch_earthquakes(starttime:datetime):
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "starttime": starttime.isoformat(),
        "minmagnitude": 4.5,
        "orderby": "time",
        "minlatitude": 4.5,
        "maxlatitude": 21.5,
        "minlongitude": 114.0,
        "maxlongitude": 127.0
            }
    async with httpx.AsyncClient() as client:
        res = await client.get(url,params=params)
    res.raise_for_status()
    return res.json().get("features", [])

async def check_earthquakes(db_client):
    current_time = datetime.now(timezone.utc)
    start_time = current_time - timedelta(minutes=2)
    raw_earthquakes = await fetch_earthquakes(start_time)
    earthquakes = flatten_earthquake_data(raw_earthquakes)
    await process_earthquakes(earthquakes, db_client)

async def process_earthquakes(earthquakes, db_client):
    users = await get_users_with_coordinates(db_client)
    all_relatives = await get_all_relatives(db_client) #get all relatives
    user_relatives = {} 
    for relative in all_relatives: #map all relatives to each user_id
        user_id = relative["user_id"]
        user_relatives.setdefault(user_id, []).append(relative)
        
    for earthquake in earthquakes:
        try:
            current_time = datetime.now(timezone.utc)
            global alerted_ids
            earthquake_id = earthquake["earthquake_id"]
            if earthquake_id in alerted_ids:
                if alerted_ids[earthquake_id] < current_time - timedelta(minutes=2):
                    del alerted_ids[earthquake_id]
                else:
                    continue
            print(f"Earthquake with {earthquake_id} is logged")
            alerted_ids[earthquake_id] = current_time
            affected_relatives = {}
            
            magnitude = earthquake["magnitude"]
            earthquake_lat = earthquake["latitude"]
            earthquake_long = earthquake["longitude"]
            place = earthquake["place"]
            alert_radius = get_alert_radius(magnitude)
            
            for user in users:
                user_lat = user["latitude"]
                user_long = user["longitude"]
                earthquake_distance = get_distance_km(user_lat, user_long, earthquake_lat, earthquake_long)
                
                if earthquake_distance <= alert_radius:
                    user_id = user["user_id"]
                    user_fullname = f"{user['first_name']} {user['last_name']}"
                    relatives = user_relatives.get(user_id, [])
                    
                    for relative in relatives:
                        relative_number = relative["mobile_number"]
                        relative_name = relative["relative_name"]
                        affected_relatives.setdefault(relative_number, []).append(user_fullname)
                        await log_alert(user_id, earthquake_id, magnitude, place, relative_name, db_client)
                        
            for relative in affected_relatives:
                message = f"Your relative {(", ").join(affected_relatives[relative])} has been affected by a {magnitude} magnitude earthquake in {place}"
                await send_alert_sms(relative, message)   
        except Exception as e:
            print(e)

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

def flatten_earthquake_data(raw_earthquakes):
    earthquakes = []
    for earthquake in raw_earthquakes:
        earthquakes.append({
            "earthquake_id": earthquake["id"],
            "magnitude": earthquake["properties"]["mag"],
            "latitude": earthquake["geometry"]["coordinates"][1],
            "longitude": earthquake["geometry"]["coordinates"][0],
            "place": earthquake["properties"]["place"]
        })
    return earthquakes