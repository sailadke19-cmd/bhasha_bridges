import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, translate, dictionary, admin

app = FastAPI(
    title="Bhasha Bridge API",
    description="API Engine for Bhasha Bridge – AI-Powered Indian Slang Translator",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Allow all for seamless local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(translate.router)
app.include_router(dictionary.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Bhasha Bridge AI Slang Translation API Engine!",
        "status": "active",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # Allow running directly from script
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
