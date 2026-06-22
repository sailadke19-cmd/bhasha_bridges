## Abstract
An AI-powered translation system called Bhasha Bridge AI Translator can understand discussions in multiple languages, regional Indian languages, and internet-based slang like Tanglish, Hinglish, and Marathi. In contrast to conventional translators, it maintains informal statements' context, tone, and meaning. The system provides precise translations and tone identification (formal, informal, urgent, etc.) using Natural Language Processing (NLP), Large Language Models (LLMs), and a proprietary Indian slang dataset. It was created with React, FastAPI, MongoDB Atlas, and Groq AI to provide real-time, context-aware translation for multilingual users, businesses, students, and customer care teams. The technology makes translations more natural and meaningful while assisting in overcoming language barriers and enhancing communication throughout India's diverse linguistic environment.

## introduction
Millions of people in India use mixed-language words like Hinglish, Tanglish, Banglish, and Marathi slang on a daily basis. The country is home to hundreds of languages and dialects. Current translation tools frequently translate words literally and are unable to comprehend the tone or true meaning of casual discussions. This leads to communication issues in social media, e-commerce, customer service, and education. By comprehending both language and context, Bhasha Bridge AI Translator resolves this issue. After identifying slang, regional idioms, abbreviations, emoticons, and casual speech, it accurately translates text while also detecting tone and providing an explanation of its meaning.

## Literature review
Multilingual translation services are available through a number of translation platforms, including Google Translate, Microsoft Translator, and India's BHASHINI project. However, they mostly concentrate on standard languages and frequently have trouble with regional phrases, mixed-language discussions, and online slang. While multilingual translation, speech translation, and language recognition are the focus of recent work on Indian language AI, handling vernacular online language is still a difficult task.

## Methodology
An structured AI-based translation process is used through the Bhasha Bridge AI Translator. Firstly, the user uses the web application to input text or audio. The system uses Natural Language Processing (NLP) and a proprietary Indian slang dataset to detect the input language and recognize slang terms, acronyms, and mixed-language expressions. The Groq Large Language Model (LLM), which comprehends the context and produces an accurate translation while maintaining the original meaning and tone, receives the processed text after that. Additionally, the algorithm detects the tone of the communication and categorizes it as formal, informal, urgent, friendly, or caustic. The user is then presented with the translated text and tone information, and the translation history is safely saved in MongoDB Atlas for later use.


## Implementation

****Frontend****
React.js
Vite
Tailwind CSS
Axios
****Backend****
FastAPI
Python
JWT Authentication
****Database****
MongoDB Atlas
****AI****
Groq API
NLP
Custom In**dian Slang Dataset
****APIs****
Groq API
Language Detection API
****Deployment****
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

## Results and Discussion
Mixed-language exchanges are successfully translated by the algorithm while maintaining emotion and context. By recognizing colloquial terms and producing natural translations, it outperforms literal translation systems for inputs that contain a lot of slang. By showing whether a message is formal, urgent, or friendly, tone detection enhances communication even further. These features are useful for multilingual communication, e-commerce, and customer service. Contextual and multilingual translation are becoming more and more important in Indian language artificial intelligence.


## Limitation
```
Talk about Limitation
```

## Future Scope
```
Mention possible improvements or next steps.
```
## Conculusion  
```
Summarize your findings and contributions.
```
## References
```
[1] Author, "Paper Title," Journal/Conference, Year.
[2] Author, "Another Paper," Year.
[3] text links
```
