from database import delete_existing_otp, clean_up_expired_otp
from datetime import datetime, timezone
async def checkOTP(mobile_number, purpose, otp, db_client):
    res = await db_client.table("otp_verifications").select().eq("mobile_number", mobile_number).eq("purpose", purpose).execute()
    if res.data:
        response = res.data[0]
        expires_at = datetime.fromisoformat(response["expires_at"])
        if (expires_at < datetime.now(timezone.utc) or response["attempt_count"] >= 5): 
            await delete_existing_otp(mobile_number, db_client)
        elif (response["otp_code"] == otp):
            return True
        else:
            await db_client.table("otp_verifications").update({"attempt_count": response["attempt_count"]+1}).eq("mobile_number", mobile_number).eq("purpose", purpose).execute()
    else:
        raise ValueError("Not found")
    return False

