import React, { useState, useEffect, useRef } from 'react';
import { CrewProfile, CrewCategory, CREW_CATEGORIES } from '../../types';
import { X, CheckCircle2, Upload, ArrowRight, Lock, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyApi } from '../../services/api';

const MAX_FILE_SIZE_BYTES = 250 * 1024; // 250 KB exact limit

interface CrewOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<CrewProfile>) => Promise<void> | void;
  initialProfile?: Partial<CrewProfile>;
  isMandatory?: boolean;
}

export const CrewOnboardingModal: React.FC<CrewOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
  isMandatory = false,
}) => {
  // Empty defaults for newly created accounts (no random/default-filled user data)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [experienceLevel, setExperienceLevel] = useState<'Fresher' | 'Experienced' | 'Veteran'>('Fresher');
  const [selectedCategories, setSelectedCategories] = useState<CrewCategory[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [expectedPay, setExpectedPay] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with initialProfile when opened
  useEffect(() => {
    if (isOpen) {
      setName(initialProfile?.name || '');
      setPhone(initialProfile?.phone || '');
      setEmail(initialProfile?.email || '');
      setAge(initialProfile?.age ? initialProfile.age : '');
      setGender(initialProfile?.gender || 'Male');
      setCity(initialProfile?.city || '');
      setAddress(initialProfile?.address || '');
      setPincode(initialProfile?.pincode || initialProfile?.pinCode || '');
      setExperienceYears(initialProfile?.experienceYears ?? 0);
      setExperienceLevel(initialProfile?.experienceLevel || 'Fresher');
      setSelectedCategories(initialProfile?.categories && initialProfile.categories.length > 0 ? initialProfile.categories : []);
      setPhotoUrl(initialProfile?.photoUrl || '');
      setExpectedPay(initialProfile?.expectedPay || '');
      setUploadError(null);
      setFormError(null);
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  const toggleCategory = (cat: CrewCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

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
        `File is ${actualKb} KB. Maximum allowed profile picture size is 250 KB. Please choose a smaller photo.`
      );
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const uploadedUrl = await EvencifyApi.uploadAvatar(file, initialProfile?.id);
      setPhotoUrl(uploadedUrl);
    } catch (err: any) {
      console.error('Photo upload failed:', err);
      setUploadError(err.message || 'Could not upload photo. Please select an image under 250 KB.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value so re-selecting the same file fires onChange
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
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your active phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please enter your city.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter your residential address.');
      return;
    }
    if (!pincode.trim()) {
      setFormError('Please enter your 6-digit PIN code.');
      return;
    }
    if (selectedCategories.length === 0) {
      setFormError('Please select at least one primary crew role category.');
      return;
    }
    if (!photoUrl.trim()) {
      setFormError('Please upload your profile picture (maximum 250 KB) to complete your profile.');
      return;
    }
    if (!age || Number(age) < 18) {
      setFormError('Crew members must be at least 18 years old.');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        age: Number(age),
        gender,
        city: city.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        pinCode: pincode.trim(),
        experienceYears: Number(experienceYears) || 0,
        experienceLevel,
        categories: selectedCategories,
        photoUrl: photoUrl.trim(),
        expectedPay: expectedPay.trim() || '₹1,500 / shift',
        systemRating: initialProfile?.systemRating || 4.9,
      });
      onClose();
    } catch (err: any) {
      console.error('Save profile error:', err);
      setFormError(err.message || 'Failed to save profile. Please try again.');
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
          className="relative my-6 sm:my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border-2 border-black bg-white p-5 sm:p-8 z-10 shadow-2xl"
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

          {/* Header & Mandatory Notice */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FED000] px-3 py-0.5 text-[11px] font-black text-black uppercase tracking-wider">
                CREW ONBOARDING
              </span>
              {isMandatory && (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Mandatory Profile Setup
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Complete Your Crew Profile
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-600">
              {isMandatory
                ? 'Please complete your profile details and upload your profile picture to unlock your shift dashboard.'
                : 'Update your verified credentials, categories, and contact details.'}
            </p>
          </div>

          {/* Validation Banner */}
          {formError && (
            <div className="mb-5 rounded-xl border-2 border-red-500 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs font-bold text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. PROFILE PICTURE UPLOAD ZONE (Drag & Drop or Selection) */}
            <div className="rounded-2xl border-2 border-black bg-neutral-50/80 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-black uppercase tracking-wide">
                  Profile Picture <span className="text-red-500">*</span>
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-black text-[#FED000] px-2 py-0.5 text-[10px] font-black">
                  Max 250 KB • Required
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed p-4 sm:p-6 text-center cursor-pointer transition-all ${
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
                      alt="Uploaded Avatar"
                      referrerPolicy="no-referrer"
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-black shadow-md shrink-0 bg-neutral-100"
                    />
                    <div className="text-center sm:text-left space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Photo Uploaded Successfully</span>
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
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#FED000] border-2 border-black shadow-xs">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-6 w-6 animate-spin text-[#FED000]" />
                      ) : (
                        <Upload className="h-6 w-6 text-[#FED000]" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-black text-black">
                        {isUploadingPhoto ? 'Uploading & Validating Photo...' : 'Click to Upload or Drag & Drop'}
                      </p>
                      <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
                        JPG, PNG, or WebP up to <strong>250 KB</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="mt-2.5 rounded-lg bg-red-100/90 border border-red-300 p-2.5 text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 2. BASIC DETAILS: Full Name, Phone, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
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
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 3. AGE, GENDER, EXPERIENCE LEVEL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Age (18+) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={18}
                  max={75}
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 22"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setExperienceLevel(val);
                    if (val === 'Fresher') setExperienceYears(0);
                    else if (val === 'Experienced') setExperienceYears(2);
                    else if (val === 'Veteran') setExperienceYears(5);
                  }}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-bold text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                >
                  <option value="Fresher">Fresher (0 - 1 yr)</option>
                  <option value="Experienced">Experienced (2 - 4 yrs)</option>
                  <option value="Veteran">Veteran (5+ yrs)</option>
                </select>
              </div>
            </div>

            {/* 4. ADDRESS, CITY, PIN CODE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-black mb-1">
                  Residential Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, Street, Locality"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Surat"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="e.g. 395007"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Expected Pay per Shift
                </label>
                <input
                  type="text"
                  value={expectedPay}
                  onChange={(e) => setExpectedPay(e.target.value)}
                  placeholder="e.g. ₹1,500 / shift"
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* 5. PRIMARY CATEGORIES (Select at least 1) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-black">
                  Primary Roles & Categories (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-bold text-neutral-500">
                  {selectedCategories.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CREW_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-black text-left border-2 border-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-[#FED000] shadow-xs'
                          : 'bg-white text-black hover:bg-[#FFFDE6]'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[#FED000] shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Rating Information */}
            <div className="rounded-xl border-2 border-black bg-[#FFFDE6] p-3.5 flex items-start gap-2.5 text-xs text-black font-medium">
              <Lock className="h-4 w-4 text-black shrink-0 mt-0.5" />
              <span>
                <strong>System-Calculated Rating:</strong> Rating starts verified at 4.9★ and evolves automatically based on organizer reviews and completed shifts. Manual self-rating is prohibited.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FED000] py-3.5 text-sm font-black text-black hover:bg-[#E5BB00] transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>Saving Profile to Database...</span>
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
