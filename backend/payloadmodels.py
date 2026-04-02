from pydantic import BaseModel, field_validator
class AuthOTPPayload(BaseModel):
    mobile_number: str
    purpose: str
    otp: str
    first_name: str | None = None
    last_name: str | None = None
    
    @field_validator("mobile_number")
    @classmethod
    def check_digits(cls, v):
        return validate_mobile_number(v)
    
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
        return validate_mobile_number(v)
    
    @field_validator("purpose")
    @classmethod
    def check_purpose(cls, v):
        if v not in ("registration", "login"):
            raise ValueError("Invalid Purpose")
        return v
    
class LocationPayload(BaseModel):
    latitude: float
    longitude: float
    
    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v):
        if not(4.5 <= v <= 21.5):
            raise ValueError("Invalid latitude coordinates(PH based only)")
        return v
    
    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v):
        if not(114.0 <= v <= 127.0):
            raise ValueError("Invalid longitude coordinates(PH based only)")
        return v
    
class RelativesPayload(BaseModel):
    relative_name: str
    relative_number: str
    
    @field_validator("relative_number")
    @classmethod
    def check_digits(cls, v):
        return validate_mobile_number(v)
 
class UpdateNamePayload(BaseModel):
    first_name: str
    last_name: str
    
def validate_mobile_number(mobile_number):
    mobile_number = mobile_number.strip()
    MAX_DIGITS = 12
    if mobile_number[:3] != "639":
        raise ValueError("Mobile Number must be Philippine Based(639)")
    if len(mobile_number) != MAX_DIGITS:
        raise ValueError("Mobile number must be 11 digits")
    return mobile_number