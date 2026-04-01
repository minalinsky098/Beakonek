from datetime import datetime, timezone

class DatabaseError(Exception):
    pass
class DuplicateMobileError(DatabaseError):
    pass

class SessionNotFoundError(DatabaseError):
    pass

def catch_database_error(func):
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
async def add_user_to_database(mobile_number, db_client):
    try: 
        db_payload = {
            "mobile_number": mobile_number
        }
        await db_client.table("users").insert(db_payload).execute()
    except Exception as e:
        raise DuplicateMobileError("Mobile number already in database")
 
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
    await db_client.table("relatives").insert(db_payload).execute()
    
#READ ==================================================================================
@catch_database_error
async def get_session(session_id: str, db_client):
    res = await db_client.table("sessions").select().eq("session_id", session_id).execute()
    if not res.data:
        raise SessionNotFoundError("Session Not found")
    return res.data[0]["user_id"]

@catch_database_error
async def get_user(mobile_number: str, db_client):
    res = await db_client.table("users").select().eq("mobile_number", mobile_number).execute()
    return res.data[0]["user_id"]
 
#UPDATE ============================================================================  
@catch_database_error
async def update_coordinates(latitude: float, longitude: float, user_id: str, db_client):
    db_payload = {"latitude": latitude, "longitude": longitude}
    await db_client.table("users").update(db_payload).eq("user_id", user_id).execute()

#DELETE====================================================================================
@catch_database_error
async def logout_user(user_id: str, db_client):
    await db_client.table("sessions").delete().eq("user_id", user_id).execute()
  
@catch_database_error  
async def delete_existing_otp(mobile_number, db_client):
    await db_client.table("otp_verifications").delete().eq("mobile_number", mobile_number).execute()
    
#scheduler to cleanup expired otp
async def clean_up_expired_otp(db_client):
    try:
        await db_client.table("otp_verifications").delete().lt("expires_at", datetime.now(timezone.utc).isoformat()).execute()
    except Exception as e:
        print("An error happened",e)