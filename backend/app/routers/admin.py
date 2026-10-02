import psutil
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import UserResponse
from app.services.auth_service import get_current_admin, get_password_hash
from app.schemas import UserCreate

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """List all registered users (Admin only)"""
    return db.query(User).all()


@router.put("/users/{user_id}/reset-password")
def reset_user_password(user_id: str, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Force reset a user's password to a default value (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    default_password = "TemporaryPassword123!"
    user.hashed_password = get_password_hash(default_password)
    db.commit()
    
    return {"message": f"Password for {user.username} reset successfully", "new_password": default_password}


@router.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Delete a user from the database (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/users")
def add_user(user_data: UserCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Add a new user directly to the database (Admin only)"""
    db_user = db.query(User).filter((User.username == user_data.username) | (User.email == user_data.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or Email already registered")
        
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role="user",
        is_verified=True  # Admin created users are auto-verified
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User added successfully", "user": new_user.username}

@router.get("/system/metrics")
def get_system_metrics(current_admin: User = Depends(get_current_admin)):
    """Return simulated or real system metrics like CPU/Memory (Admin only)"""
    return {
        "cpu_usage_percent": psutil.cpu_percent(interval=0.5),
        "memory_usage_percent": psutil.virtual_memory().percent,
        "disk_usage_percent": psutil.disk_usage('/').percent
    }
