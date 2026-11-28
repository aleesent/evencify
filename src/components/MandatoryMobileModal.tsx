import React, { useState } from 'react';
import { Phone, ShieldCheck, AlertCircle, CheckCircle2, LogOut, ArrowRight, Loader2 } from 'lucide-react';
import { EvencifyLogo } from './EvencifyLogo';
import { getMobileValidationError, normalizeMobileNumber } from '../utils/phone';

interface MandatoryMobileModalProps {
  isOpen: boolean;
  userEmail: string;
  userName?: string;
  userRole: 'crew' | 'organiser' | 'admin';
  onSaveMobile: (mobile: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
}

export const MandatoryMobileModal: React.FC<MandatoryMobileModalProps> = ({
  isOpen,
  userEmail,
  userName,
  userRole,
  onSaveMobile,
  onLogout,
}) => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErr = getMobileValidationError(mobile);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setIsSaving(true);
    try {
      const normalized = normalizeMobileNumber(mobile);
      const res = await onSaveMobile(normalized);
      if (!res.success) {
        setError(res.error || 'Could not save your mobile number. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not save your mobile number. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mandatory-mobile-title"
    >
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <EvencifyLogo size="sm" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Action Required</span>
          </div>
          <h2 id="mandatory-mobile-title" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Add Your Mobile Number
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            A valid mobile number is compulsory for all Evencify accounts{userName ? `, ${userName}` : ''}. Add yours to continue accessing your{' '}
            <span className="font-semibold capitalize">{userRole}</span> account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-600">
            Signed in as <span className="font-semibold text-neutral-900">{userEmail}</span>
          </div>

          <div>
            <label
              htmlFor="mandatory-mobile-input"
              className="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                id="mandatory-mobile-input"
                type="tel"
                required
                autoFocus
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Used for shift alerts, event coordination, and account verification.</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#FED000] py-3 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Mobile Number...</span>
              </>
            ) : (
              <>
                <span>Save &amp; Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="pt-2 border-t border-neutral-100 text-center">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out instead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
