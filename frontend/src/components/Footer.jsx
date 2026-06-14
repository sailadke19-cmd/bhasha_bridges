import { useState } from 'react';
import { Send, Check } from 'lucide-react';

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-[#0b0f19]/40 py-12 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
              Bhasha Bridge
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Bridging the gap between Indian regional internet slang and formal professional English with AI-driven contextual analysis.
            </p>
            <div className="flex space-x-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 font-display">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/translator" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">AI Translator</a></li>
              <li><a href="/dictionary" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Slang Dictionary</a></li>
              <li><a href="#features" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Platform Features</a></li>
              <li><a href="#pricing" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">SaaS Pricing</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 font-display">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#api" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">API documentation</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Developer Forum</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 font-display">Stay Updated</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Subscribe to receive slang trend reports and API updates.</p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f1422] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="submit"
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  subscribed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow'
                }`}
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Bhasha Bridge. All rights reserved.</span>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
