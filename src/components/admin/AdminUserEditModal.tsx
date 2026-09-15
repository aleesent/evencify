import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import { UserAccount, CREW_CATEGORIES, CrewCategory } from '../../types';

interface AdminUserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  isNew?: boolean;
  onSave: (originalId: string, updatedUser: UserAccount) => void;
  onDelete?: (userId: string) => void;
}

export const AdminUserEditModal: React.FC<AdminUserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  isNew = false,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<UserAccount>({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'crew',
    status: 'Active',
    city: 'Surat',
    createdAt: new Date().toISOString().split('T')[0],
    isVerified: true,
    verificationBadge: 'Verified Pro',
    systemRating: 4.8,
    completedEventsCount: 5,
    expectedPay: '₹2,000 / shift',
    categories: ['Event Helper', 'Registration Desk'],
    companyName: '',
    hasUdyam: false,
    udyamNumber: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [originalId, setOriginalId] = useState('');
  const [activeTab, setActiveTab] = useState<'account' | 'role-details'>('account');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setOriginalId(user.id);
      setFormData({
        id: user.id || `usr-${Date.now()}`,
        name: user.name || '',
        email: user.email || '',
        password: user.password || 'password123',
        phone: user.phone || '+91 98000 00000',
        role: user.role || 'crew',
        status: user.status || 'Active',
        city: user.city || 'Surat',
        createdAt: user.createdAt || new Date().toISOString().split('T')[0],
        isVerified: user.isVerified ?? true,
        verificationBadge: user.verificationBadge || (user.role === 'organiser' ? 'Business Verified' : 'Verified Pro'),
        systemRating: user.systemRating ?? 4.8,
        completedEventsCount: user.completedEventsCount ?? 5,
        expectedPay: user.expectedPay || '₹2,000 / shift',
        categories: user.categories || ['Event Helper'],
        companyName: user.companyName || (user.role === 'organiser' ? user.name + ' Productions' : ''),
        hasUdyam: user.hasUdyam ?? (user.role === 'organiser' ? true : false),
        udyamNumber: user.udyamNumber || '',
        address: user.address || '',
      });
      setError('');
    } else if (isNew) {
      const newId = `usr-${Date.now().toString().slice(-6)}`;
      setOriginalId(newId);
      setFormData({
        id: newId,
        name: '',
        email: '',
        password: 'pass' + Math.floor(1000 + Math.random() * 9000),
        phone: '+91 ',
        role: 'crew',
        status: 'Active',
        city: 'Surat',
        createdAt: new Date().toISOString().split('T')[0],
        isVerified: true,
        verificationBadge: 'Verified Pro',
        systemRating: 4.8,
        completedEventsCount: 0,
        expectedPay: '₹2,000 / shift',
        categories: ['Event Helper'],
        companyName: '',
        hasUdyam: false,
        udyamNumber: '',
        address: '',
      });
      setError('');
    }
  }, [user, isNew, isOpen]);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789!@#$';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: res }));
    setShowPassword(true);
  };

  const handleToggleCategory = (cat: CrewCategory) => {
    const current = formData.categories || [];
    if (current.includes(cat)) {
      setFormData((prev) => ({ ...prev, categories: current.filter((c) => c !== cat) }));
    } else {
      setFormData((prev) => ({ ...prev, categories: [...current, cat] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!formData.id.trim()) {
      setError('User ID cannot be empty.');
      return;
    }

    onSave(originalId, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
              <Shield className="h-5 w-5 text-neutral-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                {isNew ? 'Provision New User Account' : 'Admin: Edit User Profile & Credentials'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isNew
                  ? 'Create and authorize an account with custom ID, role, and password.'
                  : `Full administrative override for ${formData.name || 'user'} (${originalId})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-100 my-4">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`pb-2 text-xs font-semibold px-3 transition-colors cursor-pointer ${
              activeTab === 'account'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Core Account & Credentials (ID & Pass)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('role-details')}
            className={`pb-2 text-xs font-semibold px-3 transition-colors cursor-pointer ${
              activeTab === 'role-details'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {formData.role === 'crew' ? 'Crew Profile & Skills' : formData.role === 'organiser' ? 'Organiser Business Details' : 'Admin Security Level'}
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {activeTab === 'account' && (
            <div className="space-y-4">
              
              {/* User ID & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    System User ID <span className="text-neutral-400 font-normal">(Editable)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full font-mono text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:border-neutral-400 focus:outline-hidden"
                    placeholder="usr-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    System Platform Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const newRole = e.target.value as any;
                      const badge =
                        newRole === 'organiser'
                          ? 'Business Verified'
                          : newRole === 'admin'
                          ? 'Platform Superadmin'
                          : 'Verified Pro';
                      setFormData({ ...formData, role: newRole, verificationBadge: badge });
                    }}
                    className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 font-medium focus:border-neutral-400 focus:outline-hidden"
                  >
                    <option value="crew">Crew Member (Event Staff / Seeker)</option>
                    <option value="organiser">Event Organiser (Planner / Agency)</option>
                    <option value="admin">Super Administrator (Full Ops Access)</option>
                  </select>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      placeholder="e.g. Aarav Mehta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password / Passcode */}
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-800">
                    User Password / Passcode
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Generate Random
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full font-mono text-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-10 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                    placeholder="Enter new user passcode"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Admins can view and reset passwords directly. The user can sign in immediately with this passcode.
                </p>
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      placeholder="+91 98251 00000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Operational City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      placeholder="Surat, Mumbai, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Status & Verification Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 font-medium focus:border-neutral-400 focus:outline-hidden"
                  >
                    <option value="Active">Active (Normal Platform Access)</option>
                    <option value="Suspended">Suspended (Blocked from Login)</option>
                  </select>
                </div>

                {/* Verification Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Identity Verification Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVerified: true })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        formData.isVerified
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Verified
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVerified: false })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        !formData.isVerified
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      <ShieldOff className="h-3.5 w-3.5 text-amber-600" />
                      Unverified
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Badge Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Public Verification Badge Label
                </label>
                <input
                  type="text"
                  value={formData.verificationBadge || ''}
                  onChange={(e) => setFormData({ ...formData, verificationBadge: e.target.value })}
                  className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                  placeholder="e.g. Business Verified, 4.9 ★ Crew Lead, Verified Pro"
                />
              </div>

            </div>
          )}

          {/* Tab 2: Role Specific Details */}
          {activeTab === 'role-details' && (
            <div className="space-y-4">
              {formData.role === 'crew' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        System Rating (★)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={formData.systemRating || 4.8}
                        onChange={(e) => setFormData({ ...formData, systemRating: parseFloat(e.target.value) || 4.8 })}
                        className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Shifts Completed
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.completedEventsCount || 0}
                        onChange={(e) => setFormData({ ...formData, completedEventsCount: parseInt(e.target.value) || 0 })}
                        className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Expected Remuneration
                      </label>
                      <input
                        type="text"
                        value={formData.expectedPay || ''}
                        onChange={(e) => setFormData({ ...formData, expectedPay: e.target.value })}
                        className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                        placeholder="e.g. ₹2,200 / shift"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Authorized Event Role Categories
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CREW_CATEGORIES.map((cat) => {
                        const isSelected = formData.categories?.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleToggleCategory(cat)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {formData.role === 'organiser' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Company / Agency Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.companyName || ''}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full text-xs rounded-xl border border-neutral-200 bg-white pl-9 pr-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                        placeholder="e.g. Singhania Events Ltd."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Udyam Registration Number
                      </label>
                      <input
                        type="text"
                        value={formData.udyamNumber || ''}
                        onChange={(e) => setFormData({ ...formData, udyamNumber: e.target.value })}
                        className="w-full text-xs font-mono rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                        placeholder="UDYAM-GJ-24-0098412"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="hasUdyam"
                        checked={formData.hasUdyam || false}
                        onChange={(e) => setFormData({ ...formData, hasUdyam: e.target.checked, isVerified: e.target.checked })}
                        className="h-4 w-4 accent-neutral-900 rounded cursor-pointer"
                      />
                      <label htmlFor="hasUdyam" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                        MSME / Udyam Business Verified
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Business Operating Address
                    </label>
                    <textarea
                      rows={2}
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full text-xs rounded-xl border border-neutral-200 bg-white p-3 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                      placeholder="Street, Tower, City, Pincode"
                    />
                  </div>
                </>
              )}

              {formData.role === 'admin' && (
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 space-y-2 text-xs text-neutral-600">
                  <div className="font-semibold text-neutral-900 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-neutral-700" />
                    Administrator Privileges Active
                  </div>
                  <p>
                    This account possesses unrestricted operator access across the entire Evencify ecosystem. The user can create, edit, verify, unverify, and delete any data record.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently delete account "${formData.name}" (${formData.id})?`)) {
                    onDelete(originalId);
                    onClose();
                  }
                }}
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {isNew ? 'Provision User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
