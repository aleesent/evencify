import React, { useState, useEffect, useRef } from 'react';
import { OrganiserProfile } from '../../types';
import { X, Building2, ShieldCheck, CheckCircle2, ArrowRight, Lock, Loader2, Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyApi } from '../../services/api';

const MAX_FILE_SIZE_BYTES = 250 * 1024; // 250 KB exact limit

interface OrganiserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<OrganiserProfile>) => Promise<void> | void;
  initialProfile?: Partial<OrganiserProfile>;
  isMandatory?: boolean;
}

export const OrganiserOnboardingModal: React.FC<OrganiserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
  isMandatory = false,
}) => {
  // Empty defaults for newly created accounts (no random/default-filled user data)
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [hasUdyam, setHasUdyam] = useState(false);
  const [udyamNumber, setUdyamNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialProfile?.name || '');
      setCompanyName(initialProfile?.companyName || '');
      setEmail(initialProfile?.email || '');
      setPhone(initialProfile?.phone || '');
      setAddress(initialProfile?.address || '');
      setPincode(initialProfile?.pincode || initialProfile?.pinCode || '');
      setCity(initialProfile?.city || '');
      setHasUdyam(initialProfile?.hasUdyam ?? false);
      setUdyamNumber(initialProfile?.udyamNumber || '');
      setPhotoUrl(initialProfile?.photoUrl || '');
      setUploadError(null);
      setFormError(null);
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setUploadError(null);
    setFormError(null);

    // 1. Image type check
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // 2. Strict 250 KB file size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const actualKb = (file.size / 1024).toFixed(1);
      setUploadError(
        `File is ${actualKb} KB. Maximum allowed logo/photo size is 250 KB. Please choose a smaller file.`
      );
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const uploadedUrl = await EvencifyApi.uploadAvatar(file, initialProfile?.id);
      setPhotoUrl(uploadedUrl);
    } catch (err: any) {
      console.error('Logo/photo upload failed:', err);
      setUploadError(err.message || 'Could not upload image. Please select an image under 250 KB.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Please enter the primary contact / host name.');
      return;
    }
    if (!companyName.trim()) {
      setFormError('Please enter your company, agency, or organisation name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid business email address.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter an active contact phone number.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please enter your operating city.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter your registered office address.');
      return;
    }
    if (!pincode.trim()) {
      setFormError('Please enter your PIN code.');
      return;
    }
    if (hasUdyam && !udyamNumber.trim()) {
      setFormError('Please provide your Udyam registration number or toggle it off.');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveProfile({
        name: name.trim(),
        companyName: companyName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        pinCode: pincode.trim(),
        city: city.trim(),
        hasUdyam,
        udyamNumber: hasUdyam ? udyamNumber.trim() : undefined,
        photoUrl: photoUrl.trim(),
      });
      onClose();
    } catch (err: any) {
      console.error('Save organiser profile error:', err);
      setFormError(err.message || 'Failed to save organiser profile. Please try again.');
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
          onClick={() => {
            if (!isMandatory) onClose();
          }}
          className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative my-6 sm:my-8 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 z-10 shadow-2xl shadow-neutral-900/10"
        >
          {/* Close button only visible if NOT mandatory */}
          {!isMandatory && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800">
                <Building2 className="h-3.5 w-3.5 text-neutral-600" />
                Organiser Onboarding
              </span>
              {isMandatory && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                  Mandatory Profile Setup
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Set Up Your Organiser Profile
            </h2>
            <p className="mt-1 text-sm font-normal text-neutral-500 leading-relaxed">
              {isMandatory
                ? 'Please complete your business credentials and company logo to start posting events.'
                : 'Provide your business details and credentials to publish event requirements.'}
            </p>
          </div>

          {/* Validation Banner */}
          {formError && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-200/80 p-3.5 flex items-start gap-2.5 text-xs font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. COMPANY LOGO / AVATAR UPLOAD (Drag & Drop or Selection, Max 250 KB) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-neutral-700">
                  Company Logo / Profile Photo
                </label>
                <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-600 px-2.5 py-0.5 text-[11px] font-medium">
                  Max 250 KB
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border border-dashed p-5 text-center cursor-pointer transition-all duration-200 group ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/40 scale-[0.99]'
                    : photoUrl
                    ? 'border-neutral-200 bg-white hover:border-neutral-300'
                    : 'border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-400'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {photoUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <img
                      src={photoUrl}
                      alt="Company Logo"
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-neutral-200 shadow-sm shrink-0 bg-neutral-100"
                    />
                    <div className="text-center sm:text-left space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Logo Uploaded Successfully</span>
                      </div>
                      <p className="text-xs text-neutral-500 font-normal">
                        Click or drag another image here to replace (max 250 KB)
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoUrl('');
                        }}
                        className="text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200/80 group-hover:text-neutral-900 transition-colors">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {isUploadingPhoto ? 'Uploading Logo...' : 'Upload Company Logo (Drag & Drop or Click)'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5 font-normal">
                      PNG, JPG, or WebP up to <strong>250 KB</strong>
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-2.5 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs font-medium text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 2. PRIMARY CONTACT & COMPANY NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Contact / Host Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Company / Agency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Events & Media"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* 3. EMAIL & PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@agency.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* 4. ADDRESS, CITY, PIN CODE */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Office Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Office suite, building, street"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="e.g. 400001"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/40 hover:bg-white focus:bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* 5. UDYAM REGISTRATION */}
            <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 transition-all">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUdyam}
                  onChange={(e) => setHasUdyam(e.target.checked)}
                  className="h-4 w-4 rounded-md border-neutral-300 text-neutral-900 accent-neutral-900 cursor-pointer"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                    Registered MSME / Udyam Business
                  </span>
                  <p className="text-xs font-normal text-neutral-500 mt-0.5">
                    Verified businesses receive a trusted badge and higher applicant response rates.
                  </p>
                </div>
              </label>

              {hasUdyam && (
                <div className="mt-3.5 pt-3 border-t border-neutral-200/80">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Udyam Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={hasUdyam}
                    value={udyamNumber}
                    onChange={(e) => setUdyamNumber(e.target.value)}
                    placeholder="UDYAM-XX-00-0000000"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 text-sm font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-[0.99]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Saving Organiser Profile...</span>
                </>
              ) : (
                <>
                  <span>Save Profile & Continue</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
