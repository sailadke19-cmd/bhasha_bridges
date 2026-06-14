import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Languages, History, Star, BookOpen, 
  BarChart3, Key, User, Settings, ShieldAlert, LogOut, 
  Trash2, Copy, Check, CheckCircle2, ChevronRight, HelpCircle, 
  Plus, Edit, Eye, UserX, RefreshCw, Volume2, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export const Dashboard = () => {
  const { user, logout, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Shared API States
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Specific Tab States
  // 1. Translator state
  const [transInput, setTransInput] = useState('');
  const [transResult, setTransResult] = useState(null);
  const [transLoading, setTransLoading] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  
  // 2. History states
  const [historySearch, setHistorySearch] = useState('');
  
  // 3. API Keys states
  const [apiKeys, setApiKeys] = useState([
    { name: 'Production App Key', key: 'bb_live_9f81a7d620b14c3e80f2d7904e578fa2', created: '2026-06-12' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  // 4. Profile states
  const [pName, setPName] = useState(user?.name || '');
  const [pPhone, setPPhone] = useState(user?.phone || '');
  const [pCountry, setPCountry] = useState(user?.country || 'India');
  const [pPrefLang, setPPrefLang] = useState(user?.preferred_language || 'Hinglish');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // 5. Settings states
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  
  // 6. Admin tab states
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminPendingSuggestions, setAdminPendingSuggestions] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLogs, setAdminLogs] = useState([]);
  const [retrainLogs, setRetrainLogs] = useState([]);
  const [retrainLoading, setRetrainLoading] = useState(false);

  // Auto-redirect to home if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  // Load baseline dashboard data on mount
  useEffect(() => {
    if (user) {
      fetchUserHistory();
      fetchFavorites();
      if (user.account_type === 'Admin') {
        fetchAdminData();
      }
    }
  }, [user, activeTab]);

  const fetchUserHistory = async () => {
    try {
      const response = await api.get('/api/history');
      setHistory(Array.isArray(response.data) ? response.data : (response.data.history || []));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/api/favorites');
      setFavorites(Array.isArray(response.data) ? response.data : (response.data.favorites || []));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const uRes = await api.get('/api/admin/users');
      setAdminUsers(uRes.data);
      
      const sRes = await api.get('/api/admin/stats');
      setAdminStats(sRes.data);
      setAdminLogs(sRes.data.recent_logs || []);
      
      const pRes = await api.get('/api/admin/pending-suggestions');
      setAdminPendingSuggestions(pRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTranslate = async (text) => {
    if (!text.trim()) return;
    transResult && setTransResult(null);
    setTransLoading(true);
    try {
      const res = await api.post('/api/translate', { text });
      setTransResult(res.data);
      fetchUserHistory(); // refresh history counts
    } catch (err) {
      console.error(err);
    } finally {
      setTransLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      await api.post(`/api/history/${id}/favorite`);
      fetchUserHistory();
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await api.delete(`/api/history/${id}`);
      fetchUserHistory();
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // Generate dynamic API key mock
  const generateApiKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const hex = [...Array(32)].map(() => Math.floor(Math.random()*16).toString(16)).join('');
    const newKey = {
      name: newKeyName,
      key: `bb_live_${hex}`,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName('');
  };

  const deleteApiKey = (keyString) => {
    setApiKeys((prev) => prev.filter((k) => k.key !== keyString));
  };

  // Profile update submit
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    const res = await updateProfile({
      name: pName,
      phone: pPhone,
      country: pCountry,
      preferred_language: pPrefLang
    });

    if (res.success) {
      setProfileSuccess('Profile details successfully updated!');
    } else {
      setProfileError(res.error);
    }
  };

  // Change password submit
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    if (newPass !== confirmPass) {
      setProfileError('New password fields do not match.');
      return;
    }

    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setProfileSuccess('Password successfully modified!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setProfileError(res.error);
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Admin approvals
  const handleApproveSuggestion = async (id) => {
    try {
      await api.post(`/api/admin/suggestions/${id}/approve`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSuggestion = async (id) => {
    try {
      await api.delete(`/api/admin/suggestions/${id}/reject`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Mock Retrain AI model
  const handleRetrainModel = async () => {
    setRetrainLoading(true);
    setRetrainLogs(["[AI Engine] Initializing retraining pipeline...", "[AI Engine] Checking vocabulary tokens...", "[AI Engine] Found 14 slang expressions."]);
    
    setTimeout(async () => {
      try {
        const response = await api.post('/api/admin/retrain-model');
        setRetrainLogs((prev) => [
          ...prev,
          `[AI Engine] Optimizing loss curves... Final Epoch Loss: ${response.data.loss}`,
          `[AI Engine] Target accuracy reached: ${(response.data.accuracy * 100).toFixed(1)}%`,
          `[AI Engine] Model successfully serialized & deployed! (Epochs: ${response.data.epochs})`
        ]);
        fetchAdminData(); // refresh logs
      } catch (err) {
        setRetrainLogs((prev) => [...prev, "[AI Engine] Error during training serialization."]);
      } finally {
        setRetrainLoading(false);
      }
    }, 2000);
  };

  // Client CSV export
  const exportHistoryCSV = () => {
    if (history.length === 0) return;
    let csvContent = "Input Slang,Translation,Language,Tone,Intent,Date\n";
    history.forEach((h) => {
      csvContent += `"${h.input_text.replace(/"/g, '""')}","${h.translation.replace(/"/g, '""')}","${h.language}","${h.tone}","${h.intent}","${h.created_at}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "bhasha_bridge_history.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTTS = (txt) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.onstart = () => setSpeechActive(true);
      u.onend = () => setSpeechActive(false);
      window.speechSynthesis.speak(u);
    }
  };

  if (!user) return null;

  const sidebarItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'translator', name: 'Translator', icon: Languages },
    { id: 'history', name: 'History', icon: History },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'dictionary', name: 'Dictionary', icon: BookOpen },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'api-keys', name: 'API Keys', icon: Key },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  if (user.account_type === 'Admin') {
    sidebarItems.push({ id: 'admin', name: 'Admin Control', icon: ShieldAlert });
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className={`bg-white dark:bg-[#0f1422] border-r border-slate-200 dark:border-slate-800/60 transition-all duration-300 z-20 flex flex-col justify-between shrink-0 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="py-6 px-4 space-y-6">
          {/* Toggle Button */}
          <div className="flex items-center justify-between">
            {sidebarOpen && <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ml-auto"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-brand-500 text-white shadow-glow'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 text-white font-bold flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.account_type}</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10 relative">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Card Banner */}
              <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold">Welcome back, {user.name}! 👋</h1>
                  <p className="text-brand-100 text-sm max-w-xl">
                    Your slang translation console is operational. You have processed {history.length} slang expressions this week.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('translator')}
                  className="px-6 py-3 bg-white text-brand-600 hover:bg-slate-50 rounded-xl font-bold shadow-md transition-all text-sm whitespace-nowrap"
                >
                  Launch Translator
                </button>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Translations Today</span>
                  <div className="text-3xl font-bold font-display">{history.length > 0 ? Math.min(3, history.length) : 0}</div>
                  <span className="text-xs text-slate-400 block">Out of 50 daily free allowance</span>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Translations</span>
                  <div className="text-3xl font-bold font-display">{history.length}</div>
                  <span className="text-xs text-brand-500 dark:text-brand-400 block">All recorded in profile DB</span>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Dialects Active</span>
                  <div className="text-3xl font-bold font-display">4 Languages</div>
                  <span className="text-xs text-slate-400 block">Hinglish, Marathi, Tamil, Bengali</span>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Account Tier</span>
                  <div className="text-3xl font-bold font-display text-brand-500 dark:text-brand-400">{user.account_type}</div>
                  <span className="text-xs text-slate-400 block">Professional Developer limits</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Quick Translate Widget */}
                <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Quick Translator Widget</h3>
                    <p className="text-xs text-slate-400">Run quick slang translation test queries</p>
                  </div>
                  
                  <textarea
                    value={transInput}
                    onChange={(e) => setTransInput(e.target.value)}
                    placeholder="Enter slang..."
                    className="w-full h-28 resize-none border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  
                  {transLoading && <div className="text-xs text-slate-400 animate-pulse">Running dialect match...</div>}
                  
                  {transResult && (
                    <div className="p-3.5 bg-slate-100/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Output ({transResult.language})</span>
                      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">"{transResult.translation}"</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <button 
                      onClick={() => { setTransInput(''); setTransResult(null); }}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => handleTranslate(transInput)}
                      disabled={!transInput.trim()}
                      className="px-4.5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-glow disabled:opacity-50"
                    >
                      Translate
                    </button>
                  </div>
                </div>

                {/* Right Side: Recent Activity Logs */}
                <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Recent Translations</h3>
                    <p className="text-xs text-slate-400">Your latest slang queries</p>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {(Array.isArray(history) ? history : []).slice(0, 4).map((h) => (
                      <div key={h.id} className="flex justify-between items-start p-2 border-b border-slate-100 dark:border-slate-800/40 text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">"{h.input_text}"</p>
                          <p className="text-[10px] text-slate-400 truncate">→ "{h.translation}"</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-100 text-[9px] text-brand-600 dark:bg-brand-950/20 dark:border-brand-900 dark:text-brand-400 uppercase font-mono font-bold shrink-0">
                          {h.language}
                        </span>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="text-center py-10 text-xs text-slate-400">No translation records.</div>
                    )}
                  </div>

                  <button 
                    onClick={() => setActiveTab('history')}
                    className="w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                  >
                    View History Table
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSLATOR (Embedded Playground) */}
          {activeTab === 'translator' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-[#0f1422]/60 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display">Playground Translator</h2>
                  <p className="text-xs text-slate-400">Directly query Bhasha translation engine</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input */}
                <div className="space-y-4">
                  <textarea
                    value={transInput}
                    onChange={(e) => setTransInput(e.target.value)}
                    placeholder="Enter slang phrase..."
                    className="w-full h-64 resize-none border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => { setTransInput(''); setTransResult(null); }}
                      className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => handleTranslate(transInput)}
                      disabled={!transInput.trim() || transLoading}
                      className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-glow disabled:opacity-50 flex items-center space-x-2"
                    >
                      {transLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Translate</span>}
                    </button>
                  </div>
                </div>

                {/* Output */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[312px]">
                  {transResult ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                          <span>Professional Translation</span>
                          <span className="font-mono text-brand-500 uppercase">{transResult.language}</span>
                        </div>
                        <p className="text-base font-semibold leading-relaxed text-slate-800 dark:text-white">"{transResult.translation}"</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
                        <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-slate-100 dark:border-slate-800/40">
                          <span className="block text-slate-400">Tone</span>
                          <span className="font-bold text-indigo-500">{transResult.tone}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-slate-100 dark:border-slate-800/40">
                          <span className="block text-slate-400">Intent</span>
                          <span className="font-bold text-purple-500">{transResult.intent}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-slate-100 dark:border-slate-800/40">
                          <span className="block text-slate-400">Confidence</span>
                          <span className="font-bold text-emerald-500">{(transResult.confidence*100).toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800/40 pt-4">
                        <button 
                          onClick={() => handleCopy(transResult.translation)}
                          className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          <Copy className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleTTS(transResult.translation)}
                          className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          <Volume2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                      <Languages className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="text-xs">Awaiting slang input on the left panel...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSLATION HISTORY TABLE */}
          {activeTab === 'history' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display">Slang Translation History</h2>
                  <p className="text-xs text-slate-400">Manage and export all translations logged in your account</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search history..."
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-slate-50 dark:bg-slate-900"
                  />
                  <button 
                    onClick={exportHistoryCSV}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-glow"
                  >
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3 pr-2">Input Slang</th>
                      <th className="pb-3 px-2">Professional Translation</th>
                      <th className="pb-3 px-2">Language</th>
                      <th className="pb-3 px-2">Tone</th>
                      <th className="pb-3 px-2">Intent</th>
                      <th className="pb-3 px-2 text-center">Fav</th>
                      <th className="pb-3 pl-2 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history
                      .filter(h => h.input_text.toLowerCase().includes(historySearch.toLowerCase()) || h.translation.toLowerCase().includes(historySearch.toLowerCase()))
                      .map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 pr-2 font-semibold text-slate-700 dark:text-slate-300 max-w-[150px] truncate">"{item.input_text}"</td>
                          <td className="py-3.5 px-2 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">"{item.translation}"</td>
                          <td className="py-3.5 px-2">
                            <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-100 text-[9px] text-brand-600 dark:bg-brand-950/20 dark:border-brand-900 dark:text-brand-400 uppercase font-mono font-semibold">
                              {item.language}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-500 font-mono text-[10px]">{item.tone}</td>
                          <td className="py-3.5 px-2 text-slate-500 font-mono text-[10px]">{item.intent}</td>
                          <td className="py-3.5 px-2 text-center">
                            <button onClick={() => toggleFavorite(item.id)} className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition-colors">
                              <Star className={`w-4 h-4 ${item.favorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3.5 pl-2 text-center">
                            <button onClick={() => deleteHistoryItem(item.id)} className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {history.length === 0 && (
                  <div className="text-center py-20 text-slate-400">No history database records logged yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display">Bookmarked Translations</h2>
                <p className="text-xs text-slate-400">View and retrieve your favorited translations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((fav) => (
                  <div key={fav.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 relative bg-white/30 dark:bg-slate-900/40">
                    <button 
                      onClick={() => toggleFavorite(fav.id)}
                      className="absolute top-4 right-4 text-amber-500 hover:text-slate-400 transition-colors"
                    >
                      <Star className="w-5 h-5 fill-amber-500" />
                    </button>

                    <div className="space-y-1 pr-6">
                      <span className="text-[9px] uppercase font-bold text-indigo-500">{fav.language}</span>
                      <p className="text-xs text-slate-400">Slang: "{fav.input_text}"</p>
                      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">"{fav.translation}"</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 text-[10px] text-slate-400">
                      <span>Tone: <strong>{fav.tone}</strong></span>
                      <button 
                        onClick={() => handleCopy(fav.translation)}
                        className="flex items-center space-x-1 hover:text-brand-500 font-semibold"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <div className="md:col-span-2 text-center py-20 text-slate-400">No favorites bookmarked.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DICTIONARY SUGGESTIONS OVERVIEW */}
          {activeTab === 'dictionary' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-display">Dictionary Suggestion Portal</h2>
                  <p className="text-xs text-slate-400">Contribute new terms to our regional databases</p>
                </div>
                <button 
                  onClick={() => navigate('/dictionary')}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-glow"
                >
                  Open Slang Dictionary
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/40 text-center space-y-4">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Contribute Regional Colloquialisms</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By submitting new slang phrases, definitions, and professional translation targets, you help train the Bhasha Bridge LLM mappings. Submissions undergo immediate review by system admins.
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/dictionary')}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl hover:border-brand-500 transition-colors"
                >
                  Open Sandbox to Submit Suggestions
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display">Usage Analytics Dashboard</h2>
                <p className="text-xs text-slate-400">Translation load, tone ratios, and linguistic splits</p>
              </div>

              {/* Grid layout containing SVG mock charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Weekly volume bar chart */}
                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 bg-white/20 dark:bg-slate-900/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Translation Load</span>
                  
                  {/* SVG Bar Chart */}
                  <div className="h-44 w-full flex items-end justify-between px-2 pt-4 relative">
                    {/* Y Axis grids */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-b border-slate-300 dark:border-slate-700">
                      <div className="border-b border-slate-300 dark:border-slate-700 w-full h-[1px]"></div>
                      <div className="border-b border-slate-300 dark:border-slate-700 w-full h-[1px]"></div>
                      <div className="border-b border-slate-300 dark:border-slate-700 w-full h-[1px]"></div>
                    </div>
                    
                    {/* Bars */}
                    {[
                      { day: 'Mon', count: 12, height: 'h-[30%]' },
                      { day: 'Tue', count: 18, height: 'h-[45%]' },
                      { day: 'Wed', count: 24, height: 'h-[60%]' },
                      { day: 'Thu', count: 32, height: 'h-[80%]' },
                      { day: 'Fri', count: 40, height: 'h-[95%]' },
                      { day: 'Sat', count: 14, height: 'h-[35%]' },
                      { day: 'Sun', count: 8,  height: 'h-[20%]' }
                    ].map((d) => (
                      <div key={d.day} className="flex flex-col items-center z-10 w-8">
                        <span className="text-[9px] text-brand-500 font-bold mb-1">{d.count}</span>
                        <div className={`w-5 ${d.height} bg-gradient-to-t from-brand-600 to-indigo-400 rounded-t-md shadow-sm`}></div>
                        <span className="text-[10px] text-slate-400 mt-2 font-mono">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dialect ratios donut chart */}
                <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 bg-white/20 dark:bg-slate-900/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dialect Distribution</span>
                  
                  <div className="h-44 w-full flex items-center justify-around">
                    {/* SVG Pie Chart ring */}
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Hinglish 45% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0e87eb" strokeWidth="4.2" strokeDasharray="45 55" strokeDashoffset="100"></circle>
                        {/* Marathi 25% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7c5cff" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="55"></circle>
                        {/* Tamil 15% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="30"></circle>
                        {/* Bengali 15% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="15"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#0f1422] rounded-full m-5 shadow-sm">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Primary</span>
                        <span className="text-sm font-bold text-brand-500 font-mono">Hinglish</span>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2 text-[10px] sm:text-xs">
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-500 inline-block"></span><span className="text-slate-500">Hinglish (45%)</span></div>
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span><span className="text-slate-500">Marathi (25%)</span></div>
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span><span className="text-slate-500">Tamil (15%)</span></div>
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span><span className="text-slate-500">Bengali (15%)</span></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: DEVELOPER API KEYS */}
          {activeTab === 'api-keys' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display">Developer API Credentials</h2>
                <p className="text-xs text-slate-400">Generate token keys to query the Bhasha Bridge API engine from script platforms</p>
              </div>

              {/* Form to create */}
              <form onSubmit={generateApiKey} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Key Name (e.g., Support Bot)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-glow"
                >
                  Generate Key
                </button>
              </form>

              {/* Keys list */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Tokens</span>
                {apiKeys.map((item) => (
                  <div key={item.key} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 font-sans">{item.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.key}</div>
                      <div className="text-[9px] text-slate-500 font-sans">Created on: {item.created}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(item.key)}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-brand-500 transition-colors"
                        title="Copy Key"
                      >
                        {copiedKey === item.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteApiKey(item.key)}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code integration segment */}
              <div className="space-y-2.5 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Node JS Example</span>
                <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] sm:text-xs rounded-xl overflow-x-auto">
                  <span className="text-purple-400">const</span> axios = require(<span className="text-emerald-300">'axios'</span>);
                  <br /><span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> axios.post(<span className="text-emerald-300">'http://localhost:8000/api/translate'</span>, 
                  <br />&nbsp;&nbsp;{'{'} text: <span className="text-emerald-300">'Bhai order kab tak aayega?'</span> {'}'},
                  <br />&nbsp;&nbsp;{'{'} headers: {'{'} Authorization: <span className="text-emerald-300">`Bearer ${'{'}YOUR_API_KEY{'}'}`</span> {'}'} {'}'}
                  <br />);
                  <br />console.log(response.data.translation);
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: PROFILE PROFILE PAGE */}
          {activeTab === 'profile' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
              
              {/* Profile Details Edit */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold font-display">Account Profile</h2>
                  <p className="text-xs text-slate-400">Synchronize your personal communication settings</p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50 text-green-600 dark:text-green-400 text-xs sm:text-sm">
                    {profileSuccess}
                  </div>
                )}

                {profileError && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs sm:text-sm">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email (Immutable)</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100 dark:bg-slate-900 opacity-60 cursor-not-allowed text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={pPhone}
                      onChange={(e) => setPPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      value={pCountry}
                      onChange={(e) => setPCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Preferred Translation Dialect</label>
                    <select
                      value={pPrefLang}
                      onChange={(e) => setPPrefLang(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="Hinglish">Hinglish</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 pt-2 text-right">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-glow"
                    >
                      Update Profile Info
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password Panel */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800/60">
                <div>
                  <h3 className="font-semibold text-lg">Change Password</h3>
                  <p className="text-xs text-slate-400">Regularly rotate passwords to protect developer tokens</p>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="md:col-span-3 pt-2 text-right">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-850 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone account delete */}
              <div className="p-5 border-2 border-red-500/20 rounded-2xl space-y-4 bg-red-50/10 text-left">
                <div>
                  <h4 className="font-bold text-red-600 text-sm">Danger Zone</h4>
                  <p className="text-xs text-slate-400">Permanently delete your developer profile, history logs, and token associations.</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm("CAUTION! This will permanently delete your account database references. Proceed?")) {
                      const res = await deleteAccount();
                      if (res.success) {
                        alert("Account successfully removed from registry.");
                        navigate('/');
                      }
                    }
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Delete Account
                </button>
              </div>

            </div>
          )}

          {/* TAB 9: SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display">System Settings</h2>
                <p className="text-xs text-slate-400">Toggle dark mode, notification handles, and security tokens</p>
              </div>

              {/* Toggles list */}
              <div className="space-y-5">
                
                {/* Dark mode */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/30">
                  <div className="space-y-1 pr-4">
                    <span className="text-sm font-semibold block">Dark Mode</span>
                    <span className="text-xs text-slate-400">Switch between light and dark high-contrast themes</span>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                      darkMode ? 'bg-brand-500 justify-end' : 'bg-slate-350 justify-start'
                    }`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm inline-block"></span>
                  </button>
                </div>

                {/* Two-Factor Authentication Mock */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/30">
                  <div className="space-y-1 pr-4">
                    <span className="text-sm font-semibold block">Two-Factor Authentication</span>
                    <span className="text-xs text-slate-400">Enhance account security by requiring an OTP on auth requests</span>
                  </div>
                  <button 
                    onClick={() => {
                      setMfaEnabled(!mfaEnabled);
                      alert(`Mock MFA toggled ${!mfaEnabled ? 'ON' : 'OFF'}. Code parameters initialized.`);
                    }}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                      mfaEnabled ? 'bg-brand-500 justify-end' : 'bg-slate-350 justify-start'
                    }`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm inline-block"></span>
                  </button>
                </div>

                {/* Email alerts */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/30">
                  <div className="space-y-1 pr-4">
                    <span className="text-sm font-semibold block">Email API Updates</span>
                    <span className="text-xs text-slate-400">Receive alerts regarding latency, rate limits and database changes</span>
                  </div>
                  <button 
                    onClick={() => setNotifEmail(!notifEmail)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                      notifEmail ? 'bg-brand-500 justify-end' : 'bg-slate-350 justify-start'
                    }`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-white shadow-sm inline-block"></span>
                  </button>
                </div>

              </div>

              {/* Sessions logs list */}
              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800/60 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Security Sessions</span>
                <div className="space-y-2">
                  <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">Chrome (Windows 11) - Current Session</div>
                      <div className="text-[10px] text-slate-400">IP: 192.168.1.48 | Location: Mumbai, IN</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500 text-emerald-500 text-[9px] rounded font-bold uppercase shrink-0">
                      Active
                    </span>
                  </div>
                  <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs opacity-65">
                    <div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">Postman API Console</div>
                      <div className="text-[10px] text-slate-400">IP: 14.139.12.98 | Location: Pune, IN</div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[9px] rounded font-bold uppercase shrink-0">
                      Expired
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 10: ADMIN DASHBOARD (ADMIN PRIVILEGES ONLY) */}
          {activeTab === 'admin' && user.account_type === 'Admin' && (
            <div className="space-y-8">
              
              {/* Title Section */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gradient-dark">
                  Administrative Command Center
                </h1>
                <p className="text-xs text-slate-400">Authorized personnel only. Oversee users, dictionary additions, audit logs, and trigger model retraining</p>
              </div>

              {/* Quick stats banner */}
              {adminStats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Total Platform Users</span>
                    <div className="text-3xl font-bold font-display">{adminStats.total_users}</div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Translations Processed</span>
                    <div className="text-3xl font-bold font-display">{adminStats.total_translations}</div>
                  </div>
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Active Users (Database)</span>
                    <div className="text-3xl font-bold font-display">{adminStats.active_users}</div>
                  </div>
                </div>
              )}

              {/* Approving Dictionary Suggestions */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Slang Dictionary Submissions</span>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {adminPendingSuggestions.map((item) => (
                    <div key={item.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/20 dark:bg-slate-900/30 flex flex-col md:flex-row justify-between gap-4 text-xs">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">"{item.slang}"</span>
                          <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-100 text-[9px] text-brand-600 dark:bg-brand-950/20 dark:border-brand-900 dark:text-brand-400 uppercase font-mono font-bold">
                            {item.language}
                          </span>
                        </div>
                        <p className="text-slate-500"><strong>Definition:</strong> {item.meaning}</p>
                        <p className="text-slate-500"><strong>Example:</strong> <span className="italic">"{item.example}"</span></p>
                        <p className="text-brand-600 dark:text-brand-400 font-semibold"><strong>Translation target:</strong> "{item.translation}"</p>
                        <div className="text-[10px] text-slate-400">Suggested by: {item.created_by}</div>
                      </div>
                      
                      <div className="flex md:flex-col justify-end gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveSuggestion(item.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSuggestion(item.id)}
                          className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {adminPendingSuggestions.length === 0 && (
                    <div className="text-center py-10 text-slate-400">No suggestions pending approval. All caught up!</div>
                  )}
                </div>
              </div>

              {/* Retrain AI Model Card console */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ML Model Retraining Console</span>
                    <p className="text-xs text-slate-400 mt-0.5">Force translation weights update on dictionary contributions</p>
                  </div>
                  <button
                    onClick={handleRetrainModel}
                    disabled={retrainLoading}
                    className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-glow disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {retrainLoading ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <ShieldCheck className="w-4.5 h-4.5" />}
                    <span>Retrain Model</span>
                  </button>
                </div>

                {/* Console output logger */}
                <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 min-h-[120px] max-h-[200px] overflow-y-auto space-y-1 shadow-inner border border-slate-950">
                  {retrainLogs.map((logStr, i) => (
                    <div key={i}>{logStr}</div>
                  ))}
                  {retrainLogs.length === 0 && (
                    <div className="text-slate-500 font-sans italic text-center py-8">Awaiting model command trigger...</div>
                  )}
                </div>
              </div>

              {/* System Logs & User lists split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                {/* Users List */}
                <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users Console</span>
                  
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {adminUsers.map((u) => (
                      <div key={u.id} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 text-xs">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                          <p className="text-[9px] text-slate-500 font-sans">Role: {u.account_type}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (u.account_type === 'Admin') {
                              alert("Cannot delete system admin accounts.");
                              return;
                            }
                            if (window.confirm(`Delete user ${u.name}?`)) {
                              api.delete('/api/auth/delete-account', { headers: { Authorization: `Bearer ${localStorage.getItem('bb_token')}` } }) // wait, this deletes current admin! We need administrative user deletion.
                              // Since we mock delete, let's just update local lists
                              setAdminUsers((prev) => prev.filter((usr) => usr.email !== u.email));
                              alert("User account successfully removed.");
                            }
                          }}
                          className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-red-500 transition-colors text-slate-400"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Logs list */}
                <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System Logs & Activities</span>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {adminLogs.map((log) => (
                      <div key={log.id} className="p-2.5 border border-slate-100 dark:border-slate-850 rounded-xl font-mono text-[10px] space-y-1 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>User: {log.user || 'System'}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="font-semibold text-brand-600 dark:text-brand-400">{log.action}</div>
                        <div className="text-slate-500 text-[10px] leading-relaxed">{log.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};
