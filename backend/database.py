import os
import json
from datetime import datetime
import uuid

# Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = "bhasha_bridge"
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

os.makedirs(DATA_DIR, exist_ok=True)

# Try importing pymongo, catch if not installed
USE_MONGO = False
db_client = None
mongo_db = None

try:
    import pymongo
    from pymongo.errors import ConnectionFailure
    db_client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    # Check connection
    db_client.admin.command('ping')
    mongo_db = db_client[DB_NAME]
    USE_MONGO = True
    print("[DB] Connected successfully to MongoDB!")
except Exception as e:
    print(f"[DB] MongoDB client initialization failed or not running: {e}. Using JSON file fallback.")
    USE_MONGO = False


class JSONCollection:
    def __init__(self, name):
        self.filepath = os.path.join(DATA_DIR, f"{name}.json")
        if not os.path.exists(self.filepath):
            self._save([])

    def _load(self):
        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []

    def _save(self, data):
        with open(self.filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, default=str)

    def find_one(self, query):
        data = self._load()
        for item in data:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    def find(self, query=None, sort=None, limit=None):
        data = self._load()
        results = []
        for item in data:
            if not query:
                results.append(item)
                continue
            match = True
            for k, v in query.items():
                # Simple check for nested dict or lists can be extended, do basic equality
                if item.get(k) != v:
                    match = False
                    break
            if match:
                results.append(item)
        
        # Simple sorting if specified (e.g. [('created_at', -1)])
        if sort:
            key, direction = sort[0]
            reverse = direction == -1
            results.sort(key=lambda x: x.get(key, ""), reverse=reverse)

        if limit:
            results = results[:limit]
            
        return results

    def insert_one(self, document):
        data = self._load()
        if "_id" not in document:
            document["_id"] = str(uuid.uuid4())
        # Ensure datetimes are serialized to strings
        for k, v in document.items():
            if isinstance(v, datetime):
                document[k] = v.isoformat()
        data.append(document)
        self._save(data)
        return document

    def update_one(self, query, update):
        data = self._load()
        updated = False
        for item in data:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                # Basic support for "$set"
                if "$set" in update:
                    for k, v in update["$set"].items():
                        if isinstance(v, datetime):
                            v = v.isoformat()
                        item[k] = v
                else:
                    for k, v in update.items():
                        if isinstance(v, datetime):
                            v = v.isoformat()
                        item[k] = v
                updated = True
                break
        if updated:
            self._save(data)
        return updated

    def delete_one(self, query):
        data = self._load()
        initial_len = len(data)
        data = [item for item in data if not all(item.get(k) == v for k, v in query.items())]
        self._save(data)
        return len(data) < initial_len

    def count_documents(self, query=None):
        if not query:
            return len(self._load())
        return len(self.find(query))


# Database interface abstraction
class Database:
    def __init__(self):
        if USE_MONGO:
            self.users = mongo_db["users"]
            self.history = mongo_db["history"]
            self.dictionary = mongo_db["dictionary"]
            self.logs = mongo_db["logs"]
        else:
            self.users = JSONCollection("users")
            self.history = JSONCollection("history")
            self.dictionary = JSONCollection("dictionary")
            self.logs = JSONCollection("logs")
            
        self._initialize_defaults()

    def _initialize_defaults(self):
        # Create seed dictionary if empty
        if self.dictionary.count_documents({}) == 0:
            default_slangs = [
                {
                    "slang": "Bhai",
                    "meaning": "Brother or friend, used commonly to address someone familiarly.",
                    "example": "Bhai, tension mat le, sab theek ho jayega.",
                    "translation": "Don't worry, my friend, everything will be fine.",
                    "tone": "Friendly / Reassuring",
                    "language": "Hinglish",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Jugaad",
                    "meaning": "A flexible, innovative, or makeshift fix; a clever workaround.",
                    "example": "Kuch jugaad lagake kaam khatam karte hain.",
                    "translation": "Let us find a clever workaround to finish the task.",
                    "tone": "Resourceful / Casual",
                    "language": "Hinglish",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Ghanta",
                    "meaning": "Expression used to denote disbelief or expressing 'nonsense' / 'absolutely nothing'.",
                    "example": "Usko ghanta kuch pata hai.",
                    "translation": "He knows absolutely nothing about it.",
                    "tone": "Sarcastic / Expressive",
                    "language": "Hinglish",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Lay Bhari",
                    "meaning": "Awesome, superb, or excellent.",
                    "example": "Ha movie tar lay bhari aahe!",
                    "translation": "This movie is absolutely awesome!",
                    "tone": "Enthusiastic / Casual",
                    "language": "Marathi",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Kola Mass",
                    "meaning": "Extremely awesome, ultra-cool, or killer attitude.",
                    "example": "Thala's entry was kola mass!",
                    "translation": "The actor's entrance was extremely spectacular and powerful!",
                    "tone": "Enthusiastic / Fanatic",
                    "language": "Tamil",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Lyadh",
                    "meaning": "State of absolute laziness or reluctance to work.",
                    "example": "Aaj khub lyadh lagche, kichu korbo na.",
                    "translation": "I feel extremely lazy today; I will not do anything.",
                    "tone": "Leisurely / Reluctant",
                    "language": "Bengali",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Fatafati",
                    "meaning": "Excellent, brilliant, or amazing.",
                    "example": "Ranna ta fatafati hoyeche.",
                    "translation": "The food tasted absolutely delicious and amazing.",
                    "tone": "Appreciative / Enthusiastic",
                    "language": "Bengali",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                },
                {
                    "slang": "Chalta Hai",
                    "meaning": "Indifferent attitude towards quality; 'it is acceptable' or 'let it pass'.",
                    "example": "Thoda sa mistake hai, chalta hai.",
                    "translation": "There is a minor mistake, but it is acceptable.",
                    "tone": "Indifferent / Easygoing",
                    "language": "Hinglish",
                    "approved": True,
                    "created_at": datetime.utcnow().isoformat(),
                    "created_by": "system"
                }
            ]
            for slang in default_slangs:
                self.dictionary.insert_one(slang)
        
        # Create seed admin user if not exists
        if self.users.count_documents({"email": "admin@bhashabridge.com"}) == 0:
            # Hash 'admin123' manually so we don't depend on auth.py during db initialization
            # Since bcrypt handles salt, let's write a placeholder and hash it properly or use a simple system
            # We'll use passlib bcrypt. Hash of "admin123" is:
            # $2b$12$R.S4w6T3Z4.Kz525B6d53epxP5.3N9tqL46gXz9vX7h6n02zW.X3O
            admin_user = {
                "name": "System Admin",
                "email": "admin@bhashabridge.com",
                "password": "$2b$12$R.S4w6T3Z4.Kz525B6d53epxP5.3N9tqL46gXz9vX7h6n02zW.X3O", # admin123
                "phone": "+919999999999",
                "country": "India",
                "preferred_language": "Hinglish",
                "account_type": "Admin",
                "created_at": datetime.utcnow().isoformat()
            }
            self.users.insert_one(admin_user)

    def log_activity(self, user_email, action, details):
        log_entry = {
            "user": user_email,
            "action": action,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.logs.insert_one(log_entry)

db = Database()
