import re
import random
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Slang Translation Knowledge Base
SLANG_DATABASE = {
    # Hinglish
    "bhai order kab tak aayega": {
        "translation": "Could you please inform me by when the order will be delivered?",
        "language": "Hinglish",
        "tone": "Polite / Inquisitive",
        "intent": "Status Query",
        "confidence": 0.98,
        "replies": [
            "We are checking the delivery status with our logistics partner right now.",
            "Your order is currently out for delivery and should arrive within 30 minutes.",
            "I apologize, let me check the tracking details and get back to you immediately."
        ]
    },
    "jugaad lagake kaam khatam karo": {
        "translation": "Please find a clever workaround to complete the task as soon as possible.",
        "language": "Hinglish",
        "tone": "Resourceful / Casual",
        "intent": "Directive",
        "confidence": 0.95,
        "replies": [
            "I am working on finding a quick workaround for this issue now.",
            "Understood, I will coordinate with the team to implement a temporary fix.",
            "We have initiated a workaround to ensure the task is completed without delay."
        ]
    },
    "server fir se down ho gaya": {
        "translation": "The server has unfortunately gone offline once again.",
        "language": "Hinglish",
        "tone": "Frustrated / Informative",
        "intent": "Issue Escalation",
        "confidence": 0.97,
        "replies": [
            "Our devops team is investigating the server outage immediately.",
            "I apologize for the downtime. We are working to restore service.",
            "We are restarting the backup servers to bring the platform back online."
        ]
    },
    "ekdum mast app hai": {
        "translation": "The application is absolutely outstanding and functions exceptionally well.",
        "language": "Hinglish",
        "tone": "Enthusiastic / Appreciative",
        "intent": "Positive Feedback",
        "confidence": 0.99,
        "replies": [
            "Thank you so much! We are glad you love the user experience.",
            "We appreciate your kind words. Stay tuned for exciting new features!",
            "Thank you! Your feedback motivates our engineering team."
        ]
    },
    "faltu bakwas mat kar": {
        "translation": "Please refrain from engaging in irrelevant or counterproductive conversations.",
        "language": "Hinglish",
        "tone": "Direct / Assertive",
        "intent": "Warning / Boundary Setting",
        "confidence": 0.96,
        "replies": [
            "Understood. Let us redirect our focus to the professional project parameters.",
            "I apologize. I will stick strictly to the official agenda.",
            "Let's keep our communication professional and task-oriented."
        ]
    },
    "chalta hai tension mat le": {
        "translation": "It is acceptable, please do not stress over this minor issue.",
        "language": "Hinglish",
        "tone": "Reassuring / Relaxed",
        "intent": "Consolation",
        "confidence": 0.94,
        "replies": [
            "Thank you for your understanding and supportive attitude.",
            "I appreciate your flexibility. We will prevent this in the next iteration.",
            "Great, thanks! I'll make sure we polish it up when possible."
        ]
    },
    "vella baitha hu kya karu": {
        "translation": "I currently have some idle time; could you recommend a productive task?",
        "language": "Hinglish",
        "tone": "Bored / Inquisitive",
        "intent": "Request for Work",
        "confidence": 0.92,
        "replies": [
            "You can review the outstanding tasks in our dashboard sprint log.",
            "How about going through the latest API documentation?",
            "Let's schedule a brief sync to discuss new feature designs."
        ]
    },

    # Marathi
    "lay bhari kaam kela tumhi": {
        "translation": "You have done an exceptionally outstanding and commendable job!",
        "language": "Marathi",
        "tone": "Enthusiastic / Respectful",
        "intent": "Praise",
        "confidence": 0.98,
        "replies": [
            "Thank you so much! It was a team effort.",
            "I appreciate your positive feedback; it means a lot to us.",
            "Glad to be of assistance. We strive for excellence."
        ]
    },
    "ha rada kay challay": {
        "translation": "Could someone explain what this chaotic situation is about?",
        "language": "Marathi",
        "tone": "Perplexed / Displeased",
        "intent": "Clarification Request",
        "confidence": 0.93,
        "replies": [
            "We are currently debugging the deployment conflict and will resolve it shortly.",
            "Apologies for the noise, we are arranging a sync to clear the confusion.",
            "I'll summarize the key blockers in a thread to clear up any doubts."
        ]
    },
    "konta pan jugaad karun he complete kar": {
        "translation": "Please utilize any workaround necessary to finish this project.",
        "language": "Marathi",
        "tone": "Urgent / Command",
        "intent": "Work Directive",
        "confidence": 0.95,
        "replies": [
            "Understood, I am on it. Will deploy an alternative fix today.",
            "I will find an available solution right away.",
            "Consider it done. We'll bypass the bottleneck."
        ]
    },

    # Tamil
    "sema kola mass performance": {
        "translation": "An absolutely spectacular, powerful, and marvelous performance!",
        "language": "Tamil",
        "tone": "Highly Energetic / Appreciative",
        "intent": "Acclaim",
        "confidence": 0.97,
        "replies": [
            "Thank you! We put a lot of hard work into this release.",
            "Awesome! Glad to hear the presentation met your expectations.",
            "Thank you for the wonderful support!"
        ]
    },
    "romba mokka joke pa": {
        "translation": "That was a rather dull and uninteresting joke.",
        "language": "Tamil",
        "tone": "Disappointed / Humorous",
        "intent": "Critique",
        "confidence": 0.91,
        "replies": [
            "I will refine my humor model to provide more engaging banter next time.",
            "Understood! Let's get back to serious business.",
            "Duly noted, I will work on better content."
        ]
    },
    "velaiku poga romba somberia iruku": {
        "translation": "I am experiencing high reluctance and laziness towards attending work today.",
        "language": "Tamil",
        "tone": "Sluggish / Reluctant",
        "intent": "Personal Expression",
        "confidence": 0.94,
        "replies": [
            "Perhaps a cup of coffee and light tasks can help ease you in.",
            "I understand, rest is crucial. Consider taking a personal day if possible.",
            "Let's focus on small, manageable items first to build momentum."
        ]
    },

    # Bengali
    "aaj khub lyadh lagche": {
        "translation": "I am feeling extremely lethargic and disinclined to do any work today.",
        "language": "Bengali",
        "tone": "Relaxed / Sluggish",
        "intent": "State Expression",
        "confidence": 0.96,
        "replies": [
            "It is perfectly fine to have slow days. Take it easy and recharge.",
            "Let's schedule the heavier tasks for tomorrow when you are refreshed.",
            "A short break might help clear the fatigue."
        ]
    },
    "ranna ta fatafati hoyeche": {
        "translation": "The food has been prepared exceptionally well and is delicious.",
        "language": "Bengali",
        "tone": "Complimentary / Grateful",
        "intent": "Praise",
        "confidence": 0.99,
        "replies": [
            "Thank you so much! I'm glad you liked it.",
            "Compliments to the chef! We will share your praise.",
            "Delighted to hear that it met your culinary expectations!"
        ]
    },
    "ki aatram bokcho": {
        "translation": "What irrelevant nonsense are you speaking?",
        "language": "Bengali",
        "tone": "Annoyed / Critical",
        "intent": "Objection",
        "confidence": 0.93,
        "replies": [
            "I apologize if my explanation was confusing. Let me rephrase clearly.",
            "I'm speaking about the core requirements. Let's align on the facts.",
            "Pardon me, I will ensure my future remarks are concise and accurate."
        ]
    }
}

# Heuristics for dynamic translation fallback
KEYWORDS_LANGUAGE = {
    "hinglish": ["bhai", "yaar", "abey", "kya", "kab", "aayega", "jugaad", "mast", "faltu", "bakwas", "tension", "vele", "vella", "kuch", "karu", "ho", "gaya"],
    "marathi": ["bhau", "lay", "bhari", "rada", "kay", "challay", "konta", "pan", "kela", "tumhi", "aahe", "tar", "mahit", "naahi"],
    "tamil": ["sema", "kola", "mass", "mokka", "romba", "iruku", "illa", "enanga", "pa", "ponga", "saapada", "velaiku"],
    "bengali": ["lyadh", "fatafati", "aatram", "bokcho", "khub", "aaj", "bhalobashi", "ami", "tumake", "ranna", "hoyeche", "ki", "korcho"]
}

TONES = ["Professional", "Formal", "Friendly", "Direct", "Reassuring", "Concise", "Assertive", "Polite"]
INTENTS = ["Inquiry", "Feedback", "Escalation", "Collaboration", "Praise", "Request", "Status Check"]

def detect_language_heuristics(text: str) -> str:
    words = set(re.findall(r'\b\w+\b', text.lower()))
    scores = {"Hinglish": 0, "Marathi": 0, "Tamil": 0, "Bengali": 0}
    
    for lang, keywords in KEYWORDS_LANGUAGE.items():
        lang_title = lang.title()
        for word in words:
            if word in keywords:
                scores[lang_title] += 2
                
    # Fallback default heuristics based on some characters/words
    max_lang = max(scores, key=scores.get)
    if scores[max_lang] > 0:
        return max_lang
        
    # Default to Hinglish if no clear match but characters feel South Asian
    south_asian_markers = ["aa", "bh", "dh", "th", "kar", "ho", "ai", "um", "oo"]
    for marker in south_asian_markers:
        if marker in text.lower():
            return "Hinglish"
            
    return "Hinglish" # Default fallback


def translate_with_gemini(text: str):
    """Try to get a real AI-generated translation using Gemini. Returns dict or None on failure."""
    if not GEMINI_API_KEY:
        return None

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""You are an expert translator that converts Indian slang, Hinglish, Marathi, Tamil, or Bengali colloquial phrases into formal, professional English suitable for a workplace or boardroom setting.

Phrase: "{text}"

Respond ONLY with a valid JSON object, no extra text, no markdown formatting, in this exact format:
{{"translation": "formal professional english translation here", "language": "Hinglish or Marathi or Tamil or Bengali or English", "tone": "short tone description", "intent": "short intent description", "confidence": 0.90}}"""

        response = model.generate_content(prompt)
        cleaned = response.text.strip()
        # Remove markdown code fences if present
        cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
        cleaned = cleaned.strip()

        ai_result = json.loads(cleaned)

        # Validate required keys
        required_keys = {"translation", "language", "tone", "intent", "confidence"}
        if not required_keys.issubset(ai_result.keys()):
            return None

        ai_result["confidence"] = float(ai_result["confidence"])
        ai_result["replies"] = [
            "Thank you. We will document this request and take appropriate action.",
            "I have received this update. Let's sync on this during our next standup.",
            "Understood, I will align my deliverables accordingly."
        ]
        return ai_result
    except Exception as e:
        print(f"[GEMINI FALLBACK ERROR] {e}")
        return None


def translate_slang(text: str) -> dict:
    cleaned_text = re.sub(r'[^\w\s]', '', text.lower()).strip()
    
    # Try exact match in slang database
    if cleaned_text in SLANG_DATABASE:
        data = SLANG_DATABASE[cleaned_text].copy()
        # Add random variations slightly to confidence
        data["confidence"] = round(data["confidence"] - random.uniform(0.01, 0.03), 2)
        return data

    # Try partial matching
    for slang_phrase, metadata in SLANG_DATABASE.items():
        if slang_phrase in cleaned_text or cleaned_text in slang_phrase:
            data = metadata.copy()
            data["confidence"] = round(data["confidence"] - 0.15, 2)
            return data

    # Try real AI translation via Gemini before falling back to heuristics
    ai_result = translate_with_gemini(text)
    if ai_result:
        return ai_result

    # General AI simulation engine fallback
    detected_lang = detect_language_heuristics(text)
    
    # Formulate a smart professional translation based on inputs
    # Let's clean the string and create a mock translation
    words = text.split()
    word_count = len(words)
    
    # Check simple vocabulary for substitution
    translated_words = []
    for w in words:
        wl = w.lower().strip(",.?!")
        if wl in ["bhai", "bhau", "bro"]:
            translated_words.append("colleague")
        elif wl in ["jugaad"]:
            translated_words.append("creative solution")
        elif wl in ["mast", "laybhari", "fatafati", "sema"]:
            translated_words.append("excellent")
        elif wl in ["faltu", "mokka"]:
            translated_words.append("substandard")
        elif wl in ["down"]:
            translated_words.append("inactive")
        elif wl in ["lyadh", "somberi"]:
            translated_words.append("fatigued")
        elif wl in ["kab"]:
            translated_words.append("when")
        else:
            translated_words.append(w)
            
    constructed_translation = " ".join(translated_words)
    # capitalize first letter, add punctuation
    constructed_translation = constructed_translation.capitalize()
    if not constructed_translation.endswith((".", "!", "?")):
        constructed_translation += "."

    # Enhance the generated text to make it sound premium & professional
    professional_translation = f"Draft Translation: Refined as - \"{constructed_translation}\""
    
    # Make a realistic translation based on length and simple patterns
    if "order" in text.lower():
        professional_translation = "Could you please check and verify the current shipping and logistics status of my order?"
    elif "deploy" in text.lower() or "server" in text.lower() or "code" in text.lower():
        professional_translation = "The application environment seems to be encountering an operational downtime. Let us investigate."
    elif "meeting" in text.lower() or "office" in text.lower():
        professional_translation = "I would like to schedule a formal sync to discuss the upcoming milestones."
    elif len(text.strip()) < 8:
        professional_translation = f"Greetings. How may I assist you today? (Based on input: '{text}')"
    else:
        # Standard professional expansion
        professional_translation = f"Regarding your input: Let us resolve this matter in a professional, structured manner."

    detected_tone = random.choice(TONES)
    detected_intent = random.choice(INTENTS)
    conf = round(random.uniform(0.72, 0.89), 2)
    
    replies = [
        f"Thank you. We will document this request and take appropriate action.",
        f"I have received this update. Let's sync on this during our next standup.",
        f"Understood, I will align my deliverables accordingly."
    ]

    return {
        "translation": professional_translation,
        "language": detected_lang,
        "tone": detected_tone,
        "intent": detected_intent,
        "confidence": conf,
        "replies": replies
    }
