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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative my-6 sm:my-8 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] border-2 border-black bg-white p-5 sm:p-8 z-10 shadow-2xl"
        >
          {/* Close button only visible if NOT mandatory */}
          {!isMandatory && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 rounded-full p-2 text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FED000] px-3 py-0.5 text-[11px] font-black text-black uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5" />
                EVENT ORGANISER ONBOARDING
              </span>
              {isMandatory && (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Mandatory Profile Setup
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Set Up Your Organiser Profile
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-600">
              {isMandatory
                ? 'Please complete your business credentials and company logo to start posting events.'
                : 'Provide your business details and credentials to publish event requirements.'}
            </p>
          </div>

          {/* Validation Banner */}
          {formError && (
            <div className="mb-5 rounded-xl border-2 border-red-500 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs font-bold text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. COMPANY LOGO / AVATAR UPLOAD (Drag & Drop or Selection, Max 250 KB) */}
            <div className="rounded-2xl border-2 border-black bg-neutral-50/80 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-black uppercase tracking-wide">
                  Company Logo / Profile Photo
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-black text-[#FED000] px-2 py-0.5 text-[10px] font-black">
                  Max 250 KB
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-black bg-[#FED000]/20 scale-[0.99]'
                    : photoUrl
                    ? 'border-neutral-300 bg-white hover:border-black'
                    : 'border-neutral-400 bg-white hover:border-black hover:bg-[#FFFDE6]/40'
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
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-black shadow-md shrink-0 bg-neutral-100"
                    />
                    <div className="text-center sm:text-left space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Logo Uploaded Successfully</span>
                      </div>
                      <p className="text-[11px] font-medium text-neutral-500">
                        Click or drag another image here to replace (max 250 KB)
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoUrl('');
                        }}
                        className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#FED000] border-2 border-black shadow-xs">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#FED000]" />
                      ) : (
                        <Upload className="h-5 w-5 text-[#FED000]" />
                      )}
                    </div>
                    <p className="text-xs font-black text-black">
                      {isUploadingPhoto ? 'Uploading Logo...' : 'Upload Company Logo (Drag & Drop or Click)'}
                    </p>
                    <p className="text-[10px] font-medium text-neutral-500">
                      PNG, JPG, or WebP up to <strong>250 KB</strong>
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-2 rounded-lg bg-red-100/90 border border-red-300 p-2 text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 2. PRIMARY CONTACT & COMPANY NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Contact / Host Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Company / Agency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Events & Media"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 3. EMAIL & PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@agency.com"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 4. ADDRESS, CITY, PIN CODE */}
            <div>
              <label className="block text-xs font-black text-black mb-1">
                Office Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Office suite, building, street"
                className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="e.g. 400001"
                  className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 5. UDYAM REGISTRATION */}
            <div className="rounded-xl border-2 border-black bg-[#FFFDE6] p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUdyam}
                  onChange={(e) => setHasUdyam(e.target.checked)}
                  className="h-4 w-4 rounded-md border-2 border-black text-black accent-black cursor-pointer"
                />
                <div>
                  <span className="text-xs sm:text-sm font-black text-black">
                    Registered MSME / Udyam Business
                  </span>
                  <p className="text-[11px] font-medium text-neutral-600">
                    Verified businesses receive a trusted badge and higher applicant response rates.
                  </p>
                </div>
              </label>

              {hasUdyam && (
                <div className="mt-3">
                  <label className="block text-xs font-black text-black mb-1">
                    Udyam Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={hasUdyam}
                    value={udyamNumber}
                    onChange={(e) => setUdyamNumber(e.target.value)}
                    placeholder="UDYAM-XX-00-0000000"
                    className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-black focus:bg-white focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FED000] py-3.5 text-sm font-black text-black hover:bg-[#E5BB00] transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Saving Organiser Profile...</span>
                </>
              ) : (
                <>
                  <span>Save Profile & Continue</span>
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
