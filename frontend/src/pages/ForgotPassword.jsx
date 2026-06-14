import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import api from '../api';
import { FloatingElements } from '../components/FloatingElements';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: verify/reset, 3: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      setSuccessMsg(response.data.message);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Something went wrong. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/reset-password', {
        email,
        otp,
        new_password: newPassword
      });
      setSuccessMsg(response.data.message);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid OTP code. Use mock code: 123456');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0b0f19] overflow-hidden">
      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10 space-y-8"
      >
        <div className="glass-card p-8 rounded-3xl border border-white/50 dark:border-slate-800/80 shadow-2xl bg-white/40 dark:bg-[#0f1422]/60 backdrop-blur-xl">
          
          {/* Step 1: Request Reset */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
                  Forgot Password?
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter your email address to receive a verification code
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="block w-full pl-11 pr-4 py-3 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-glow"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Enter OTP & Reset */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
                  Verify & Reset
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Please enter the 6-digit OTP code sent to your email and your new password
                </p>
              </div>

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                  {successMsg}
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">OTP Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="block w-full pl-11 pr-4 py-3 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-11 pr-4 py-3 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-11 pr-4 py-3 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-glow"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Success Reset */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-500 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                  Reset Successful!
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your password has been changed successfully. You can now log in with your new password.
                </p>
              </div>

              <Link
                to="/login"
                className="block w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-center transition-all shadow-glow"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Back link */}
          {step !== 3 && (
            <p className="mt-8 text-center text-sm">
              <Link to="/login" className="font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                Back to Sign In
              </Link>
            </p>
          )}

        </div>
      </motion.div>
    </div>
  );
};
