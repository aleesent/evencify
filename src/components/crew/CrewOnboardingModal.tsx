import React, { useState, useEffect, useRef } from 'react';
import { CrewProfile, CrewCategory, CREW_CATEGORIES } from '../../types';
import { X, CheckCircle2, Upload, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EvencifyApi } from '../../services/api';

interface CrewOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<CrewProfile>) => Promise<void> | void;
  initialProfile?: Partial<CrewProfile>;
}

export const CrewOnboardingModal: React.FC<CrewOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Sneha Verma');
  const [phone, setPhone] = useState(initialProfile?.phone || '+91 98251 44321');
  const [email, setEmail] = useState(initialProfile?.email || 'sneha.verma@example.com');
  const [age, setAge] = useState<number>(initialProfile?.age || 23);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialProfile?.gender || 'Female');
  const [city, setCity] = useState(initialProfile?.city || 'Surat');
  const [address, setAddress] = useState(initialProfile?.address || '402, Riverfront Enclave, Vesu');
  const [pincode, setPincode] = useState(initialProfile?.pincode || '395007');
  const [experienceYears, setExperienceYears] = useState<number>(initialProfile?.experienceYears || 3);
  const [experienceLevel, setExperienceLevel] = useState<'Fresher' | 'Experienced' | 'Veteran'>('Experienced');
  const [selectedCategories, setSelectedCategories] = useState<CrewCategory[]>(
    initialProfile?.categories || ['Hospitality Staff', 'Registration Desk']
  );
  const [photoUrl, setPhotoUrl] = useState(
    initialProfile?.photoUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );
  const [expectedPay, setExpectedPay] = useState(initialProfile?.expectedPay || '₹1,500 / shift');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialProfile) {
      if (initialProfile.name) setName(initialProfile.name);
      if (initialProfile.phone) setPhone(initialProfile.phone);
      if (initialProfile.email) setEmail(initialProfile.email);
      if (initialProfile.age) setAge(initialProfile.age);
      if (initialProfile.gender) setGender(initialProfile.gender);
      if (initialProfile.city) setCity(initialProfile.city);
      if (initialProfile.address) setAddress(initialProfile.address);
      if (initialProfile.pincode) setPincode(initialProfile.pincode);
      if (initialProfile.experienceYears !== undefined) setExperienceYears(initialProfile.experienceYears);
      if (initialProfile.experienceLevel) setExperienceLevel(initialProfile.experienceLevel);
      if (initialProfile.categories) setSelectedCategories(initialProfile.categories);
      if (initialProfile.photoUrl) setPhotoUrl(initialProfile.photoUrl);
      if (initialProfile.expectedPay) setExpectedPay(initialProfile.expectedPay);
    }
  }, [isOpen, initialProfile]);

  if (!isOpen) return null;

  const toggleCategory = (cat: CrewCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB.');
      return;
    }

    setUploadError(null);
    setIsUploadingPhoto(true);
    try {
      const publicUrl = await EvencifyApi.uploadAvatar(file, initialProfile?.id);
      setPhotoUrl(publicUrl);
    } catch (err: any) {
      console.error('Photo upload failed:', err);
      setUploadError('Could not upload photo to storage. You can also paste an image URL.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({
        name,
        phone,
        email,
        age,
        gender,
        city,
        address,
        pincode,
        experienceYears,
        experienceLevel,
        categories: selectedCategories,
        photoUrl,
        expectedPay,
        systemRating: initialProfile?.systemRating || 4.9, // System generated, NOT manual
      });
      onClose();
    } catch (err) {
      console.error('Save profile error:', err);
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
          className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[28px] border-2 border-black bg-white p-6 sm:p-8 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-black hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FED000] px-3 py-1 text-[11px] font-black text-black uppercase tracking-wider">
              CREW ONBOARDING
            </span>
            <h2 className="mt-2 text-2xl font-black text-black">
              Complete your Crew Profile
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-bold text-black">
              Provide your details and primary categories to start discovering and applying for event opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name, Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
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
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Age, Gender, Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min={18}
                  max={65}
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
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
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Address, City, PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-black mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
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
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">
                  Expected Pay
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

            {/* Profile Photo */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black text-black">
                  Profile Photo
                </label>
                <span className="text-[11px] font-bold text-neutral-500">
                  Direct Upload or URL
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-black bg-neutral-100 shadow-xs"
                  />
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-1.5 text-xs font-black text-black hover:bg-[#FFFDE6] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="h-3.5 w-3.5 text-black" />
                      <span>{isUploadingPhoto ? 'Uploading to Bucket...' : 'Upload Image File'}</span>
                    </button>
                    <span className="text-[11px] font-bold text-neutral-400">or paste URL:</span>
                  </div>

                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                  />
                </div>
              </div>
              {uploadError && (
                <p className="mt-1 text-[11px] font-bold text-red-600">{uploadError}</p>
              )}
            </div>

            {/* Crew Categories (Multiple Selection) */}
            <div>
              <label className="block text-xs font-black text-black mb-1.5">
                Primary Roles & Categories (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CREW_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-black text-left border-2 border-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-[#FED000]'
                          : 'bg-white text-black hover:bg-[#FFFDE6]'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#FED000] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Rating Notice (Never Manual) */}
            <div className="rounded-xl border-2 border-black bg-[#FFFDE6] p-3 flex items-start gap-2 text-xs text-black font-bold">
              <Lock className="h-4 w-4 text-black shrink-0 mt-0.5" />
              <span>
                <strong>System-Calculated Rating:</strong> Rating starts at verified 4.9★ and updates automatically based on organizer reviews and shift completion history. Manual self-rating is prohibited.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
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
