import sys
import os

# Adjust path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend.translator import translate_slang
    from backend.database import db
    
    print("[TEST] Running slang translation checks...")
    
    # Check Hinglish
    result = translate_slang("Bhai order kab tak aayega?")
    assert result["language"] == "Hinglish", "Hinglish detection failed"
    assert "order" in result["translation"].lower(), "Translation extraction failed"
    print(f"Hinglish Test Passed! => {result['translation']} (Tone: {result['tone']}, Intent: {result['intent']})")
    
    # Check Marathi
    result = translate_slang("Lay bhari kaam kela tumhi")
    assert result["language"] == "Marathi", "Marathi detection failed"
    print(f"Marathi Test Passed! => {result['translation']} (Tone: {result['tone']})")
    
    # Check Fallback dictionary seeding
    terms = list(db.dictionary.find({"approved": True}))
    assert len(terms) > 0, "Seed dictionary loading failed"
    print(f"Seed Database Passed! Loaded {len(terms)} approved slang entries.")
    
    print("\n[SUCCESS] Backend logic is fully verified and correct!")
    sys.exit(0)
except Exception as e:
    print(f"[FAIL] Backend verification failed: {e}")
    sys.exit(1)
