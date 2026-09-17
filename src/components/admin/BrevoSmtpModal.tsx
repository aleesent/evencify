import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Server,
  Key,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrevoClient, BrevoStatus } from '../../services/brevoClient';

interface BrevoSmtpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrevoSmtpModal: React.FC<BrevoSmtpModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<BrevoStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch status when modal opens
  useEffect(() => {
    if (isOpen) {
      loadStatus();
      setTestResult(null);
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setIsLoading(true);
    const data = await BrevoClient.getStatus();
    setStatus(data);
    setIsLoading(false);
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) return;

    setIsTesting(true);
    setTestResult(null);

    const res = await BrevoClient.testConnection(testEmail.trim());
    setTestResult(res);
    setIsTesting(false);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-2xl z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-[#FED000]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  <span>Brevo SMTP &amp; Email Verification</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      status?.configured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {status?.configured
                      ? status.isApiConfigured
                        ? 'Active • REST API v3'
                        : 'Active • SMTP Relay'
                      : 'Sandbox Fallback'}
                  </span>
                </h3>
                <p className="text-xs text-neutral-500">
                  {status?.isApiConfigured
                    ? 'HTTPS REST API v3 transactional engine (bypasses cloud SMTP IP restrictions)'
                    : 'Transactional delivery engine for user signup and security OTPs'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Transport</div>
                <div className="text-xs font-bold text-neutral-900 mt-0.5 truncate">
                  {status?.isApiConfigured ? 'REST API v3' : status?.isSmtpConfigured ? 'SMTP Relay' : 'Sandbox'}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Host / Endpoint</div>
                <div className="text-xs font-bold text-neutral-900 mt-0.5 truncate font-mono">
                  {status?.isApiConfigured ? 'api.brevo.com' : status?.host || 'smtp-relay.brevo.com'}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Sender</div>
                <div className="text-xs font-bold text-neutral-900 mt-0.5 truncate">
                  {status?.senderEmail || 'verify@evencify.com'}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Account</div>
                <div className="text-xs font-bold text-neutral-900 mt-0.5 truncate">
                  {status?.user || 'Brevo Account'}
                </div>
              </div>
            </div>

            {/* Live Test Form */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 mb-2">
                <Send className="h-3.5 w-3.5 text-neutral-700" />
                <span>Send Live Test Verification Email</span>
              </h4>
              <p className="text-xs text-neutral-500 mb-3">
                Dispatch an instant test verification code via Brevo to verify relay deliverability.
              </p>

              <form onSubmit={handleTestEmail} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isTesting}
                  className="rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Test</span>
                    </>
                  )}
                </button>
              </form>

              {/* Test Result Feedback */}
              {testResult && (
                <div
                  className={`mt-3 rounded-xl p-3 text-xs flex items-start gap-2 border ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{testResult.message}</div>
                    {testResult.diagnostics && (
                      <div className="text-[11px] opacity-80 mt-1">
                        Host: {testResult.diagnostics.host}:{testResult.diagnostics.port} • Mode:{' '}
                        {testResult.diagnostics.mode}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Supabase SMTP Configuration Guide */}
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-neutral-700" />
                  <span>Supabase Auth &amp; Brevo SMTP Settings</span>
                </span>
                <span className="text-[11px] text-neutral-500 font-medium">Standard Parameters</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                To have Supabase Auth also send system confirmation links via your Brevo account, configure
                these parameters in <strong>Supabase Dashboard &rarr; Project Settings &rarr; Auth &rarr; SMTP Settings</strong>:
              </p>

              <div className="space-y-1.5 text-xs font-mono bg-neutral-900 text-neutral-200 p-3 rounded-xl">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-neutral-400">Sender Email:</span>
                  <span className="text-[#FED000]">{status?.senderEmail || 'verify@evencify.com'}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-neutral-400">Sender Name:</span>
                  <span>Evencify Verification</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-neutral-400">SMTP Host:</span>
                  <span>smtp-relay.brevo.com</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-neutral-400">SMTP Port:</span>
                  <span>587</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-neutral-400">SMTP User:</span>
                  <span>[Your Brevo Login Email]</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-neutral-400">SMTP Password:</span>
                  <span>[Your Brevo Master SMTP Key]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 text-xs font-semibold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
