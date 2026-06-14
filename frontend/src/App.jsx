import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Sparkles, HelpCircle } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatbotAssistant } from './components/ChatbotAssistant';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { TranslatorPage } from './pages/TranslatorPage';
import { DictionaryPage } from './pages/DictionaryPage';
import { Dashboard } from './pages/Dashboard';

// Custom 404 Page Component
const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500 flex items-center justify-center text-brand-500 animate-bounce">
        <HelpCircle className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-5xl font-display font-extrabold text-gradient-blue">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Lost in Translation?</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
          The slang expression or URL route you are looking for has been normalized out of context.
        </p>
      </div>

      <Link
        to="/"
        className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-glow transition-all text-sm"
      >
        Return to Safety (Home)
      </Link>
    </div>
  );
};

// Layout Manager to show Navbar/Footer conditionally
const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {!isDashboard && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
      {!isDashboard && <Footer />}
      <ChatbotAssistant />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/translator" element={<TranslatorPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
