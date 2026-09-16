import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyApi } from '../../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (adminEmail: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await EvencifyApi.signIn(email, password);
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      if (res.user.role !== 'admin') {
        setError('Access Denied: This account does not possess Administrator privileges.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onAuthenticated(res.user.email);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Authentication error.');
    }
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
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-neutral-900 shadow-xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-100 text-neutral-800 mb-3">
              <Shield className="h-6 w-6 text-neutral-700" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              Evencify Admin Portal
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Restricted system management access for platform operators.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-hidden"
                  placeholder="admin@yourdomain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Operator Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-hidden"
                  placeholder="Enter passcode"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying Operator Session...</span>
              ) : (
                <>
                  <span>Authenticate & Enter Admin Console</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-[11px] text-neutral-400">
            Internal audit logging enabled • Evencify Platform Operations
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
