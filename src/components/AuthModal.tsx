import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  User,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyLogo } from './EvencifyLogo';
import { EvencifyApi } from '../services/api';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'crew' | 'organiser' | UserRole;
  initialTab?: 'signup' | 'login';
  initialMode?: 'signup' | 'login';
  onAuthenticated: (role: 'crew' | 'organiser', email: string, name?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  initialTab,
  initialMode = 'signup',
  onAuthenticated,
}) => {
  // Navigation steps: 'choose-role' -> 'auth'
  const [step, setStep] = useState<'choose-role' | 'auth'>('choose-role');
  const [selectedRole, setSelectedRole] = useState<'crew' | 'organiser'>('crew');
  // In the single auth card: 'signup' (Create Account, default) or 'login'
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // If a specific role was already targeted (e.g., user clicked "Join as Crew"),
      // set the role and go directly to auth step, while still preserving "← Change account type".
      // Otherwise, open with the clean "Choose Account Type" step.
      if (targetRole && (targetRole === 'crew' || targetRole === 'organiser')) {
        setSelectedRole(targetRole);
        setStep('auth');
      } else {
        setStep('choose-role');
      }

      // Create Account must be the default view
      const resolvedMode = initialMode || initialTab || 'signup';
      setMode(resolvedMode === 'login' ? 'login' : 'signup');

      setShowForgotPassword(false);
      setForgotEmailSent(false);
      setAuthError(null);
      setPassword('');
    }
  }, [isOpen, targetRole, initialMode, initialTab]);

  if (!isOpen) return null;

  const handleSelectAccountType = (role: 'crew' | 'organiser') => {
    setSelectedRole(role);
    setMode('signup'); // Create Account is default view upon choosing account type
    setAuthError(null);
    setStep('auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (mode === 'signup') {
        const fallbackName =
          selectedRole === 'crew' ? 'Aarav Mehta' : 'Singhania Events';
        const res = await EvencifyApi.signUp({
          email: email.trim(),
          password,
          role: selectedRole,
          fullName: fullName.trim() || fallbackName,
        });

        if (res.error) {
          setAuthError(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        onAuthenticated(selectedRole, res.user.email, res.user.name);
        onClose();
      } else {
        const res = await EvencifyApi.signIn(email.trim(), password);

        if (res.error) {
          setAuthError(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        if (res.user.role === 'admin') {
          onAuthenticated('admin' as any, res.user.email, res.user.name);
        } else {
          const userRole =
            res.user.role === 'organiser' ? 'organiser' : 'crew';
          onAuthenticated(userRole, res.user.email, res.user.name);
        }
        onClose();
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Authentication error. Please try again.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotEmailSent(false);
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Subtle backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        {/* ======================================================== */}
        {/* STEP 1: CHOOSE ACCOUNT TYPE (Clean, Minimal, Modern)     */}
        {/* ======================================================== */}
        {step === 'choose-role' ? (
          <motion.div
            key="choose-role-step"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Clean Header */}
            <div className="text-center mb-7">
              <div className="flex justify-center mb-3">
                <EvencifyLogo size="sm" showTagline={false} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Choose Account Type
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Select how you'd like to use Evencify
              </p>
            </div>

            {/* Two responsive clean cards: side-by-side desktop, stacked mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Card 1: Crew Member */}
              <button
                type="button"
                onClick={() => handleSelectAccountType('crew')}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-neutral-200/90 bg-white p-5 text-left transition-all duration-200 hover:border-neutral-900 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-[#FED000] transition-colors">
                    <User className="h-5 w-5" />
                  </div>

                  <h4 className="mt-4 text-base font-bold text-neutral-900 tracking-tight">
                    Crew Member
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Find event gigs, work shifts, and receive secure payouts.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-900">
                  <span className="group-hover:text-black">Continue</span>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Card 2: Event Organiser */}
              <button
                type="button"
                onClick={() => handleSelectAccountType('organiser')}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-neutral-200/90 bg-white p-5 text-left transition-all duration-200 hover:border-neutral-900 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-[#FED000] transition-colors">
                    <Building className="h-5 w-5" />
                  </div>

                  <h4 className="mt-4 text-base font-bold text-neutral-900 tracking-tight">
                    Event Organiser
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Hire verified crew, manage call sheets, and coordinate events.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-900">
                  <span className="group-hover:text-black">Continue</span>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* STEP 2: ONE AUTHENTICATION CARD (Clean, Modern, Simple)  */
          /* ======================================================== */
          <motion.div
            key="auth-card-step"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
          >
            {/* Top Bar: Change account type + Close button */}
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => {
                  setStep('choose-role');
                  setAuthError(null);
                }}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Change account type</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Selected Role Pill */}
            <div className="flex items-center justify-center mb-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                {selectedRole === 'crew' ? (
                  <>
                    <User className="h-3.5 w-3.5 text-neutral-600" />
                    <span>Crew Member</span>
                  </>
                ) : (
                  <>
                    <Building className="h-3.5 w-3.5 text-neutral-600" />
                    <span>Event Organiser</span>
                  </>
                )}
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                {showForgotPassword
                  ? 'Reset Password'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Welcome Back'}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                {showForgotPassword
                  ? 'Enter your email to receive reset instructions'
                  : mode === 'signup'
                  ? `Sign up to continue as ${selectedRole === 'crew' ? 'Crew' : 'Organiser'}`
                  : `Log in to your ${selectedRole === 'crew' ? 'Crew' : 'Organiser'} account`}
              </p>
            </div>

            {/* Forgot Password Sub-Flow */}
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {forgotEmailSent ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Reset instructions sent! Check your inbox.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] py-2.5 text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    Send Reset Link
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-center text-xs font-medium text-neutral-500 hover:text-neutral-900 underline cursor-pointer pt-1"
                >
                  Back to Log in
                </button>
              </form>
            ) : (
              /* ONE AUTHENTICATION FORM (Toggles between Create Account & Log In) */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Full Name field (Only shown in Create Account view) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {selectedRole === 'crew' ? 'Full Name' : 'Company or Organiser Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedRole === 'crew' ? 'e.g. Aarav Mehta' : 'e.g. Singhania Live Events'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-neutral-700">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] py-2.5 text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs mt-3"
                >
                  {isLoading ? (
                    <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                  ) : (
                    <>
                      <span>
                        {mode === 'signup'
                          ? `Create ${selectedRole === 'crew' ? 'Crew' : 'Organiser'} Account`
                          : 'Log In'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Bottom Toggle:
                    - In Create Account view: "Already have an account? Log in"
                    - In Login view: "Don’t have an account? Create account"
                */}
                <div className="text-center pt-3 border-t border-neutral-100">
                  {mode === 'signup' ? (
                    <p className="text-xs sm:text-sm text-neutral-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setAuthError(null);
                        }}
                        className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-600">
                      Don’t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setAuthError(null);
                        }}
                        className="font-semibold text-neutral-900 hover:underline cursor-pointer"
                      >
                        Create account
                      </button>
                    </p>
                  )}
                </div>
              </form>
            )}

            <div className="mt-5 text-center text-[11px] text-neutral-400">
              By proceeding, you agree to Evencify’s Terms of Service &amp; Privacy Policy.
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
