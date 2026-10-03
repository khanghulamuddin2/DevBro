import React, { useState, useEffect } from 'react';
import { UserAccount } from '../../types';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  AlertCircle,
  Key,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
  registeredUsers?: UserAccount[];
  onRegisterUser?: (newAccount: UserAccount) => void;
  onAuthSuccess: (username: string, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  registeredUsers = [],
  onRegisterUser,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Feedback states
  const [errorField, setErrorField] = useState<'email' | 'password' | 'confirm' | 'name' | 'all' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAccountsList, setShowAccountsList] = useState(false);
  const [forgotPasswordInfo, setForgotPasswordInfo] = useState<string | null>(null);

  // Sync mode when initialMode changes upon opening
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setErrorField(null);
    setSuccessMsg('');
    setForgotPasswordInfo(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Find if typed email matches any registered account
  const cleanEmail = email.trim().toLowerCase();
  const matchedUser = registeredUsers.find(
    (u) => u.email.toLowerCase().trim() === cleanEmail
  );

  const handleSelectAccount = (account: UserAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrorMsg('');
    setErrorField(null);
    setForgotPasswordInfo(null);
  };

  const handleForgotPassword = () => {
    setErrorMsg('');
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address first to look up your password.');
      setErrorField('email');
      return;
    }

    if (matchedUser) {
      setForgotPasswordInfo(
        `Registered Password for ${matchedUser.email} is: "${matchedUser.password}"`
      );
    } else {
      setErrorMsg(
        `No account found with "${cleanEmail}". Please check your email or click "Create account".`
      );
      setErrorField('email');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorField(null);
    setSuccessMsg('');
    setForgotPasswordInfo(null);

    const targetEmail = email.trim().toLowerCase();
    const targetPassword = password.trim();

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!targetEmail || !emailRegex.test(targetEmail)) {
      setErrorMsg('Please enter a valid email address (e.g., user@example.com)');
      setErrorField('email');
      return;
    }

    // 2. Password length validation
    if (targetPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      setErrorField('password');
      return;
    }

    if (mode === 'signin') {
      // 3. REAL CREDENTIAL VERIFICATION (CHECK EMAIL & PASSWORD)
      const existingAccount = registeredUsers.find(
        (u) => u.email.toLowerCase().trim() === targetEmail
      );

      // Check if email exists
      if (!existingAccount) {
        setErrorMsg(
          `No registered account found with email "${targetEmail}". Please enter a registered email address or click "Create account" to sign up.`
        );
        setErrorField('email');
        return;
      }

      // Check if password matches exactly
      if (existingAccount.password !== targetPassword) {
        setErrorMsg(
          `Incorrect password! The password you entered does not match the account for "${targetEmail}". Please check and enter the correct password.`
        );
        setErrorField('password');
        return;
      }

      // Credentials are 100% correct!
      setLoading(true);
      setSuccessMsg('Credentials verified! Logging in...');

      setTimeout(() => {
        setLoading(false);
        onAuthSuccess(existingAccount.username, existingAccount.email);
        onClose();
      }, 500);
    } else {
      // 4. SIGN UP VALIDATION & ACCOUNT CREATION
      if (!name.trim()) {
        setErrorMsg('Please enter your full name or username');
        setErrorField('name');
        return;
      }

      if (targetPassword !== confirmPassword.trim()) {
        setErrorMsg('Passwords do not match. Please verify both password fields.');
        setErrorField('confirm');
        return;
      }

      if (!agreeTerms) {
        setErrorMsg('Please accept the Terms of Service to create your account.');
        return;
      }

      // Check if email already registered
      const emailAlreadyRegistered = registeredUsers.some(
        (u) => u.email.toLowerCase().trim() === targetEmail
      );

      if (emailAlreadyRegistered) {
        setErrorMsg(
          `An account with "${targetEmail}" is already registered. Please switch to "Sign in" tab to log in with your password.`
        );
        setErrorField('email');
        return;
      }

      setLoading(true);
      setSuccessMsg('Account created successfully! Signing you in...');

      setTimeout(() => {
        setLoading(false);
        const newAccount: UserAccount = {
          username: name.trim(),
          email: targetEmail,
          password: targetPassword,
        };

        if (onRegisterUser) {
          onRegisterUser(newAccount);
        }

        onAuthSuccess(newAccount.username, newAccount.email);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white font-mono font-bold text-base shadow-sm mb-3">
            &lt;/&gt;
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">
            {mode === 'signin' ? 'Sign in to DevBro' : 'Create your account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            {mode === 'signin'
              ? 'Enter your registered email and correct password to access your dashboard.'
              : 'Join DevBro to download source code and manage your developer projects.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setErrorField(null);
              setForgotPasswordInfo(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setErrorField(null);
              setForgotPasswordInfo(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2.5 leading-relaxed animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forgot Password Inline Info */}
        {forgotPasswordInfo && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5 animate-in fade-in duration-150">
            <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Password Recovery: </span>
              <span>{forgotPasswordInfo}</span>
            </div>
            <button
              onClick={() => setForgotPasswordInfo(null)}
              className="text-amber-500 hover:text-amber-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Registered Credentials Helper Card */}
        {mode === 'signin' && registeredUsers.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Verified Demo Account:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountsList(!showAccountsList)}
                className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3 h-3" />
                <span>{showAccountsList ? 'Hide accounts' : 'View all accounts'}</span>
              </button>
            </div>

            {/* Quick-fill primary default account */}
            <div className="mt-2 flex items-center justify-between bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs">
              <div className="min-w-0 pr-2">
                <div className="font-mono text-[11px] font-semibold text-slate-800 truncate">
                  {registeredUsers[0].email}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Password: <span className="font-bold text-slate-700">{registeredUsers[0].password}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectAccount(registeredUsers[0])}
                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0"
              >
                Auto-fill
              </button>
            </div>

            {/* Expanded accounts list if clicked */}
            {showAccountsList && registeredUsers.length > 1 && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  All Registered Accounts ({registeredUsers.length}):
                </div>
                {registeredUsers.map((acc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 text-[11px]"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-800 truncate">{acc.email}</div>
                      <div className="text-slate-400 font-mono text-[10px]">Pass: {acc.password}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAccount(acc)}
                      className="px-2 py-0.5 text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 cursor-pointer shrink-0"
                    >
                      Fill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username / Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorField === 'name') setErrorField(null);
                  }}
                  placeholder="Khanghulamuddin"
                  className={`w-full text-xs rounded-xl border py-2.5 pl-10 pr-4 focus:outline-none transition text-slate-800 ${
                    errorField === 'name'
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                  }`}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              {mode === 'signin' && matchedUser && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Account exists
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorField === 'email') setErrorField(null);
                }}
                placeholder="khanghulamuddin2@gmail.com"
                className={`w-full text-xs rounded-xl border py-2.5 pl-10 pr-4 focus:outline-none transition text-slate-800 ${
                  errorField === 'email'
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                }`}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <span className="text-[10px] text-slate-400">Min. 6 characters</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorField === 'password') setErrorField(null);
                }}
                placeholder="Enter your exact password"
                className={`w-full text-xs rounded-xl border py-2.5 pl-10 pr-10 focus:outline-none transition text-slate-800 ${
                  errorField === 'password'
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password in Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorField === 'confirm') setErrorField(null);
                  }}
                  placeholder="Repeat your password"
                  className={`w-full text-xs rounded-xl border py-2.5 pl-10 pr-4 focus:outline-none transition text-slate-800 ${
                    errorField === 'confirm'
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                  }`}
                  required
                />
              </div>
            </div>
          )}

          {/* Extra Options */}
          {mode === 'signin' ? (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Forgot password?</span>
              </button>
            </div>
          ) : (
            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 mt-0.5"
              />
              <span>
                I agree to the <span className="text-sky-600 underline">Terms of Service</span> and{' '}
                <span className="text-sky-600 underline">Privacy Policy</span>.
              </span>
            </label>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800'
                : 'bg-[#0284c7] hover:bg-[#0369a1]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Checking credentials...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Verify & Sign in' : 'Create Account & Sign in'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <p className="text-[11px] text-slate-500 font-medium">
            Strict Email &amp; Password validation enforced. Incorrect passwords are rejected.
          </p>
        </div>
      </div>
    </div>
  );
};
