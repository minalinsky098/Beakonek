from datetime import datetime, timezone

class DatabaseError(Exception):
    pass

class DuplicateMobileError(DatabaseError):
    pass

class SessionNotFoundError(DatabaseError):
    pass

class RelativeNotFoundError(DatabaseError):
    pass

class RelativeAlreadyAdded(DatabaseError):
    pass

class NumberNotInDatabase(DatabaseError):
    pass

def catch_database_error(func):
    # turns unexpected database errors into one consistent error type
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except DatabaseError:
            raise
        except Exception as e:
            raise DatabaseError(e) from e 
    return wrapper

#CREATE
@catch_database_error
async def add_user_to_database(mobile_number,first_name, last_name, db_client):
    try: 
        db_payload = {
            "mobile_number": mobile_number,
            "first_name":first_name,
            "last_name":last_name
        }
        await db_client.table("users").insert(db_payload).execute()
    except Exception as e:
        if "23505" in str(e):
            raise DuplicateMobileError("Mobile number already in database")
        raise
 
@catch_database_error
async def insert_otp_entry(mobile_number: str, otp:str, purpose:str, db_client):
    db_payload = {
        "mobile_number":mobile_number,
        "otp_code": otp,
        "purpose":purpose,
        }
    db_response = await db_client.table("otp_verifications").insert(db_payload).execute()
    return db_response.data[0]["otp_code"]

@catch_database_error
async def insert_session(user_id:str, token:str, db_client):
    db_payload = {
        "session_id": token,
        "user_id":user_id
    }
    await db_client.table("sessions").insert(db_payload).execute()

@catch_database_error
async def add_relative(user_id: str, relative_name:str, mobile_number: str,db_client):
    db_payload = {"user_id":user_id,
                  "relative_name": relative_name, 
                  "mobile_number": mobile_number}    
    try:
        await db_client.table("relatives").insert(db_payload).execute()
        res = await db_client.table("relatives").select("*").eq("user_id", user_id).eq("mobile_number", mobile_number).execute()
    except Exception as e:
        if "23505" in str(e):
            raise RelativeAlreadyAdded("You already added this relative")
        raise 
    return res.data[0]
  
@catch_database_error 
async def log_alert(user_id: str, earthquake_id: str, magnitude: float, place: str, relative_name: str, db_client):
    db_payload = {
        "user_id": user_id, 
        "earthquake_id": earthquake_id,
        "magnitude": magnitude, 
        "place": place, 
        "relative_name":relative_name
    }
    res = await db_client.table("alert_logs").insert(db_payload).execute() 
    return res.data[0]
    
#READ ==================================================================================
#checks if the number is in the database, returns True(the data if exists)
#returns False(if data does not exist)
@catch_database_error
async def number_in_db(mobile_number: str, db_client):
    res = await db_client.table("users").select().eq("mobile_number", mobile_number).execute()
    return res.data

#gets the session and returns the user_id of the session
#raises a sessionnotfound error if no session is found
@catch_database_error
async def get_session(session_id: str, db_client):
    res = await db_client.table("sessions").select().eq("session_id", session_id).execute()
    if not res.data:
        raise SessionNotFoundError("Session Not found")
    return res.data[0]["user_id"]

#gets the user from the database
#raises an error if not found
@catch_database_error
async def get_user(mobile_number: str, db_client):
    res = await db_client.table("users").select().eq("mobile_number", mobile_number).execute()
    if not res.data:
        raise NumberNotInDatabase("Number not registered")
    return res.data[0]["user_id"]
 
#gets the list of relatives of the user 
@catch_database_error
async def get_relatives(user_id: str, db_client):
    res = await db_client.table("relatives").select().eq("user_id", user_id).execute()
    return res.data

#returns a list of users with non-null coordinates
@catch_database_error
async def get_users_with_coordinates(db_client):
    res = await db_client.table("users").select("*").not_.is_("latitude", "null").not_.is_("longitude", "null").execute()
    return res.data

#UPDATE ============================================================================  
@catch_database_error
async def update_coordinates(latitude: float, longitude: float, user_id: str, db_client):
    db_payload = {"latitude": latitude, "longitude": longitude}
    await db_client.table("users").update(db_payload).eq("user_id", user_id).execute()

@catch_database_error
async def update_relatives(user_id: str, relative_id: str, relative_name:str, mobile_number: str,db_client):
    db_payload = {"relative_name": relative_name, 
                "mobile_number": mobile_number}    
    res = await db_client.table("relatives").update(db_payload).eq("user_id", user_id).eq("relative_id", relative_id).execute()
    if not res.data:
        raise RelativeNotFoundError("Relative not found")
    return res.data[0]

@catch_database_error
async def update_name(user_id:str, first_name:str, last_name:str, db_client):
    db_payload = {"first_name": first_name, 
                  "last_name": last_name} 
    await db_client.table("users").update(db_payload).eq("user_id", user_id).execute()

#DELETE====================================================================================
@catch_database_error
async def logout_user(user_id: str, db_client):
    await db_client.table("sessions").delete().eq("user_id", user_id).execute()
  
@catch_database_error  
async def delete_existing_otp(mobile_number, db_client):
    await db_client.table("otp_verifications").delete().eq("mobile_number", mobile_number).execute()
    
@catch_database_error
async def delete_relatives(user_id: str, relative_id:str, db_client):
    res = await db_client.table("relatives").select().eq("user_id", user_id).eq("relative_id", relative_id).execute()
    if not res.data:
        raise RelativeNotFoundError("Relative not found")
    res = await db_client.table("relatives").delete().eq("user_id", user_id).eq("relative_id", relative_id).execute()
      
# removes old OTP codes that are no longer valid
async def clean_up_expired_otp(db_client):
    try:
        await db_client.table("otp_verifications").delete().lt("expires_at", datetime.now(timezone.utc).isoformat()).execute()
    except Exception as e:
        print("An error happened",e)
        
