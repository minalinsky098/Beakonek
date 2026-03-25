from datetime import datetime, timezone

#scheduler to cleanup expired otp
async def clean_up_expired_otp(db_client):
    try:
        await db_client.table("otp_verifications").delete().lt("expires_at", datetime.now(timezone.utc).isoformat()).execute()
    except Exception as e:
        print("An error happened",e)