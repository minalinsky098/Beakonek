from database import delete_existing_otp
from datetime import datetime, timezone

class OTPNotFoundError(Exception):
    pass

class ExpiredOTPError(Exception):
    pass

async def checkOTP(mobile_number, purpose, otp, db_client):
    res = await db_client.table("otp_verifications").select().eq("mobile_number", mobile_number).eq("purpose", purpose).execute()
    if res.data:
        response = res.data[0]
        expires_at = datetime.fromisoformat(response["expires_at"])
        if (expires_at < datetime.now(timezone.utc) or response["attempt_count"] >= 4): 
            await delete_existing_otp(mobile_number, db_client)
        elif (response["otp_code"] == otp):
            return True
        else:
            await db_client.table("otp_verifications").update({"attempt_count": response["attempt_count"]+1}).eq("mobile_number", mobile_number).eq("purpose", purpose).execute()
    else:
        res = await db_client.table("users").select().eq("mobile_number", mobile_number).execute()
        if not res.data:
            raise OTPNotFoundError("Number not registered")
        else:
            raise ExpiredOTPError("OTP Expired")
    return False
