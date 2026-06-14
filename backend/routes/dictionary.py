from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from backend.database import db
from backend.auth import get_current_user

router = APIRouter(prefix="/api/dictionary", tags=["dictionary"])

class SlangSuggestion(BaseModel):
    slang: str
    meaning: str
    example: str
    translation: str
    tone: str
    language: str

@router.get("")
def get_dictionary(search: Optional[str] = None, language: Optional[str] = None):
    query = {"approved": True}
    if language and language != "All":
        query["language"] = language
        
    items = db.dictionary.find(query)
    
    if search:
        search_lower = search.lower()
        items = [
            item for item in items 
            if search_lower in item["slang"].lower() 
            or search_lower in item["meaning"].lower()
            or search_lower in item["example"].lower()
        ]
        
    for item in items:
        item["id"] = str(item["_id"])
        
    return items

@router.post("/suggest")
def suggest_slang(req: SlangSuggestion, current_user: dict = Depends(get_current_user)):
    if not req.slang.strip() or not req.meaning.strip() or not req.translation.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fields cannot be empty"
        )
        
    # Check if slang already exists
    existing = db.dictionary.find_one({"slang": req.slang, "language": req.language})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slang term already exists in the dictionary"
        )
        
    suggestion = {
        "slang": req.slang,
        "meaning": req.meaning,
        "example": req.example,
        "translation": req.translation,
        "tone": req.tone,
        "language": req.language,
        "approved": False, # Requires admin approval
        "created_by": current_user["email"],
        "created_at": datetime.utcnow().isoformat()
    }
    
    inserted = db.dictionary.insert_one(suggestion)
    db.log_activity(
        current_user["email"], 
        "SLANG_SUGGEST", 
        f"Suggested new slang term '{req.slang}' ({req.language})"
    )
    
    return {
        "status": "success",
        "message": "Thank you! Your suggestion has been submitted for admin approval.",
        "id": str(inserted["_id"])
    }
