from pydantic import BaseModel, field_validator
class AuthOTPPayload(BaseModel):
    mobile_number: str
    purpose: str
    otp: str
    
    @field_validator("mobile_number")
    @classmethod
    def check_digits(cls, v):
        v = v.strip()
        MAX_DIGITS = 12
        if v[:3] != "639":
            raise ValueError("Mobile Number must be Philippine Based(639)")
        if len(v) != MAX_DIGITS:
            raise ValueError("Mobile number must be 11 digits")
        return v
    
    @field_validator("purpose")
    @classmethod
    def check_purpose(cls, v):
        if v not in ("registration", "login"):
            raise ValueError("Purpose not found")
        return v

class RequestOTPPayload(BaseModel):
    mobile_number: str
    purpose: str

    @field_validator("mobile_number")
    @classmethod
    def check_digits(cls, v):
        v = v.strip()
        MAX_DIGITS = 12
        if v[:3] != "639":
            raise ValueError("Mobile Number must be Philippine Based(639)")
        if len(v) != MAX_DIGITS:
            raise ValueError("Mobile number must be 11 digits")
        return v
    
    @field_validator("purpose")
    @classmethod
    def check_purpose(cls, v):
        if v not in ("registration", "login"):
            raise ValueError("Invalid Purpose")
        return v