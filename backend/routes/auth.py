from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from backend.database import db
from backend.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: str
    phone: Optional[str] = ""
    country: Optional[str] = "India"
    preferred_language: Optional[str] = "Hinglish"

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class ForgotPasswordReq(BaseModel):
    email: EmailStr

class ResetPasswordReq(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

@router.post("/register")
def register(user_in: UserRegister):
    # Check if user exists
    existing = db.users.find_one({"email": user_in.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    hashed_pwd = get_password_hash(user_in.password)
    user_doc = {
        "name": user_in.name,
        "email": user_in.email,
        "password": hashed_pwd,
        "phone": user_in.phone,
        "country": "India",
        "preferred_language": "Hinglish",
        "account_type": "User",  # User or Admin
        "created_at": datetime.utcnow().isoformat()
    }
    
    db.users.insert_one(user_doc)
    saved_user = user_doc
    access_token = create_access_token(data={"sub": user_in.email})
    
    db.log_activity(user_in.email, "REGISTER", "User registered successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": saved_user["name"],
            "email": saved_user["email"],
            "phone": saved_user["phone"],
            "account_type": saved_user["account_type"],
            "country": saved_user["country"],
            "preferred_language": saved_user["preferred_language"]
        }
    }

@router.post("/login")
def login(credentials: UserLogin):
    user = db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user["email"]})
    db.log_activity(user["email"], "LOGIN", "User logged in successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "account_type": user.get("account_type", "User"),
            "country": user.get("country", "India"),
            "preferred_language": user.get("preferred_language", "Hinglish")
        }
    }

@router.get("/profile")
def read_profile(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": current_user.get("phone", ""),
        "account_type": current_user.get("account_type", "User"),
        "country": current_user.get("country", "India"),
        "preferred_language": current_user.get("preferred_language", "Hinglish"),
        "created_at": current_user.get("created_at")
    }

@router.put("/profile")
def update_profile(profile_in: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {
            "name": profile_in.name,
            "phone": profile_in.phone,
            "country": profile_in.country,
            "preferred_language": profile_in.preferred_language
        }}
    )
    db.log_activity(current_user["email"], "UPDATE_PROFILE", "User updated profile info")
    return {"status": "success", "message": "Profile updated successfully"}

@router.put("/change-password")
def change_password(pass_in: ChangePassword, current_user: dict = Depends(get_current_user)):
    if not verify_password(pass_in.current_password, current_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    hashed_pwd = get_password_hash(pass_in.new_password)
    db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"password": hashed_pwd}}
    )
    db.log_activity(current_user["email"], "CHANGE_PASSWORD", "User successfully changed password")
    return {"status": "success", "message": "Password changed successfully"}

@router.delete("/delete-account")
def delete_account(current_user: dict = Depends(get_current_user)):
    db.users.delete_one({"email": current_user["email"]})
    db.log_activity(current_user["email"], "DELETE_ACCOUNT", "User account deleted")
    return {"status": "success", "message": "Account deleted successfully"}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordReq):
    user = db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found with this email"
        )
    
    # Mocking sending email OTP (e.g. 782415)
    db.log_activity(req.email, "FORGOT_PASSWORD", "Reset password OTP code requested")
    return {
        "status": "success", 
        "message": f"Verification code sent to {req.email}. (Mock OTP is 123456)"
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordReq):
    if req.otp != "123456":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )
        
    user = db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    hashed_pwd = get_password_hash(req.new_password)
    db.users.update_one(
        {"email": req.email},
        {"$set": {"password": hashed_pwd}}
    )
    db.log_activity(req.email, "RESET_PASSWORD", "User reset password with OTP code")
    return {"status": "success", "message": "Password reset successfully"}
