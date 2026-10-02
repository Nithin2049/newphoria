import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, AlertCircle, Mountain, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  promptMessage,
}) => {
  const { signIn, signUp, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!email || !password) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setLocalError('Please provide your name.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      onClose();
    } catch (err: any) {
      // Error message set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setLocalError(null);
    clearAuthError();
  };

  const displayError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Decorative Header */}
        <div className="bg-stone-950 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center text-[#f04141]">
              <Mountain className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase">NEWPHORIA ACCOUNT</span>
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            {promptMessage || (mode === 'signin'
              ? 'Sign in to access your cloud-synced trips and memories.'
              : 'Join NEWPHORIA to save custom itineraries and digital memories.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => handleModeSwitch('signin')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'text-[#f04141] bg-white border-b-2 border-[#f04141]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'text-[#f04141] bg-white border-b-2 border-[#f04141]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          {displayError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span className="leading-relaxed">{displayError}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vipul Reddy"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#f04141] hover:bg-[#d93030] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to NEWPHORIA' : 'Create NEWPHORIA Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-stone-500">
            {mode === 'signin' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className="font-bold text-[#f04141] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className="font-bold text-[#f04141] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
