import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, MessageSquare, ShieldAlert, Zap, 
  Smile, ShieldCheck, Database, Cpu, Lock, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { FloatingElements } from '../components/FloatingElements';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const phrases = [
    "Hinglish (bhai order kab tak aayega?)",
    "Marathi (lay bhari kaam kela tumhi)",
    "Tamil (sema kola mass performance)",
    "Bengali (aaj khub lyadh lagche)"
  ];

  // Typing effect logic
  useEffect(() => {
    const currentPhrase = phrases[textIndex];
    let timer;
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypingText(currentPhrase.substring(0, typingText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypingText(currentPhrase.substring(0, typingText.length + 1));
      }, 100);
    }

    if (!isDeleting && typingText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typingText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [typingText, isDeleting, textIndex]);

  const features = [
    { title: 'AI Slang Translation', desc: 'Converts complex regional slang combinations into standard professional terms.', icon: Sparkles, color: 'text-blue-500' },
    { title: 'Context Awareness', desc: 'Analyzes surrounding text to find the exact intended meaning of colloquialisms.', icon: Cpu, color: 'text-indigo-500' },
    { title: 'Tone Detection', desc: 'Identifies emotional tone: polite, sarcastic, angry, formal, or casual.', icon: Smile, color: 'text-purple-500' },
    { title: 'Intent Detection', desc: 'Extracts the underlying action: inquiry, status update, feedback, or grievance.', icon: CheckCircle2, color: 'text-emerald-500' },
    { title: 'Language Detection', desc: 'Automatically identifies the source Indian dialect or hybrid language mix.', icon: Database, color: 'text-pink-500' },
    { title: 'Emoji Understanding', desc: 'Interprets contextual emojis and maps them to appropriate semantic equivalents.', icon: MessageSquare, color: 'text-amber-500' },
    { title: 'Translation History', desc: 'Saves translations securely for quick reference and dashboard logs.', icon: Lock, color: 'text-cyan-500' },
    { title: 'Favorites & Collections', desc: 'Bookmarked slang mappings can be categorised and exported easily.', icon: ShieldCheck, color: 'text-rose-500' },
    { title: 'Developer REST API', desc: 'High-performance API endpoints for instant backend platform integrations.', icon: Zap, color: 'text-violet-500' }
  ];

  const steps = [
    { num: '01', title: 'Enter Slang', desc: 'Type Hinglish, Marathi, Tamil, or Bengali slang phrases.' },
    { num: '02', title: 'Auto-Detect', desc: 'AI identifies the input dialect and separates hybrid parts.' },
    { num: '03', title: 'Contextual LLM Scan', desc: 'Translation mapping occurs using contextual slang databases.' },
    { num: '04', title: 'Metadata Parsing', desc: 'Tone, Intent, and confidence scores are calculated.' },
    { num: '05', title: 'Professional Output', desc: 'Polished formal English and recommended replies are rendered.' }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0b0f19] overflow-hidden transition-colors duration-300">
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-32 sm:pb-24 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-600 dark:bg-brand-950/20 dark:border-brand-800 dark:text-brand-400 text-xs sm:text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Next-Gen Indian Language Translation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-gradient-dark"
            >
              Translate Indian <br />
              <span className="text-gradient-blue">Internet Language</span> <br className="hidden sm:inline" />
              with AI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-10 text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start"
            >
              <span>Translating: </span>
              <span className="ml-2 font-mono text-brand-500 dark:text-brand-400">
                {typingText}
                <span className="cursor-blink">|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Understand Hinglish, Marathi, Banglish, Tamlish, and Indian internet slang using AI-powered translation, tone detection, and intent analysis. Ideal for support teams, recruiters, and tech companies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/translator"
                className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-glow hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Try Translator</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Hero Illustration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="glass-card rounded-2xl p-6 relative z-10 shadow-2xl border border-white/40 dark:border-slate-800/60 w-full animate-float">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-400"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-400"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-green-400"></span>
                </div>
                <span className="text-xs font-semibold text-slate-400 font-mono">Bhasha Engine v1.0</span>
              </div>

              {/* Slang Input Mockup */}
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Slang Input (Hinglish)</div>
                  <div className="p-3 bg-slate-100/60 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium">
                    "Bhai order kab tak aayega?"
                  </div>
                </div>

                <div className="flex justify-center my-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500 flex items-center justify-center text-brand-500">
                    <ArrowRight className="w-4 h-4 rotate-90 lg:rotate-0" />
                  </div>
                </div>

                {/* Translation Output Mockup */}
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Professional Translation</div>
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-brand-600 dark:text-brand-400">
                    "Could you please tell me when my order will arrive, brother?"
                  </div>
                </div>

                {/* Metadata tags Mockup */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/40 text-slate-600 dark:text-indigo-400">
                    <span className="block text-[10px] text-slate-400">Tone</span>
                    <span className="font-semibold">Polite / Friendly</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/40 dark:border-purple-900/40 text-slate-600 dark:text-purple-400">
                    <span className="block text-[10px] text-slate-400">Intent</span>
                    <span className="font-semibold">Status Inquiry</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/40 dark:border-emerald-900/40 text-slate-600 dark:text-emerald-400">
                    <span className="block text-[10px] text-slate-400">Confidence</span>
                    <span className="font-semibold">98.7%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/40 dark:border-blue-900/40 text-slate-600 dark:text-blue-400">
                    <span className="block text-[10px] text-slate-400">Source Dialect</span>
                    <span className="font-semibold">Hinglish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing background halo */}
            <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-brand-500/20 blur-[60px] -z-10 animate-pulse-subtle"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/40 dark:bg-[#0b0f19]/30 border-y border-slate-100 dark:border-slate-800/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient-dark">
              Engineered for Contextual Slang Parsing
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Unlike traditional translators that fail at cultural vocabulary, Bhasha Bridge evaluates internet dialects using multi-layered NLP structures.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card hover:bg-white dark:hover:bg-[#0f1422] p-6 rounded-2xl shadow-sm hover:shadow-glass-hover hover:scale-[1.02] border border-slate-100 dark:border-slate-800/60 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient-dark">
            Inside the Translation Pipeline
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            How Bhasha Bridge transforms local Indian street slang into board-room ready professional communications.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative">
          {/* Line separator connector for desktop */}
          <div className="hidden sm:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-slate-200 dark:bg-slate-800 -z-10"></div>
          
          {steps.map((st, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4 bg-slate-50 dark:bg-[#0f1422]/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60"
            >
              <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500 text-brand-500 font-bold flex items-center justify-center mx-auto shadow-sm">
                {st.num}
              </div>
              <h3 className="font-semibold text-sm sm:text-base">{st.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* API Code Section */}
      <section id="api" className="py-20 bg-white/40 dark:bg-[#0b0f19]/30 border-y border-slate-100 dark:border-slate-800/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* API text info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-800 dark:text-indigo-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>REST API Access</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient-dark">
                Integrate Slang Parsing in 2 Lines of Code
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                Developers can query language nodes with standard HTTP queries. Pass tokenized strings and retrieve JSON schemas mapping tone metrics, dialect details, and suggested formal replies.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">FastAPI architecture with sub-millisecond latencies</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">JWT and Custom API Token Auth models</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Clean Swagger UI dashboard endpoints</span>
                </div>
              </div>
            </div>

            {/* Code Block Mockup */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-2xl font-mono text-xs sm:text-sm">
                
                {/* Header tab */}
                <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between text-slate-400">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                  </div>
                  <span>request.sh</span>
                </div>

                {/* Code Body */}
                <div className="p-5 bg-slate-900 dark:bg-slate-950 text-emerald-400 overflow-x-auto space-y-4">
                  <div>
                    <span className="text-indigo-400">curl</span> -X <span className="text-amber-400">POST</span> "http://localhost:8000/api/translate" \
                    <br />&nbsp;&nbsp;-H <span className="text-pink-400">"Content-Type: application/json"</span> \
                    <br />&nbsp;&nbsp;-H <span className="text-pink-400">"Authorization: Bearer bb_token_xyz"</span> \
                    <br />&nbsp;&nbsp;-d <span className="text-pink-400">'{'{'}"text": "Bhai order kab tak aayega?"{'}'}'</span>
                  </div>

                  <div className="border-t border-slate-800 pt-4 text-slate-400">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold mb-2"># Response Payload (JSON)</div>
                    <span className="text-amber-300">{'{'}</span>
                    <br />&nbsp;&nbsp;<span className="text-purple-400">"language"</span>: <span className="text-emerald-400">"Hinglish"</span>,
                    <br />&nbsp;&nbsp;<span className="text-purple-400">"translation"</span>: <span className="text-emerald-400">"Could you please inform me when my order will arrive?"</span>,
                    <br />&nbsp;&nbsp;<span className="text-purple-400">"tone"</span>: <span className="text-emerald-400">"Polite / Inquisitive"</span>,
                    <br />&nbsp;&nbsp;<span className="text-purple-400">"intent"</span>: <span className="text-emerald-400">"Status Query"</span>,
                    <br />&nbsp;&nbsp;<span className="text-purple-400">"confidence"</span>: <span className="text-amber-400">0.98</span>,
                    <br />&nbsp;&nbsp;<span className="text-purple-400">"replies"</span>: <span className="text-amber-300">[</span>
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">"We are checking the delivery status with logistics."</span>
                    <br />&nbsp;&nbsp;<span className="text-amber-300">]</span>
                    <br /><span className="text-amber-300">{'}'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient-dark">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Start translating slang for free, and scale up with developer API keys as your traffic requirements grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display">Starter Free</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Perfect for casual translation and dictionary lookups.</p>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                $0 <span className="text-sm font-normal text-slate-400">/ forever</span>
              </div>
              <ul className="space-y-3 pt-6 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>50 translations / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Access dictionary search</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Basic tone & intent tagging</span>
                </li>
              </ul>
            </div>
            <Link to="/translator" className="mt-8 block text-center py-3 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-400 text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl font-semibold transition-all">
              Try Free
            </Link>
          </div>

          {/* Card 2 (Pro) */}
          <div className="glass-card p-8 rounded-2xl border-2 border-brand-500 bg-white dark:bg-[#0f1422] flex flex-col justify-between relative shadow-xl">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Popular Choice
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display">Developer Pro</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Ideal for developers, researchers, and expanding companies.</p>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                $9 <span className="text-sm font-normal text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3 pt-6 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Unlimited playground translates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Full API Access (5,000 req/month)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Historical analytics & favorite exports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Suggest slang terms with instant review</span>
                </li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 block text-center py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-glow transition-all">
              Buy Pro Plan
            </Link>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display">Enterprise</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Custom features for customer support teams at scale.</p>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                Custom <span className="text-sm font-normal text-slate-400">quote</span>
              </div>
              <ul className="space-y-3 pt-6 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Custom Slack & WhatsApp Webhooks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Fine-tuned language models</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>Dedicated server deployments (SLA)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-500 shrink-0" />
                  <span>24/7 technical call support</span>
                </li>
              </ul>
            </div>
            <a href="mailto:sales@bhashabridge.com" className="mt-8 block text-center py-3 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-400 text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-xl font-semibold transition-all">
              Contact Sales
            </a>
          </div>

        </div>
      </section>
      
      {/* Bottom CTA */}
      <section className="py-20 relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-3xl p-10 sm:p-14 text-white shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle overlay shapes */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
            Stop guessing. Start understanding regional internet slangs today.
          </h2>
          <p className="text-brand-100 max-w-xl mx-auto text-sm sm:text-base">
            Equip your support representatives and system pipelines with real-time colloquial normalization.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/translator" className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-600 hover:bg-slate-50 font-bold rounded-xl shadow-md transition-all">
              Open Translator Playground
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white border border-brand-500/30 font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5">
              <span>Sign Up Free</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
