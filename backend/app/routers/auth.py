from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import random
import string
import uuid
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, UserProfile
from app.schemas import UserCreate, UserLogin, Token, UserResponse, UserProfileUpdate, VerifyOTPRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, GoogleAuthRequest
from app.services.auth_service import get_password_hash, verify_password, create_access_token, get_current_user
from app.services.emails import send_otp_email, send_reset_password_email
import os

router = APIRouter(prefix="/api/auth", tags=["auth"])
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

@router.post("/signup")
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter((User.username == user_data.username) | (User.email == user_data.email)).first()
    if db_user:
        if db_user.is_verified:
            raise HTTPException(status_code=400, detail="Username or Email already registered")
        else:
            # User exists but is unverified, resend OTP
            otp = generate_otp()
            db_user.hashed_password = get_password_hash(user_data.password)
            db_user.verification_otp = otp
            db.commit()
            send_otp_email(db_user.email, otp)
            return {"message": "Verification code resent. Please verify your email with the OTP."}
        
    hashed_pw = get_password_hash(user_data.password)
    is_first = db.query(User).count() == 0
    role = "admin" if is_first else "user"
    
    otp = generate_otp()
    
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pw,
        role=role,
        verification_otp=otp,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    profile = UserProfile(user_id=new_user.id)
    db.add(profile)
    db.commit()
    
    send_otp_email(new_user.email, otp)
    
    return {"message": "Signup successful. Please verify your email with the OTP."}

@router.post("/verify-otp", response_model=Token)
def verify_otp(data: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.verification_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user.is_verified = True
    user.verification_otp = None
    db.commit()
    
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "role": user.role}

@router.post("/google", response_model=Token)
def google_auth(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        import urllib.request
        import json
        req = urllib.request.Request(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={data.token}")
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                raise ValueError("Invalid token")
            idinfo = json.loads(response.read().decode())
        email = idinfo['email']
        name = idinfo.get('name', '')
        google_id = idinfo['sub']
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create new user via Google
        is_first = db.query(User).count() == 0
        role = "admin" if is_first else "user"
        base_username = email.split('@')[0]
        
        # Ensure unique username
        username = base_username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1
            
        user = User(
            username=username,
            email=email,
            role=role,
            is_verified=True,
            auth_provider="google",
            google_id=google_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        profile = UserProfile(user_id=user.id, full_name=name)
        db.add(profile)
        db.commit()
    else:
        # Link google account if not already linked
        if not user.google_id:
            user.google_id = google_id
            user.auth_provider = "google"
            user.is_verified = True
            db.commit()

    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "role": user.role}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not user.hashed_password or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your email.")
        
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "role": user.role}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        otp = generate_otp()
        user.reset_token = otp
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        
        # We reuse the OTP email template instead of a link!
        send_otp_email(user.email, otp)
        
    return {"message": "If an account with that email exists, a password reset code has been sent."}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == data.token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user.hashed_password = get_password_hash(data.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    
    return {"message": "Password has been reset successfully."}

@router.put("/change-password")
def change_password(data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.auth_provider == "google" and not current_user.hashed_password:
        # Allow setting password for the first time if they logged in with Google
        pass
    elif not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(profile_data: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        
    for key, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
        
    db.commit()
    db.refresh(current_user)
    return current_user
