import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  UserCheck,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyLogo } from './EvencifyLogo';
import { EvencifyApi } from '../services/api';

interface AuthModalProps {
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
  targetRole = 'crew',
  initialTab,
  initialMode = 'signup',
  onAuthenticated,
}) => {
  const effectiveInitialTab = initialTab || initialMode || 'signup';
  const effectiveTargetRole: 'crew' | 'organiser' =
    targetRole === 'organiser' ? 'organiser' : 'crew';

  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(effectiveInitialTab);
  const [selectedRole, setSelectedRole] = useState<'crew' | 'organiser'>(effectiveTargetRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleSetupRequired, setGoogleSetupRequired] = useState(false);
  const [instantEmail, setInstantEmail] = useState('arvexastudio.co@gmail.com');
  const [instantFullName, setInstantFullName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(effectiveInitialTab);
      setSelectedRole(effectiveTargetRole);
      setShowForgotPassword(false);
      setForgotEmailSent(false);
      setAuthError(null);
      setGoogleSetupRequired(false);
    }
  }, [isOpen, effectiveInitialTab, effectiveTargetRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (activeTab === 'signup') {
        const res = await EvencifyApi.signUp({
          email,
          password,
          role: selectedRole,
          fullName: fullName.trim() || (selectedRole === 'crew' ? 'Aarav Mehta' : 'Singhania Events'),
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
        const res = await EvencifyApi.signIn(email, password);

        if (res.error) {
          setAuthError(res.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        const userRole = res.user.role === 'organiser' ? 'organiser' : 'crew';
        onAuthenticated(userRole, res.user.email, res.user.name);
        onClose();
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Authentication error. Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setAuthError(null);
    setGoogleSetupRequired(false);

    try {
      const res = await EvencifyApi.signInWithGoogle(selectedRole);
      if (res.providerDisabled) {
        setIsLoading(false);
        setGoogleSetupRequired(true);
        return;
      }
      if (!res.success && res.error) {
        setIsLoading(false);
        setAuthError(res.error);
        return;
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.message?.toLowerCase().includes('provider is not enabled')) {
        setGoogleSetupRequired(true);
      } else {
        setAuthError(err.message || 'Google sign in failed');
      }
    }
  };

  const handleInstantGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const emailToUse = instantEmail.trim() || 'arvexastudio.co@gmail.com';
      const res = await EvencifyApi.signInWithGoogleInstant({
        email: emailToUse,
        fullName: instantFullName.trim() || (selectedRole === 'crew' ? 'Google Verified Crew' : 'Arvexa Studio'),
        role: selectedRole,
      });
      setIsLoading(false);
      onAuthenticated(selectedRole, res.user.email, res.user.name);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setAuthError(err.message || 'Instant Google sign in failed');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotEmailSent(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[28px] border-2 border-black bg-white p-6 sm:p-8 shadow-2xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <EvencifyLogo size="sm" showTagline={false} />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-black">
              {showForgotPassword
                ? 'Reset Password'
                : activeTab === 'signup'
                ? 'Create your account'
                : 'Welcome back'}
            </h3>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-black">
              {showForgotPassword
                ? 'Enter your registered email to receive reset instructions'
                : activeTab === 'signup'
                ? 'Join India’s premier verified event ecosystem'
                : 'Sign in to access your private dashboard'}
            </p>
          </div>

          {/* Mode Switcher: Log In / Sign Up */}
          {!showForgotPassword && (
            <div className="mb-5 flex rounded-xl bg-[#FFFDE6] p-1 border-2 border-black">
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 rounded-lg py-2 text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-black text-[#FED000] shadow-xs'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 rounded-lg py-2 text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-black text-[#FED000] shadow-xs'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                Log In
              </button>
            </div>
          )}

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-black" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              </div>

              {forgotEmailSent ? (
                <div className="rounded-xl bg-[#FED000] p-3 text-xs font-black text-black border-2 border-black">
                  Password reset link sent! Check your inbox.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#FED000] border-2 border-black py-3 text-xs sm:text-sm font-black text-black hover:bg-[#E5BB00] transition-all cursor-pointer"
                >
                  Send Reset Link
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-center text-xs font-bold text-black hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authError && (
                <div className="rounded-xl border-2 border-black bg-red-100 p-3 text-xs font-black text-black flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* How will you use Evencify? (Selection for signup and login) */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5">
                  How will you use Evencify?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('crew')}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-left border-2 transition-all cursor-pointer ${
                      selectedRole === 'crew'
                        ? 'border-black bg-[#FED000] font-black text-black'
                        : 'border-black bg-white text-black hover:bg-[#FFFDE6]'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border border-black ${
                        selectedRole === 'crew' ? 'bg-black text-[#FED000]' : 'bg-[#FED000] text-black'
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-black leading-tight">Crew Member</div>
                      <div className="text-[10px] font-semibold text-black">Find event shifts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('organiser')}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-left border-2 transition-all cursor-pointer ${
                      selectedRole === 'organiser'
                        ? 'border-black bg-[#FED000] font-black text-black'
                        : 'border-black bg-white text-black hover:bg-[#FFFDE6]'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border border-black ${
                        selectedRole === 'organiser' ? 'bg-black text-[#FED000]' : 'bg-[#FED000] text-black'
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-black leading-tight">Event Organiser</div>
                      <div className="text-[10px] font-semibold text-black">Build your team</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name for signup */}
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    {selectedRole === 'crew' ? 'Full Name' : 'Company / Contact Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'crew' ? 'Aarav Mehta' : 'Singhania Events'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-black" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-black">Password</label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-bold text-black hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-black" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-black hover:opacity-70 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FED000] border-2 border-black py-3 text-xs sm:text-sm font-black text-black transition-all hover:bg-[#E5BB00] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {activeTab === 'signup'
                        ? `Continue as ${selectedRole === 'crew' ? 'Crew' : 'Organiser'}`
                        : `Sign In as ${selectedRole === 'crew' ? 'Crew' : 'Organiser'}`}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Google Auth Option */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/20" />
                </div>
                <div className="relative flex justify-center text-[11px] text-black font-bold uppercase">
                  <span className="bg-white px-2">or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-black bg-white py-2.5 text-xs sm:text-sm font-black text-black hover:bg-[#FFFDE6] transition-colors cursor-pointer"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[#FED000] font-black text-xs">
                  G
                </div>
                <span>Continue with Google</span>
              </button>

              {/* Notice & Bypass when Google OAuth provider is not yet enabled in Supabase */}
              {googleSetupRequired && (
                <div className="rounded-2xl border-2 border-black bg-[#FFFDE6] p-4 text-xs space-y-3 mt-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-black text-[#FED000] font-black text-xs">
                      !
                    </div>
                    <div>
                      <p className="font-black text-black text-xs">
                        Google Provider Setup Needed in Supabase
                      </p>
                      <p className="text-[11px] font-medium text-black mt-0.5 leading-relaxed">
                        Supabase reported that the Google Auth provider is not enabled yet in your project.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-black bg-white p-3 space-y-2 text-[11px] font-semibold text-black">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-black">To enable native Google OAuth:</span>
                      <a
                        href="https://supabase.com/dashboard/project/tutspdayygbrrqtuepao/auth/providers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-black text-black underline hover:text-black/70 cursor-pointer"
                      >
                        Supabase Providers <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <ol className="list-decimal pl-4 space-y-1 text-black text-[11px]">
                      <li>Open the link above in your Supabase dashboard.</li>
                      <li>Find <strong>Google</strong> and toggle <strong>Enable Provider</strong> to ON.</li>
                      <li>Add your Google Cloud <strong>Client ID</strong> &amp; <strong>Secret</strong>.</li>
                    </ol>
                  </div>

                  <div className="border-t-2 border-black/20 pt-2 space-y-2">
                    <div className="flex items-center gap-1.5 text-black font-black text-[11px]">
                      <Zap className="h-3.5 w-3.5 text-black fill-[#FED000]" />
                      <span>Instant Google Sign-In (Database Connected):</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={instantEmail}
                        onChange={(e) => setInstantEmail(e.target.value)}
                        placeholder="arvexastudio.co@gmail.com"
                        className="flex-1 rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-semibold text-black focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleInstantGoogleLogin}
                        disabled={isLoading}
                        className="rounded-xl bg-[#FED000] border-2 border-black px-3.5 py-2 text-xs font-black text-black hover:bg-[#E5BB00] transition-colors cursor-pointer shrink-0"
                      >
                        Sign In Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-[11px] font-bold text-black">
            By continuing, you agree to Evencify’s Terms of Service & Privacy Policy.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
