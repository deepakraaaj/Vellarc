import React, { useState } from 'react';
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type Mode = 'sign-in' | 'sign-up';

export const AuthScreen: React.FC = () => {
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsSubmitting(true);

    try {
      if (mode === 'sign-in') {
        const { error: signInError } = await signInWithPassword(email, password);
        if (signInError) setError(signInError);
      } else {
        const { error: signUpError, needsEmailConfirmation } = await signUpWithPassword(email, password);
        if (signUpError) {
          setError(signUpError);
        } else if (needsEmailConfirmation) {
          setInfo('Check your inbox to confirm your email before signing in.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-3">
            <img
              src="/specarc-mark.svg"
              alt="SpecArc logo"
              className="w-12 h-12 shrink-0 drop-shadow-[0_16px_28px_rgba(99,102,241,0.22)]"
            />
            <div className="min-w-0 text-left">
              <h1 className="font-extrabold text-[1.8rem] leading-none tracking-[-0.04em] text-gray-900 dark:text-white transition-colors">SpecArc</h1>
              <p className="mono-ui text-[10px] mt-2 uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 whitespace-nowrap">Product Architecture</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'sign-in' ? 'Sign in to your workspace' : 'Create your workspace'}
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input w-full rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white dark:bg-slate-800/50 dark:border-white/10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input w-full rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white dark:bg-slate-800/50 dark:border-white/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div className="flex items-start gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{info}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-3.5 transition-colors disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {mode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                setError(null);
                setInfo(null);
              }}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
