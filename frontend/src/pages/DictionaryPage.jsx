import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, BookOpen, AlertCircle, X, Check, 
  HelpCircle, Languages, Smile 
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FloatingElements } from '../components/FloatingElements';

export const DictionaryPage = () => {
  const { user } = useAuth();
  const [dictionary, setDictionary] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Suggestion modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlang, setNewSlang] = useState('');
  const [newLanguage, setNewLanguage] = useState('Hinglish');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newTone, setNewTone] = useState('Friendly');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  const languages = ['All', 'Hinglish', 'Marathi', 'Tamil', 'Bengali'];

  const popularSearches = ['Bhai', 'Jugaad', 'Lyadh', 'Kola Mass', 'Fatafati'];

  const fetchDictionary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/dictionary', {
        params: {
          search: searchQuery || undefined,
          language: activeLanguage !== 'All' ? activeLanguage : undefined
        }
      });
      setDictionary(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dictionary terms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictionary();
  }, [searchQuery, activeLanguage]);

  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    
    if (!user) {
      setModalError('You must be signed in to suggest slang terms.');
      return;
    }

    setModalLoading(true);
    try {
      const response = await api.post('/api/dictionary/suggest', {
        slang: newSlang,
        meaning: newMeaning,
        example: newExample,
        translation: newTranslation,
        tone: newTone,
        language: newLanguage
      });
      setModalSuccess(response.data.message);
      // Reset form fields
      setNewSlang('');
      setNewMeaning('');
      setNewExample('');
      setNewTranslation('');
      // Close modal after delay
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess('');
      }, 2500);
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.detail || 'Failed to submit suggestion.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0b0f19] overflow-hidden">
      <FloatingElements />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gradient-dark">
              Regional Slang Dictionary
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Browse, search, and contribute to the community-curated dictionary of Indian slang.
            </p>
          </div>
          <button
            onClick={() => {
              if (!user) {
                alert("Please log in to suggest new slang terms.");
                return;
              }
              setIsModalOpen(true);
            }}
            className="self-start sm:self-center px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center space-x-2 shadow-glow hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Suggest a Slang</span>
          </button>
        </div>

        {/* Search and Categories bar */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search slang, definition, or example..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors shadow-sm"
              />
            </div>

            {/* Popular Searched badges */}
            <div className="md:col-span-4 flex items-center space-x-2 overflow-x-auto py-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500 dark:hover:border-brand-500 text-xs rounded-full font-semibold transition-all whitespace-nowrap shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>

          </div>

          {/* Languages tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800/60 overflow-x-auto py-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-[6px] whitespace-nowrap ${
                  activeLanguage === lang
                    ? 'border-brand-500 text-brand-500 font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Dictionary cards list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : dictionary.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-16 h-16 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No Slangs Found</h3>
            <p className="text-sm max-w-xs mx-auto mt-1">
              We couldn't find matches for "{searchQuery}" in our {activeLanguage} database. Suggest it to add!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dictionary.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-glass-hover hover:scale-[1.01] transition-all"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-400 font-mono">
                    <span className="flex items-center text-indigo-500">
                      <Languages className="w-3.5 h-3.5 mr-1" />
                      {item.language}
                    </span>
                    <span className="flex items-center text-purple-500">
                      <Smile className="w-3.5 h-3.5 mr-1" />
                      {item.tone}
                    </span>
                  </div>

                  {/* Slang term */}
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                    {item.slang}
                  </h3>

                  {/* Meaning */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    {item.meaning}
                  </p>

                  {/* Example */}
                  <div className="p-3 bg-slate-100/60 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/40 text-xs text-slate-500 dark:text-slate-400 italic mb-4">
                    <strong>Ex:</strong> "{item.example}"
                  </div>
                </div>

                {/* Translation output */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Translation</div>
                  <p className="text-brand-600 dark:text-brand-400 text-sm font-semibold">
                    "{item.translation}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Suggestion Modal overlay */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-lg bg-white dark:bg-[#0f1422] rounded-3xl p-6 relative z-10 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <h3 className="font-display font-bold text-xl mb-4 bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
                  Suggest a New Slang
                </h3>

                {modalSuccess && (
                  <div className="p-3.5 mb-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50 text-green-600 dark:text-green-400 text-sm flex items-start space-x-2">
                    <Check className="w-5 h-5 shrink-0" />
                    <span>{modalSuccess}</span>
                  </div>
                )}

                {modalError && (
                  <div className="p-3.5 mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleSuggestSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Slang Word</label>
                      <input
                        type="text"
                        required
                        value={newSlang}
                        onChange={(e) => setNewSlang(e.target.value)}
                        placeholder="Lay bhari"
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Language</label>
                      <select
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                      >
                        <option value="Hinglish">Hinglish</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Bengali">Bengali</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Definition / Meaning</label>
                    <textarea
                      required
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      placeholder="Explain what the word means contextually..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Example Sentence</label>
                    <input
                      type="text"
                      required
                      value={newExample}
                      onChange={(e) => setNewExample(e.target.value)}
                      placeholder="Use it in a local sentence..."
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Formal English Translation</label>
                    <input
                      type="text"
                      required
                      value={newTranslation}
                      onChange={(e) => setNewTranslation(e.target.value)}
                      placeholder="What is the professional equivalent translation?"
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tone Tag</label>
                    <select
                      value={newTone}
                      onChange={(e) => setNewTone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                    >
                      <option value="Friendly / Casual">Friendly / Casual</option>
                      <option value="Respectful">Respectful</option>
                      <option value="Enthusiastic">Enthusiastic</option>
                      <option value="Sarcastic / Expressive">Sarcastic / Expressive</option>
                      <option value="Direct / Assertive">Direct / Assertive</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-glow transition-all"
                  >
                    {modalLoading ? "Submitting..." : "Submit Suggestion"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
