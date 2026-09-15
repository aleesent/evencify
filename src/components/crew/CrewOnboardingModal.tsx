import React, { useState, useEffect } from 'react';
import { CrewProfile, CrewCategory, CREW_CATEGORIES } from '../../types';
import { X, CheckCircle2, Upload, AlertCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CrewOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<CrewProfile>) => void;
  initialProfile?: Partial<CrewProfile>;
}

export const CrewOnboardingModal: React.FC<CrewOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Aarav Mehta');
  const [phone, setPhone] = useState(initialProfile?.phone || '+91 98251 44556');
  const [email, setEmail] = useState(initialProfile?.email || 'aarav.mehta@gmail.com');
  const [age, setAge] = useState<number>(initialProfile?.age || 23);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialProfile?.gender || 'Male');
  const [city, setCity] = useState(initialProfile?.city || 'Surat');
  const [address, setAddress] = useState(initialProfile?.address || '104, Shivalik Park, Vesu');
  const [pincode, setPincode] = useState(initialProfile?.pincode || '395007');
  const [experienceYears, setExperienceYears] = useState<number>(initialProfile?.experienceYears || 2);
  const [experienceLevel, setExperienceLevel] = useState<'Fresher' | 'Experienced' | 'Veteran'>('Experienced');
  const [selectedCategories, setSelectedCategories] = useState<CrewCategory[]>(
    initialProfile?.categories || ['Hospitality Staff', 'Registration Desk']
  );
  const [photoUrl, setPhotoUrl] = useState(
    initialProfile?.photoUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  );
  const [expectedPay, setExpectedPay] = useState(initialProfile?.expectedPay || '₹1,500 / shift');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
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
              <label className="block text-xs font-black text-black mb-1">
                Profile Photo URL
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={photoUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-xl object-cover border-2 border-black"
                />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-xl border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-medium text-black focus:bg-[#FFFDE6] focus:outline-hidden"
                />
              </div>
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FED000] py-3 text-xs sm:text-sm font-black text-black hover:bg-[#E5BB00] transition-all cursor-pointer"
            >
              <span>Save & Redirect to Crew Dashboard</span>
              <ArrowRight className="h-4 w-4 text-black" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
