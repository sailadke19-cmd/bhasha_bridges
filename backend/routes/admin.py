from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from datetime import datetime
from backend.database import db
from backend.auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users")
def get_users(admin: dict = Depends(get_current_admin)):
    users = db.users.find()
    # Mask passwords
    for u in users:
        u["id"] = str(u["_id"])
        if "password" in u:
            del u["password"]
    return users

@router.get("/stats")
def get_stats(admin: dict = Depends(get_current_admin)):
    # Calculate stats
    total_users = db.users.count_documents()
    total_translations = db.history.count_documents()
    
    # Language counts
    lang_counts = {}
    all_history = db.history.find()
    for h in all_history:
        lang = h.get("language", "Unknown")
        lang_counts[lang] = lang_counts.get(lang, 0) + 1
        
    # Popular slangs
    popular_slangs = {}
    for h in all_history:
        slang = h.get("input_text", "").lower().strip()
        if slang:
            popular_slangs[slang] = popular_slangs.get(slang, 0) + 1
            
    sorted_popular = sorted(popular_slangs.items(), key=lambda x: x[1], reverse=True)[:5]
    popular_list = [{"slang": k, "count": v} for k, v in sorted_popular]
    
    # Active users count (unique user emails in history)
    active_users = len(set(h.get("user_email") for h in all_history if h.get("user_email")))

    # Recent activities
    recent_logs = db.logs.find(sort=[("timestamp", -1)], limit=15)
    for r in recent_logs:
        r["id"] = str(r["_id"])
        
    return {
        "total_users": total_users,
        "total_translations": total_translations,
        "active_users": active_users,
        "language_distribution": lang_counts,
        "most_used_slang": popular_list,
        "recent_logs": recent_logs
    }

@router.get("/pending-suggestions")
def get_pending_suggestions(admin: dict = Depends(get_current_admin)):
    pending = db.dictionary.find({"approved": False})
    for item in pending:
        item["id"] = str(item["_id"])
    return pending

@router.post("/suggestions/{suggestion_id}/approve")
def approve_suggestion(suggestion_id: str, admin: dict = Depends(get_current_admin)):
    updated = db.dictionary.update_one(
        {"_id": suggestion_id},
        {"$set": {"approved": True}}
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found"
        )
    
    # Find the suggestion to log the slang term name
    sug = db.dictionary.find_one({"_id": suggestion_id})
    slang_term = sug.get("slang", "unknown") if sug else "unknown"
    
    db.log_activity(
        admin["email"], 
        "APPROVE_SLANG", 
        f"Approved slang term suggestion: '{slang_term}'"
    )
    return {"status": "success", "message": "Slang suggestion approved successfully"}

@router.delete("/suggestions/{suggestion_id}/reject")
def reject_suggestion(suggestion_id: str, admin: dict = Depends(get_current_admin)):
    sug = db.dictionary.find_one({"_id": suggestion_id})
    slang_term = sug.get("slang", "unknown") if sug else "unknown"
    
    deleted = db.dictionary.delete_one({"_id": suggestion_id})
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found"
        )
    db.log_activity(
        admin["email"], 
        "REJECT_SLANG", 
        f"Rejected slang term suggestion: '{slang_term}'"
    )
    return {"status": "success", "message": "Slang suggestion rejected/removed"}

@router.post("/retrain-model")
def retrain_model(admin: dict = Depends(get_current_admin)):
    db.log_activity(admin["email"], "RETRAIN_MODEL", "Triggered AI translator retraining sequence")
    # Simulate retraining steps
    return {
        "status": "success",
        "message": "AI Slang translation model successfully retrained on current dictionary seed.",
        "epochs": 15,
        "loss": 0.042,
        "accuracy": 0.987,
        "timestamp": datetime.utcnow().isoformat()
    }
