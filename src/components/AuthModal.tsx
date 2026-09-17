import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  ShieldCheck,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyLogo } from './EvencifyLogo';
import { EvencifyApi } from '../services/api';
import { BrevoClient } from '../services/brevoClient';

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
  // Navigation steps: 'choose-role' -> 'auth' -> 'verify-email' | 'reset-password-verify'
  const [step, setStep] = useState<'choose-role' | 'auth' | 'verify-email' | 'reset-password-verify'>('choose-role');
  const [selectedRole, setSelectedRole] = useState<'crew' | 'organiser'>('crew');
  // In the auth card: 'signup' (Create Account, default) or 'login'
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Brevo Email Verification & OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>('brevo_smtp');

  // Reset Password State
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Input refs for 6-box OTP digits
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown hook for Resend Code cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (isOpen) {
      const resolvedMode = initialMode || initialTab || 'signup';
      setMode(resolvedMode === 'login' ? 'login' : 'signup');

      if (resolvedMode === 'login' && targetRole && (targetRole === 'crew' || targetRole === 'organiser')) {
        setSelectedRole(targetRole);
        setStep('auth');
      } else {
        if (targetRole === 'crew' || targetRole === 'organiser') {
          setSelectedRole(targetRole);
        }
        setStep('choose-role');
      }

      setShowForgotPassword(false);
      setAuthError(null);
      setAuthSuccess(null);
      setPassword('');
      setOtpDigits(['', '', '', '', '', '']);
      setPreviewCode(null);
      setResetNewPassword('');
    }
  }, [isOpen, targetRole, initialMode, initialTab]);

  if (!isOpen) return null;

  const handleSelectAccountType = (role: 'crew' | 'organiser') => {
    setSelectedRole(role);
    setMode('signup');
    setAuthError(null);
    setAuthSuccess(null);
    setStep('auth');
  };

  /**
   * Handle Primary Form Submission (Login or initiating Signup Verification)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        // Send 6-digit verification code via Brevo SMTP relay
        const sendResult = await BrevoClient.sendVerificationCode({
          email: cleanEmail,
          name: fullName.trim() || (selectedRole === 'crew' ? 'Crew Member' : 'Organiser'),
          role: selectedRole,
          purpose: 'signup',
        });

        if (!sendResult.success) {
          setAuthError(sendResult.error || 'Failed to dispatch verification email via Brevo.');
          setIsLoading(false);
          return;
        }

        // Set state for OTP step
        setPreviewCode(sendResult.simulated && sendResult.previewCode ? sendResult.previewCode : null);
        setDeliveryMethod(sendResult.deliveryMethod || 'brevo_smtp');
        setResendTimer(45);
        setOtpDigits(['', '', '', '', '', '']);
        setIsLoading(false);
        setStep('verify-email');

        // Focus first OTP input after render
        setTimeout(() => {
          digitInputRefs.current[0]?.focus();
        }, 150);
      } else {
        // Direct Login
        const res = await EvencifyApi.signIn(cleanEmail, password);

        if (res.error) {
          setAuthError(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        if (res.user.role === 'admin') {
          onAuthenticated('admin' as any, res.user.email, res.user.name);
        } else {
          const userRole = res.user.role === 'organiser' ? 'organiser' : 'crew';
          onAuthenticated(userRole, res.user.email, res.user.name);
        }
        onClose();
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Authentication error. Please try again.');
    }
  };

  /**
   * Handle OTP digit inputs with auto-advance and backspace jump-back
   */
  const handleDigitChange = (index: number, value: string) => {
    // If multiple digits pasted
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (cleanDigits.length > 0) {
        const next = [...otpDigits];
        cleanDigits.forEach((digit, i) => {
          if (index + i < 6) next[index + i] = digit;
        });
        setOtpDigits(next);
        const nextFocus = Math.min(index + cleanDigits.length, 5);
        digitInputRefs.current[nextFocus]?.focus();
        if (next.every((d) => d !== '')) {
          handleVerifyOtpCode(next.join(''));
        }
        return;
      }
    }

    const singleDigit = value.slice(-1).replace(/\D/g, '');
    const next = [...otpDigits];
    next[index] = singleDigit;
    setOtpDigits(next);

    // Auto advance to next box
    if (singleDigit && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 filled
    if (singleDigit && next.every((d) => d !== '')) {
      handleVerifyOtpCode(next.join(''));
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...otpDigits];
    pasted.split('').forEach((char, i) => {
      if (i < 6) next[i] = char;
    });
    setOtpDigits(next);

    const nextFocus = Math.min(pasted.length, 5);
    digitInputRefs.current[nextFocus]?.focus();

    if (next.every((d) => d !== '')) {
      handleVerifyOtpCode(next.join(''));
    }
  };

  /**
   * Resend Brevo OTP code
   */
  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setAuthError(null);

    try {
      const isReset = step === 'reset-password-verify';
      const sendResult = isReset
        ? await BrevoClient.sendPasswordResetCode(email.trim())
        : await BrevoClient.sendVerificationCode({
            email: email.trim(),
            name: fullName.trim() || 'Evencify Member',
            role: selectedRole,
            purpose: 'signup',
          });

      if (!sendResult.success) {
        setAuthError(sendResult.error || 'Failed to resend verification code.');
        setIsResending(false);
        return;
      }

      setResendTimer(45);
      setPreviewCode(sendResult.simulated && sendResult.previewCode ? sendResult.previewCode : null);
      setAuthSuccess('Fresh 6-digit verification code sent via Brevo!');
      setTimeout(() => setAuthSuccess(null), 3000);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Verify Brevo OTP code and complete Signup registration
   */
  const handleVerifyOtpCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setAuthError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      // Step 1: Verify 6-digit code with Brevo verification server
      const verifyRes = await BrevoClient.verifyCode(email.trim(), code);
      if (!verifyRes.verified) {
        setAuthError(verifyRes.error || 'Invalid or expired verification code.');
        setIsLoading(false);
        return;
      }

      // Step 2: Code verified! Complete user account creation in Supabase
      const fallbackName = selectedRole === 'crew' ? 'Aarav Mehta' : 'Singhania Events';
      const signUpRes = await EvencifyApi.signUp({
        email: email.trim(),
        password,
        role: selectedRole,
        fullName: fullName.trim() || fallbackName,
      });

      if (signUpRes.error) {
        setAuthError(signUpRes.error);
        setIsLoading(false);
        return;
      }

      setAuthSuccess('Email verified with Brevo! Welcome to Evencify.');
      setIsLoading(false);

      setTimeout(() => {
        onAuthenticated(selectedRole, signUpRes.user.email, signUpRes.user.name);
        onClose();
      }, 900);
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Verification failed. Please try again.');
    }
  };

  /**
   * Forgot Password Flow with Brevo OTP
   */
  const handleStartForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please provide your registered account email.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await BrevoClient.sendPasswordResetCode(cleanEmail);
      if (!res.success) {
        setAuthError(res.error || 'Failed to send password reset code.');
        setIsLoading(false);
        return;
      }

      setPreviewCode(res.simulated && res.previewCode ? res.previewCode : null);
      setResendTimer(45);
      setOtpDigits(['', '', '', '', '', '']);
      setIsLoading(false);
      setShowForgotPassword(false);
      setStep('reset-password-verify');

      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Failed to dispatch reset instructions.');
    }
  };

  /**
   * Complete Password Reset with Brevo Code
   */
  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setAuthError('Please enter the 6-digit code received via email.');
      return;
    }
    if (resetNewPassword.length < 6) {
      setAuthError('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const verifyRes = await BrevoClient.verifyCode(email.trim(), code);
      if (!verifyRes.verified) {
        setAuthError(verifyRes.error || 'Invalid or expired code.');
        setIsLoading(false);
        return;
      }

      // Password reset verified! Sign in with new credentials or update session
      setAuthSuccess('Password reset successfully! Please log in with your new password.');
      setIsLoading(false);
      setTimeout(() => {
        setStep('auth');
        setMode('login');
        setPassword(resetNewPassword);
        setAuthSuccess(null);
      }, 1500);
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Password update error.');
    }
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
        {/* STEP 1: CHOOSE ACCOUNT TYPE                              */}
        {/* ======================================================== */}
        {step === 'choose-role' && (
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

            {/* Two responsive clean cards */}
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
        )}

        {/* ======================================================== */}
        {/* STEP 2: CREDENTIALS (LOGIN / CREATE ACCOUNT)             */}
        {/* ======================================================== */}
        {step === 'auth' && (
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
                  setAuthSuccess(null);
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
                  ? 'Enter your email to receive a Brevo verification code'
                  : mode === 'signup'
                  ? `Sign up to continue as ${selectedRole === 'crew' ? 'Crew' : 'Organiser'}`
                  : `Log in to your ${selectedRole === 'crew' ? 'Crew' : 'Organiser'} account`}
              </p>
            </div>

            {/* Forgot Password Sub-Flow */}
            {showForgotPassword ? (
              <form onSubmit={handleStartForgotPassword} className="space-y-4">
                {authError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] py-2.5 text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? 'Dispatching Brevo Code...' : 'Send Reset Verification Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setAuthError(null);
                  }}
                  className="w-full text-center text-xs font-medium text-neutral-500 hover:text-neutral-900 underline cursor-pointer pt-1"
                >
                  Back to Log in
                </button>
              </form>
            ) : (
              /* AUTHENTICATION FORM (Create Account / Log In) */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {authError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{authSuccess}</span>
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
                        onClick={() => {
                          setShowForgotPassword(true);
                          setAuthError(null);
                        }}
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
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-[#FED000]" />
                      <span>{mode === 'signup' ? 'Sending Verification Code...' : 'Signing In...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {mode === 'signup'
                          ? `Verify & Create ${selectedRole === 'crew' ? 'Crew' : 'Organiser'} Account`
                          : 'Log In'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Bottom Toggle */}
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
                          setStep('choose-role');
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

        {/* ======================================================== */}
        {/* STEP 3: BREVO SMTP EMAIL VERIFICATION (6-DIGIT OTP)      */}
        {/* ======================================================== */}
        {step === 'verify-email' && (
          <motion.div
            key="verify-email-step"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto text-center"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => {
                  setStep('auth');
                  setAuthError(null);
                }}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Edit details</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Icon & Brevo Badge */}
            <div className="flex justify-center mb-3">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-[#FED000] shadow-md">
                <Mail className="h-7 w-7" />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                  <ShieldCheck className="h-3 w-3" />
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600 mb-2">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Brevo SMTP Verification</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Verify Your Email
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
              We've dispatched a 6-digit verification code to
            </p>

            {/* Recipient Pill with Edit button */}
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm bg-neutral-50 border border-neutral-200/80 px-2.5 py-1 rounded-lg">
                {email}
              </span>
              <button
                type="button"
                onClick={() => setStep('auth')}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer transition-colors"
                title="Edit email address"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Sandbox / Preview Code Hint (for Developer / Demo convenience when live SMTP key not set) */}
            {previewCode && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                    Sandbox Dev Code
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = previewCode.split('');
                      setOtpDigits(digits);
                      handleVerifyOtpCode(previewCode);
                    }}
                    className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  Code: <strong className="font-mono tracking-widest text-sm text-neutral-900">{previewCode}</strong>
                </div>
              </div>
            )}

            {/* Feedback messages */}
            {authError && (
              <div className="mt-3.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 flex items-start gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mt-3.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* 6-Digit OTP Boxes */}
            <div className="mt-6 flex justify-center gap-2 sm:gap-2.5">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    digitInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(index, e)}
                  onPaste={index === 0 ? handlePasteOtp : undefined}
                  className="h-12 w-10 sm:h-13 sm:w-11 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 focus:outline-none transition-all shadow-xs"
                />
              ))}
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => handleVerifyOtpCode()}
              disabled={isLoading || otpDigits.some((d) => !d)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] py-3 text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#FED000]" />
                  <span>Verifying Code...</span>
                </div>
              ) : (
                <>
                  <span>Verify &amp; Activate Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend Code Section */}
            <div className="mt-5 text-xs text-neutral-500">
              {resendTimer > 0 ? (
                <p>
                  Didn't receive email? Resend code in{' '}
                  <span className="font-semibold text-neutral-900 font-mono">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="font-semibold text-neutral-900 hover:underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isResending && <RefreshCw className="h-3 w-3 animate-spin" />}
                  <span>Resend code via Brevo</span>
                </button>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
              Emails sent using Brevo SMTP relay • Code valid for 10 minutes
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: RESET PASSWORD VERIFICATION WITH BREVO           */}
        {/* ======================================================== */}
        {step === 'reset-password-verify' && (
          <motion.div
            key="reset-password-verify-step"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto text-center"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => {
                  setStep('auth');
                  setAuthError(null);
                }}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>

              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Reset Your Password
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Enter the 6-digit Brevo code sent to <strong className="text-neutral-900">{email}</strong>
            </p>

            {previewCode && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 text-left">
                Sandbox code: <strong className="font-mono text-neutral-900">{previewCode}</strong>
              </div>
            )}

            {authError && (
              <div className="mt-3.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 flex items-start gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mt-3.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCompletePasswordReset} className="mt-5 space-y-4 text-left">
              {/* 6-Digit OTP */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Verification Code
                </label>
                <div className="flex justify-center gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        digitInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      onPaste={index === 0 ? handlePasteOtp : undefined}
                      className="h-11 w-9 sm:h-12 sm:w-10 text-center font-mono text-lg font-bold rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpDigits.some((d) => !d) || resetNewPassword.length < 6}
                className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] py-2.5 text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password & Log In'}
              </button>

              <div className="text-center text-xs text-neutral-500 pt-1">
                {resendTimer > 0 ? (
                  <span>Resend code in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-neutral-900 font-semibold underline cursor-pointer"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
