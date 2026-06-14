from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from backend.database import db
from backend.auth import oauth2_scheme, decode_access_token, get_current_user
from backend.translator import translate_slang

router = APIRouter(prefix="/api", tags=["translate"])

class TranslationRequest(BaseModel):
    text: str

# Helper to retrieve user optionally
def get_current_user_optional(request: Request, token: Optional[str] = Depends(oauth2_scheme)):
    # Try fetching bearer token from Authorization header if oauth2_scheme doesn't supply it
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        return None
        
    payload = decode_access_token(token)
    if not payload:
        return None
        
    email = payload.get("sub")
    if not email:
        return None
        
    return db.users.find_one({"email": email})


@router.post("/translate")
def translate(req: TranslationRequest, user: Optional[dict] = Depends(get_current_user_optional)):
    if not req.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text input cannot be empty"
        )
        
    # Run dynamic translation simulation
    result = translate_slang(req.text)
    
    # Save to history if logged in
    history_id = None
    if user:
        history_entry = {
            "user_email": user["email"],
            "input_text": req.text,
            "translation": result["translation"],
            "language": result["language"],
            "tone": result["tone"],
            "intent": result["intent"],
            "confidence": result["confidence"],
            "replies": result["replies"],
            "favorite": False,
            "created_at": datetime.utcnow().isoformat()
        }
        db.history.insert_one(history_entry)
        history_id = str(history_entry["_id"])
        
        # Log active translation
        db.log_activity(user["email"], "TRANSLATE", f"Translated slang phrase from {result['language']}")
        
    return {
        "id": history_id,
        "input_text": req.text,
        "translation": result["translation"],
        "language": result["language"],
        "tone": result["tone"],
        "intent": result["intent"],
        "confidence": result["confidence"],
        "replies": result["replies"],
        "favorite": False
    }

@router.get("/history")
def get_history(current_user: dict = Depends(get_current_user)):
    user_history = db.history.find(
        {"user_email": current_user["email"]},
        sort=[("created_at", -1)]
    )
    # Ensure ID formats are strings
    for h in user_history:
        h["id"] = str(h["_id"])
    return user_history

@router.post("/history/{history_id}/favorite")
def toggle_favorite(history_id: str, current_user: dict = Depends(get_current_user)):
    # Find item
    item = db.history.find_one({"_id": history_id, "user_email": current_user["email"]})
    if not item:
        # Check if ID was stored as object or string
        # PyMongo fallback handle
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
        )
        
    new_fav_status = not item.get("favorite", False)
    db.history.update_one(
        {"_id": history_id},
        {"$set": {"favorite": new_fav_status}}
    )
    
    db.log_activity(
        current_user["email"], 
        "FAVORITE_TOGGLE", 
        f"Toggled favorite for {history_id} to {new_fav_status}"
    )
    
    return {"id": history_id, "favorite": new_fav_status, "status": "success"}

@router.delete("/history/{history_id}")
def delete_history_item(history_id: str, current_user: dict = Depends(get_current_user)):
    deleted = db.history.delete_one({"_id": history_id, "user_email": current_user["email"]})
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="History item not found"
        )
    db.log_activity(current_user["email"], "HISTORY_DELETE", f"Deleted history item {history_id}")
    return {"status": "success", "message": "History item deleted successfully"}

@router.get("/favorites")
def get_favorites(current_user: dict = Depends(get_current_user)):
    user_favs = db.history.find(
        {"user_email": current_user["email"], "favorite": True},
        sort=[("created_at", -1)]
    )
    for h in user_favs:
        h["id"] = str(h["_id"])
    return user_favs
