import React, { useState, useEffect } from 'react';
import { OrganiserProfile } from '../../types';
import { X, Building2, ShieldCheck, CheckCircle2, ArrowRight, FileCheck, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrganiserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<OrganiserProfile>) => Promise<void> | void;
  initialProfile?: Partial<OrganiserProfile>;
}

export const OrganiserOnboardingModal: React.FC<OrganiserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Rajesh Singhania');
  const [companyName, setCompanyName] = useState(
    initialProfile?.companyName || 'Singhania Events & Media Ltd.'
  );
  const [email, setEmail] = useState(initialProfile?.email || 'rajesh@singhaniaevents.com');
  const [phone, setPhone] = useState(initialProfile?.phone || '+91 98251 10022');
  const [address, setAddress] = useState(
    initialProfile?.address || '601, World Trade Center, Ring Road'
  );
  const [pincode, setPincode] = useState(initialProfile?.pincode || '395002');
  const [city, setCity] = useState(initialProfile?.city || 'Surat');
  const [hasUdyam, setHasUdyam] = useState(initialProfile?.hasUdyam ?? true);
  const [udyamNumber, setUdyamNumber] = useState(
    initialProfile?.udyamNumber || 'UDYAM-GJ-24-0098412'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && initialProfile) {
      if (initialProfile.name) setName(initialProfile.name);
      if (initialProfile.companyName) setCompanyName(initialProfile.companyName);
      if (initialProfile.email) setEmail(initialProfile.email);
      if (initialProfile.phone) setPhone(initialProfile.phone);
      if (initialProfile.address) setAddress(initialProfile.address);
      if (initialProfile.pincode) setPincode(initialProfile.pincode);
      if (initialProfile.city) setCity(initialProfile.city);
      if (initialProfile.hasUdyam !== undefined) setHasUdyam(initialProfile.hasUdyam);
      if (initialProfile.udyamNumber) setUdyamNumber(initialProfile.udyamNumber);
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({
        name,
        companyName,
        email,
        phone,
        address,
        pincode,
        city,
        hasUdyam,
        udyamNumber: hasUdyam ? udyamNumber : undefined,
      });
      onClose();
    } catch (err) {
      console.error('Save organiser profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
          className="relative my-8 w-full max-w-xl overflow-hidden rounded-[28px] border-2 border-black bg-white p-6 sm:p-8 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-black hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FED000] px-3 py-1 text-[11px] font-black text-black uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              EVENT ORGANISER ONBOARDING
            </span>
            <h2 className="mt-2 text-2xl font-black text-black">
              Set Up Your Organiser Profile
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-bold text-black">
              Provide your business credentials to start publishing event requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1">
                Business Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Udyam Registration Question */}
            <div className="rounded-2xl border-2 border-black bg-[#FFFDE6] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-black">
                    Do you have a Udyam registration?
                  </div>
                  <div className="text-[11px] font-bold text-black">
                    Helps verify your MSME business credentials
                  </div>
                </div>

                <div className="flex rounded-xl border-2 border-black bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setHasUdyam(true)}
                    className={`rounded-lg px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                      hasUdyam ? 'bg-black text-[#FED000]' : 'text-black hover:bg-black/10'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasUdyam(false)}
                    className={`rounded-lg px-3 py-1 text-xs font-black transition-all cursor-pointer ${
                      !hasUdyam ? 'bg-black text-[#FED000]' : 'text-black hover:bg-black/10'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {hasUdyam && (
                <div className="pt-2 border-t-2 border-black/15">
                  <label className="block text-xs font-black text-black mb-1">
                    Udyam Registration Number
                  </label>
                  <input
                    type="text"
                    required={hasUdyam}
                    value={udyamNumber}
                    onChange={(e) => setUdyamNumber(e.target.value)}
                    placeholder="UDYAM-XX-00-0000000"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-black text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-black">
                    <Lock className="h-3 w-3 text-black" />
                    <span>Kept private for platform verification purposes. Never publicly exposed.</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FED000] py-3 text-xs sm:text-sm font-black text-black hover:bg-[#E5BB00] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Syncing Live with Supabase...</span>
                </>
              ) : (
                <>
                  <span>Save Profile & Sync Live</span>
                  <ArrowRight className="h-4 w-4 text-black" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
