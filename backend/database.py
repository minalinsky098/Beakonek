from datetime import datetime, timezone

class DuplicateMobileError(Exception):
    pass
#scheduler to cleanup expired otp
async def clean_up_expired_otp(db_client):
    try:
        await db_client.table("otp_verifications").delete().lt("expires_at", datetime.now(timezone.utc).isoformat()).execute()
    except Exception as e:
        print("An error happened",e)
        
async def delete_existing_otp(mobile_number, db_client):
    await db_client.table("otp_verifications").delete().eq("mobile_number", mobile_number).execute() #delete all all previous otps of the number before asking for another
    
async def add_user_to_database(mobile_number, db_client):
    try: 
        db_payload = {
            "mobile_number": mobile_number
        }
        await db_client.table("users").insert(db_payload).execute()
    except Exception as e:
        raise DuplicateMobileError("Mobile number already in database")
    
async def insert_otp_entry(mobile_number: str, otp:str, purpose:str, db_client):
    db_payload = {
        "mobile_number":mobile_number,
        "otp_code": otp,
        "purpose":purpose,
        }
    db_response = await db_client.table("otp_verifications").insert(db_payload).execute()
    return db_response.data[0]["otp_code"]