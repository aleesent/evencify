import React, { useState } from 'react';
import {
  Users,
  Building2,
  Calendar,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Shield,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  Settings,
  FileText,
  MessageSquare,
  Lock,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  ShieldOff,
  KeyRound,
  Check,
  X,
  Copy,
  Briefcase,
  DollarSign,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  CrewProfile,
  OrganiserProfile,
  EventItem,
  CrewApplication,
  AdminProfile,
  UserAccount,
  EventCoordinationGroup,
} from '../../types';
import { AdminUserEditModal } from './AdminUserEditModal';
import { AdminEventEditModal } from './AdminEventEditModal';
import { AdminEventApplicantsModal } from './AdminEventApplicantsModal';

interface AdminDashboardProps {
  crewList: CrewProfile[];
  events: EventItem[];
  applications: CrewApplication[];
  organiserProfile: OrganiserProfile;
  adminProfile: AdminProfile;
  users: UserAccount[];
  eventGroups?: EventCoordinationGroup[];
  onCreateEventGroup?: (eventId: string) => void;
  onOpenGroupChat?: (group: EventCoordinationGroup) => void;
  onToggleUserStatus: (userId: string) => void;
  onToggleUserVerification?: (userId: string) => void;
  onUpdateUser?: (originalUserId: string, updatedUser: UserAccount) => void;
  onCreateUser?: (newUser: UserAccount) => void;
  onUpdateUserRole?: (userId: string, newRole: 'crew' | 'organiser' | 'admin') => void;
  onDeleteUser?: (userId: string) => void;
  onUpdateEventStatus: (eventId: string, status: EventItem['status']) => void;
  onEditEvent?: (updatedEvent: EventItem) => void;
  onDeleteEvent?: (eventId: string) => void;
  onUpdateApplicationStatus: (appId: string, status: CrewApplication['status']) => void;
  onDeleteApplication?: (appId: string) => void;
  onViewCrewProfile?: (crew: CrewProfile) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  crewList,
  events,
  applications,
  organiserProfile,
  adminProfile,
  users,
  eventGroups = [],
  onCreateEventGroup,
  onOpenGroupChat,
  onToggleUserStatus,
  onToggleUserVerification,
  onUpdateUser,
  onCreateUser,
  onUpdateUserRole,
  onDeleteUser,
  onUpdateEventStatus,
  onEditEvent,
  onDeleteEvent,
  onUpdateApplicationStatus,
  onDeleteApplication,
  onViewCrewProfile,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'users' | 'crew' | 'organisers' | 'events' | 'applications' | 'groups' | 'reports' | 'reviews' | 'settings'
  >('users');

  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'crew' | 'organiser' | 'admin'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  
  // Applications Pipeline filtering
  const [applicationEventFilter, setApplicationEventFilter] = useState<string>('all');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<string>('all');
  const [applicationSearch, setApplicationSearch] = useState<string>('');

  // Password visibility toggle per user row
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Modals state
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [inspectingEventForApplicants, setInspectingEventForApplicants] = useState<EventItem | null>(null);

  const [roleChangeUser, setRoleChangeUser] = useState<UserAccount | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<'crew' | 'organiser' | 'admin'>('crew');

  // Platform Metrics
  const totalCrew = crewList.length;
  const totalOrganisers = users.filter((u) => u.role === 'organiser').length || 1;
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === 'Open').length;
  const totalApplications = applications.length;
  const selectedCrew = applications.filter((a) => a.status === 'Accepted').length;
  const pendingApprovals = applications.filter((a) => a.status === 'Pending').length;
  const verifiedUsersCount = users.filter((u) => u.isVerified !== false).length;

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.city && u.city.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const isVer = u.isVerified !== false;
    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && isVer) ||
      (verificationFilter === 'unverified' && !isVer);
    return matchesSearch && matchesRole && matchesVerification;
  });

  const filteredApplications = applications.filter((app) => {
    const matchesEvent = applicationEventFilter === 'all' || app.eventId === applicationEventFilter;
    const matchesStatus = applicationStatusFilter === 'all' || app.status === applicationStatusFilter;
    const matchesSearch =
      app.crewName.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      app.crewCategory.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      (app.crewPhone && app.crewPhone.toLowerCase().includes(applicationSearch.toLowerCase()));
    return matchesEvent && matchesStatus && matchesSearch;
  });

  const handleEditCrewAsUser = (crew: CrewProfile) => {
    const existing = users.find((u) => u.id === crew.id || u.email === crew.email);
    if (existing) {
      setEditingUser(existing);
    } else {
      setEditingUser({
        id: crew.id,
        name: crew.name,
        email: crew.email,
        phone: crew.phone,
        password: 'crewpass123',
        role: 'crew',
        status: 'Active',
        city: crew.city,
        createdAt: '2026-08-20',
        isVerified: true,
        verificationBadge: `${crew.systemRating} ★ Crew Lead`,
        systemRating: crew.systemRating,
        completedEventsCount: crew.completedEventsCount,
        expectedPay: crew.expectedPay,
        categories: crew.categories,
      });
    }
  };

  const handleEditOrganiserAsUser = (org: OrganiserProfile) => {
    const existing = users.find((u) => u.id === org.id || u.email === org.email);
    if (existing) {
      setEditingUser(existing);
    } else {
      setEditingUser({
        id: org.id,
        name: org.name,
        email: org.email,
        phone: org.phone,
        password: 'organiser123',
        role: 'organiser',
        status: 'Active',
        city: org.city,
        createdAt: '2026-08-15',
        isVerified: org.hasUdyam,
        verificationBadge: 'Business Verified',
        companyName: org.companyName,
        hasUdyam: org.hasUdyam,
        udyamNumber: org.udyamNumber,
        address: org.address,
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-24 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Operator Command Banner */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-neutral-900 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-0.5 text-[11px] font-semibold text-white">
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  Superadmin Operator Active
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Full System Edit, Verify & Event Audit Transparency
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Evencify Platform Console
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-500">
                Admin: <span className="font-semibold text-neutral-800">{adminProfile.email}</span> • {adminProfile.name} • {users.length} Total Users • {verifiedUsersCount} Verified • {totalApplications} Crew Applications
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreatingUser(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add User Account</span>
              </button>
              <button
                onClick={onLogout}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Sign Out Admin
              </button>
            </div>
          </div>

          {/* KPI Dashboard Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-6 border-t border-neutral-100">
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Total Users</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900">{users.length}</div>
            </div>
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Verified Users</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-600">{verifiedUsersCount}</div>
            </div>
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Crew Profiles</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900">{totalCrew}</div>
            </div>
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Organisers</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900">{totalOrganisers}</div>
            </div>
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Live Events</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900">{activeEvents}</div>
            </div>
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Applications</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900">{totalApplications}</div>
            </div>
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Pending Review</div>
              <div className="mt-1 text-xl sm:text-2xl font-bold text-amber-600">{pendingApprovals}</div>
            </div>
          </div>
        </div>

        {/* Navigation Section Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
          {[
            { id: 'users', label: 'All Users & Credentials', icon: Users, badge: users.length },
            { id: 'crew', label: 'Crew Directory', icon: UserCheck, badge: crewList.length },
            { id: 'organisers', label: 'Organisers', icon: Building2 },
            { id: 'events', label: 'Event Moderation & Applied Crew', icon: Calendar, badge: events.length },
            { id: 'groups', label: 'Shift Coordination Groups', icon: MessageSquare, badge: eventGroups.length },
            { id: 'applications', label: 'Applications Pipeline', icon: ClipboardList, badge: applications.length },
            { id: 'overview', label: 'Audit Stream', icon: TrendingUp },
            { id: 'reports', label: 'Reports & Escrow', icon: FileText },
            { id: 'reviews', label: 'Rating Engine', icon: Star },
            { id: 'settings', label: 'Governance Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200/80'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= SECTION: ALL USERS & CREDENTIALS ================= */}
        {activeSection === 'users' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>User Account Control & Credentials Management</span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                    {filteredUsers.length} accounts
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Verify or unverify any user, edit profile ID and passcodes, switch roles, or permanently delete accounts.
                </p>
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-hidden w-48 sm:w-56"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value as any)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                >
                  <option value="all">All Roles</option>
                  <option value="crew">Crew Only</option>
                  <option value="organiser">Organisers Only</option>
                  <option value="admin">Admins Only</option>
                </select>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                >
                  <option value="all">All Verification</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>

                <button
                  onClick={() => setIsCreatingUser(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ New User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-200/80">
              <table className="w-full text-left text-xs text-neutral-800">
                <thead className="border-b border-neutral-200 bg-neutral-50/70 text-[11px] uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User ID & Profile</th>
                    <th className="px-4 py-3 font-semibold">Passcode / Pass</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">City</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Verification State</th>
                    <th className="px-4 py-3 font-semibold text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-neutral-400">
                        No users match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isVer = u.isVerified !== false;
                      const isPassVisible = !!visiblePasswords[u.id];
                      const userPass = u.password || 'pass123';

                      return (
                        <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                          {/* User ID & Profile */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-neutral-900">{u.name}</div>
                              <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                                {u.id}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                              <span>{u.email}</span>
                              {u.phone && <span>• {u.phone}</span>}
                            </div>
                          </td>

                          {/* Password / Pass Column with View Toggle */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded text-neutral-800">
                                {isPassVisible ? userPass : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(u.id)}
                                className="text-neutral-400 hover:text-neutral-700 p-1 rounded cursor-pointer"
                                title={isPassVisible ? 'Hide passcode' : 'Show passcode'}
                              >
                                {isPassVisible ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                                u.role === 'admin'
                                  ? 'bg-neutral-900 text-white'
                                  : u.role === 'organiser'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          {/* City */}
                          <td className="px-4 py-3.5 text-neutral-600 font-medium">
                            {u.city || 'Surat'}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                u.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : 'bg-red-50 text-red-700 border border-red-200/60'
                              }`}
                            >
                              {u.status === 'Active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>

                          {/* Verification Badge & Toggle Status */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-0.5">
                              {isVer ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                  <span>Verified</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                  <ShieldOff className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Unverified</span>
                                </span>
                              )}
                              <span className="text-[10px] text-neutral-500 truncate max-w-[140px]">
                                {u.verificationBadge || (isVer ? 'Verified Pro' : 'Pending')}
                              </span>
                            </div>
                          </td>

                          {/* Admin Actions */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* 1. Quick Verify / Unverify Button */}
                              {onToggleUserVerification && (
                                <button
                                  onClick={() => onToggleUserVerification(u.id)}
                                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-colors cursor-pointer ${
                                    isVer
                                      ? 'border-amber-200 bg-amber-50/80 text-amber-800 hover:bg-amber-100'
                                      : 'border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100'
                                  }`}
                                  title={isVer ? 'Click to unverify this user' : 'Click to verify this user'}
                                >
                                  {isVer ? (
                                    <>
                                      <ShieldOff className="h-3 w-3 text-amber-600" />
                                      <span>Unverify</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                      <span>Verify</span>
                                    </>
                                  )}
                                </button>
                              )}

                              {/* 2. Full Edit Button (ID, Pass, Name, Email, Role, etc.) */}
                              <button
                                onClick={() => setEditingUser(u)}
                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                                title="Edit user profile, ID, pass, and all details"
                              >
                                <Pencil className="h-3 w-3 text-neutral-600" />
                                <span>Edit</span>
                              </button>

                              {/* 3. Role Change Shortcut */}
                              <button
                                onClick={() => {
                                  setRoleChangeUser(u);
                                  setNewSelectedRole(u.role as any);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                                title="Switch Role"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span className="hidden sm:inline">Role</span>
                              </button>

                              {/* 4. Suspend / Activate Account */}
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => onToggleUserStatus(u.id)}
                                  className={`inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                                    u.status === 'Active'
                                      ? 'bg-white text-neutral-600 hover:bg-neutral-50'
                                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                                  }`}
                                  title={u.status === 'Active' ? 'Suspend account' : 'Activate account'}
                                >
                                  {u.status === 'Active' ? (
                                    <UserX className="h-3 w-3 text-neutral-500" />
                                  ) : (
                                    <UserCheck className="h-3 w-3" />
                                  )}
                                </button>
                              )}

                              {/* 5. Delete Account */}
                              {u.role !== 'admin' && onDeleteUser && (
                                <button
                                  onClick={() => setUserToDelete(u)}
                                  className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete User Permanently"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ================= SECTION: CREW DIRECTORY ================= */}
        {activeSection === 'crew' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Crew Member Directory</h3>
                <p className="text-xs text-neutral-500">
                  Total {crewList.length} crew profiles registered in the system. Edit, verify/unverify, or remove profiles.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreatingUser(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Crew Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crewList.map((crew) => {
                const userAcct = users.find((u) => u.id === crew.id || u.email === crew.email);
                const isVer = userAcct ? userAcct.isVerified !== false : true;

                return (
                  <div
                    key={crew.id}
                    className="rounded-xl border border-neutral-200/80 bg-white p-5 hover:border-neutral-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <img
                          src={crew.photoUrl}
                          alt={crew.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-xl object-cover border border-neutral-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-neutral-900 truncate">{crew.name}</h4>
                            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              <span>{crew.systemRating}</span>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {crew.phone} • {crew.city}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                              {crew.id}
                            </span>
                            {isVer ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                                <ShieldCheck className="h-3 w-3" />
                                Verified Crew
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                <ShieldOff className="h-3 w-3" />
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {crew.categories.map((c) => (
                          <span
                            key={c}
                            className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                        <span>{crew.completedEventsCount} shifts completed</span>
                        <span className="font-semibold text-neutral-900">{crew.expectedPay}</span>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      {onToggleUserVerification && (
                        <button
                          type="button"
                          onClick={() => onToggleUserVerification(crew.id)}
                          className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            isVer
                              ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {isVer ? (
                            <>
                              <ShieldOff className="h-3.5 w-3.5 text-amber-600" />
                              <span>Unverify</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Verify</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEditCrewAsUser(crew)}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-neutral-600" />
                        <span>Edit Profile</span>
                      </button>

                      {onDeleteUser && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete crew profile for "${crew.name}"?`)) {
                              onDeleteUser(crew.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Crew"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: ORGANISERS ================= */}
        {activeSection === 'organisers' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Event Organisers</h3>
                <p className="text-xs text-neutral-500">
                  Event planning agencies, corporate hosts, and companies. Verify status, edit credentials, or delete.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-neutral-900">
                      {organiserProfile.companyName}
                    </span>
                    <span className="font-mono text-xs bg-neutral-200/70 text-neutral-700 px-2 py-0.5 rounded">
                      {organiserProfile.id}
                    </span>
                    {organiserProfile.hasUdyam ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Business Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/60 flex items-center gap-1">
                        <ShieldOff className="h-3.5 w-3.5 text-amber-600" />
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Representative: <strong className="text-neutral-900">{organiserProfile.name}</strong> • {organiserProfile.email} •{' '}
                    {organiserProfile.phone}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Address: {organiserProfile.address}, {organiserProfile.city} ({organiserProfile.pincode})
                  </p>
                  {organiserProfile.udyamNumber && (
                    <p className="text-xs font-mono text-neutral-600 mt-0.5">
                      Govt MSME ID: {organiserProfile.udyamNumber}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-3 border border-neutral-200/80 text-center">
                    <div className="text-xs text-neutral-500 font-medium">Active Events</div>
                    <div className="text-xl font-bold text-neutral-900">
                      {events.filter((e) => e.status === 'Open').length}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {onToggleUserVerification && (
                      <button
                        onClick={() => onToggleUserVerification(organiserProfile.id)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          organiserProfile.hasUdyam
                            ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {organiserProfile.hasUdyam ? (
                          <>
                            <ShieldOff className="h-3.5 w-3.5 text-amber-600" />
                            <span>Unverify Company</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Verify Company</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleEditOrganiserAsUser(organiserProfile)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5 text-neutral-600" />
                      <span>Edit Organiser</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: EVENTS MODERATION & APPLIED CREW ================= */}
        {activeSection === 'events' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>Platform Event Moderation & Applied Crew Oversight</span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                    {events.length} events
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Full admin transparency: Click "View Applied Crew" on any event to inspect all applicant names, ratings, pitches, contacts, and statuses.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {events.map((evt) => {
                const eventApps = applications.filter((a) => a.eventId === evt.id);
                const acceptedApps = eventApps.filter((a) => a.status === 'Accepted').length;
                const pendingApps = eventApps.filter((a) => a.status === 'Pending').length;

                return (
                  <div
                    key={evt.id}
                    className="rounded-xl border border-neutral-200/80 bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-neutral-300 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700 uppercase">
                          {evt.eventType}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900">{evt.name}</h4>
                        <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                          {evt.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            evt.status === 'Open'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : evt.status === 'Paused'
                              ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                              : 'bg-neutral-50 text-neutral-500'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-neutral-400" />
                          {evt.date} • {evt.startTime} - {evt.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-neutral-400" />
                          {evt.venue}, {evt.city}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-neutral-900">
                          <DollarSign className="h-3 w-3 text-emerald-600" />
                          ₹{evt.payAmount.toLocaleString('en-IN')} {evt.payBasis} ({evt.paymentTimeline})
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500">
                        Host: <strong className="text-neutral-800">{evt.organiserName}</strong> • Required Role:{' '}
                        <span className="font-medium text-neutral-800">{evt.requiredCategory}</span>
                      </p>

                      {/* Applied Crew Transparency Stats Bar */}
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-neutral-700 font-semibold text-[11px] flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-neutral-600" />
                          <span>{eventApps.length} Crew Applied</span>
                        </span>
                        <span className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-2 py-1 text-emerald-800 font-semibold text-[11px]">
                          {acceptedApps} / {evt.crewPositionsTotal} Slots Filled
                        </span>
                        {pendingApps > 0 && (
                          <span className="rounded-lg bg-amber-50 border border-amber-200/60 px-2 py-1 text-amber-800 font-semibold text-[11px]">
                            {pendingApps} Pending Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Action Buttons & Inspector */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                      
                      {/* Event Coordination Group Action (Admin Only) */}
                      {(() => {
                        const eventGroup = eventGroups.find((g) => g.eventId === evt.id);
                        const isRequirementsMet =
                          acceptedApps >= evt.crewPositionsTotal || evt.crewPositionsAvailable === 0;

                        if (eventGroup) {
                          return (
                            <button
                              type="button"
                              onClick={() => onOpenGroupChat?.(eventGroup)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 px-3 py-2 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
                              title="Open Shift Coordination Chat between Organiser and Crew"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                              <span>Event Chat ({eventGroup.messages.length})</span>
                            </button>
                          );
                        }

                        if (isRequirementsMet) {
                          return (
                            <button
                              type="button"
                              onClick={() => onCreateEventGroup?.(evt.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 text-white px-3 py-2 text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
                              title="Admin Exclusive Action: 100% crew hired! Click to create official coordination group for this event"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-emerald-200" />
                              <span>Create Event Group</span>
                            </button>
                          );
                        }

                        return null;
                      })()}

                      {/* 1. Primary Highlight: View Applied Crew Transparency Modal */}
                      <button
                        onClick={() => setInspectingEventForApplicants(evt)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                        title="View all applied crew, notes, contacts, and ratings for this event"
                      >
                        <Users className="h-3.5 w-3.5 text-amber-400" />
                        <span>View Applied Crew ({eventApps.length})</span>
                      </button>

                      {/* Pause / Activate Button */}
                      {evt.status === 'Open' ? (
                        <button
                          onClick={() => onUpdateEventStatus(evt.id, 'Paused')}
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateEventStatus(evt.id, 'Open')}
                          className="rounded-xl bg-neutral-800 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                        >
                          Activate
                        </button>
                      )}

                      {/* Edit Event Button */}
                      <button
                        onClick={() => setEditingEvent(evt)}
                        className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-neutral-600" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Event Button */}
                      {onDeleteEvent && (
                        <button
                          onClick={() => {
                            if (confirm(`Permanently delete event "${evt.name}" (${evt.id})?`)) {
                              onDeleteEvent(evt.id);
                            }
                          }}
                          className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: APPLICATIONS PIPELINE ================= */}
        {activeSection === 'applications' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <span>Application Pipeline & Transparency Stream</span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                    {filteredApplications.length} of {applications.length} applications
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Inspect every crew application across events: filter by specific event, review candidate pitch notes, update decision status, or remove entries.
                </p>
              </div>

              {/* Event Filter, Status Filter & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Event Selector Dropdown */}
                <select
                  value={applicationEventFilter}
                  onChange={(e) => setApplicationEventFilter(e.target.value)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-400 focus:outline-hidden max-w-[220px] truncate"
                  title="Filter applications by event"
                >
                  <option value="all">All Events ({applications.length})</option>
                  {events.map((evt) => {
                    const count = applications.filter((a) => a.eventId === evt.id).length;
                    return (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} ({count})
                      </option>
                    );
                  })}
                </select>

                {/* Status Filter Dropdown */}
                <select
                  value={applicationStatusFilter}
                  onChange={(e) => setApplicationStatusFilter(e.target.value)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search candidate or phone..."
                    value={applicationSearch}
                    onChange={(e) => setApplicationSearch(e.target.value)}
                    className="rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-400 focus:outline-hidden w-44"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-neutral-50/50 border border-neutral-200/60">
                  <ClipboardList className="mx-auto h-8 w-8 text-neutral-300" />
                  <div className="mt-2 text-xs font-semibold text-neutral-700">No applications match your filter</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Try resetting the event or status filters above.</p>
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const associatedEvent = events.find((e) => e.id === app.eventId);
                  const crewDetail = crewList.find((c) => c.id === app.crewId);

                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-neutral-200/80 bg-white p-4.5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-neutral-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <img
                          src={app.crewPhoto}
                          alt={app.crewName}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          
                          {/* Candidate Header */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900">{app.crewName}</span>
                            <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                              {app.crewId}
                            </span>
                            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span>{app.systemRating}</span>
                            </span>
                            <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                              {app.crewCategory}
                            </span>
                          </div>

                          {/* Contact & Location */}
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-neutral-400" />
                              {app.crewPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-neutral-400" />
                              {app.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3 text-neutral-400" />
                              {app.experienceYears} Years Exp
                            </span>
                            <span className="flex items-center gap-1 text-neutral-400">
                              <Clock className="h-3 w-3" />
                              Applied {app.appliedAt}
                            </span>
                          </div>

                          {/* Applied Event Reference Banner */}
                          {associatedEvent && (
                            <div className="mt-2.5 rounded-lg bg-neutral-50 p-2.5 border border-neutral-200/60 flex flex-wrap items-center justify-between gap-2">
                              <div className="text-xs">
                                <span className="text-neutral-500">Applied for: </span>
                                <strong className="text-neutral-900 font-semibold">{associatedEvent.name}</strong>
                                <span className="text-neutral-500"> ({associatedEvent.date} • {associatedEvent.venue})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setInspectingEventForApplicants(associatedEvent)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-800 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                              >
                                <Users className="h-3 w-3 text-amber-500" />
                                <span>Inspect Full Event Pool</span>
                              </button>
                            </div>
                          )}

                          {/* Applicant Pitch Note */}
                          {app.note && (
                            <div className="mt-2 text-xs text-neutral-700 bg-neutral-50/50 rounded-md p-2 border border-neutral-100 italic">
                              "{app.note}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Controls: Decision Status & Actions */}
                      <div className="flex md:flex-col items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            app.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'Shortlisted'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : app.status === 'Rejected'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-semibold text-neutral-400 hidden sm:block">Decision:</label>
                          <select
                            value={app.status}
                            onChange={(e) => onUpdateApplicationStatus(app.id, e.target.value as any)}
                            className="text-xs font-semibold rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-900 focus:outline-hidden cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          {crewDetail && onViewCrewProfile && (
                            <button
                              type="button"
                              onClick={() => onViewCrewProfile(crewDetail)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Profile</span>
                            </button>
                          )}

                          {onDeleteApplication && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove application from ${app.crewName}?`)) {
                                onDeleteApplication(app.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION: SHIFT COORDINATION GROUPS (ADMIN ONLY) ================= */}
        {activeSection === 'groups' && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      Event Shift Coordination Groups
                    </h3>
                    <span className="rounded-full bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5">
                      Admin Supervised
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                    Dedicated shift communication groups connecting strictly the event's organiser and accepted crew members. Provisioned exclusively by Platform Administrators once crew staffing requirements are fulfilled.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700">
                    {eventGroups.length} Active Groups
                  </span>
                </div>
              </div>

              {/* Ready to Provision Banner */}
              {(() => {
                const readyEvents = events.filter((e) => {
                  const hasGroup = eventGroups.some((g) => g.eventId === e.id);
                  if (hasGroup) return false;
                  const accepted = applications.filter(
                    (a) => a.eventId === e.id && a.status === 'Accepted'
                  ).length;
                  return accepted >= e.crewPositionsTotal || e.crewPositionsAvailable === 0;
                });

                if (readyEvents.length === 0) return null;

                return (
                  <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-950 mb-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>{readyEvents.length} Event(s) Ready for Group Provisioning</span>
                    </div>
                    <p className="text-xs text-emerald-800 mb-3">
                      The following events have filled 100% of their crew requirements. As an Administrator, you can provision the official coordination group for each:
                    </p>
                    <div className="space-y-2">
                      {readyEvents.map((re) => {
                        const accepted = applications.filter(
                          (a) => a.eventId === re.id && a.status === 'Accepted'
                        ).length;
                        return (
                          <div
                            key={re.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-white p-3 border border-emerald-200"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-neutral-900 truncate">
                                {re.name}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                Host: {re.organiserName} • Requirement: {accepted} / {re.crewPositionsTotal} Crew Accepted
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onCreateEventGroup?.(re.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer shadow-xs"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-emerald-200" />
                              <span>Create Event Group Now</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Groups List */}
              <div className="mt-6 space-y-4">
                <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Active Coordination Groups ({eventGroups.length})
                </div>

                {eventGroups.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border border-dashed border-neutral-200 text-neutral-400 text-xs">
                    No active event coordination groups yet. When an event reaches 100% crew fulfillment, Admin can provision a group here or from Event Moderation.
                  </div>
                ) : (
                  eventGroups.map((group) => {
                    const lastMessage = group.messages[group.messages.length - 1];

                    return (
                      <div
                        key={group.id}
                        className="rounded-xl border border-neutral-200/90 bg-white p-5 hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5">
                                Shift Group
                              </span>
                              <h4 className="text-sm font-bold text-neutral-900">{group.eventName}</h4>
                              <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {group.eventId}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-600">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3 text-neutral-400" />
                                Host: <strong className="text-neutral-800">{group.organiserName}</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-neutral-400" />
                                {group.eventDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-neutral-400" />
                                {group.eventVenue}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenGroupChat?.(group)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer shadow-xs"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                            <span>Open Coordination Chat</span>
                            <span className="rounded-full bg-neutral-700 px-1.5 py-0.2 text-[10px]">
                              {group.messages.length}
                            </span>
                          </button>
                        </div>

                        {/* Members Bar */}
                        <div className="mt-4 pt-3 border-t border-neutral-100">
                          <div className="text-[11px] font-semibold text-neutral-500 mb-2">
                            Restricted Members ({group.crewMembers.length + 1} total):
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {/* Organiser Pill */}
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 border border-purple-200/80 px-2.5 py-1 text-xs text-purple-900 font-medium">
                              <Building2 className="h-3 w-3 text-purple-700" />
                              <span>{group.organiserName}</span>
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                                Organiser
                              </span>
                            </span>

                            {/* Accepted Crew Members */}
                            {group.crewMembers.map((member) => (
                              <span
                                key={member.crewId}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-50 border border-neutral-200 px-2.5 py-1 text-xs text-neutral-800"
                              >
                                {member.crewPhoto ? (
                                  <img
                                    src={member.crewPhoto}
                                    alt={member.crewName}
                                    referrerPolicy="no-referrer"
                                    className="h-4 w-4 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-4 w-4 rounded-full bg-neutral-200 flex items-center justify-center text-[9px] font-bold">
                                    {member.crewName.charAt(0)}
                                  </div>
                                )}
                                <span className="font-semibold">{member.crewName}</span>
                                <span className="text-[10px] text-neutral-500">
                                  ({member.crewCategory})
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Last message preview */}
                        {lastMessage && (
                          <div className="mt-3 rounded-lg bg-neutral-50/80 p-2.5 text-xs text-neutral-600 flex items-center justify-between gap-2 border border-neutral-200/60">
                            <div className="truncate">
                              <span className="font-semibold text-neutral-900">{lastMessage.senderName}: </span>
                              <span>{lastMessage.content}</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 shrink-0">
                              {lastMessage.timestamp}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: AUDIT STREAM (OVERVIEW) ================= */}
        {activeSection === 'overview' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
                <h3 className="text-base font-bold text-neutral-900">Real-Time Platform Audit Stream</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Chronological event log of user verifications, shifts, and credentials updates.
                </p>

                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-neutral-700">
                        Admin credential override and verification active across <strong className="text-neutral-900">{users.length} user records</strong>
                      </span>
                    </div>
                    <span className="text-neutral-400 font-medium">Live</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-neutral-700">
                        Business verification successfully matched for <strong className="text-neutral-900">Singhania Events & Media Ltd.</strong>
                      </span>
                    </div>
                    <span className="text-neutral-400 font-medium">2h ago</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-neutral-700">
                        System rating recalculation completed across 3,840 crew records
                      </span>
                    </div>
                    <span className="text-neutral-400 font-medium">5h ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
                <h4 className="text-sm font-bold text-neutral-900">Quick Administrator Shortcuts</h4>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setActiveSection('users');
                      setVerificationFilter('unverified');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>Review Unverified Users</span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setIsCreatingUser(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>Provision New Account</span>
                    <Plus className="h-4 w-4 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setActiveSection('events')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                  >
                    <span>Moderate Live Events</span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: REPORTS ================= */}
        {activeSection === 'reports' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900">Platform Reports & Audit Logs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4">
                <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Punctuality Score</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">98.4%</div>
                <div className="text-xs text-neutral-500 mt-1">Across 150+ completed shifts</div>
              </div>
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4">
                <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Shift Settlement Rate</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">100%</div>
                <div className="text-xs text-neutral-500 mt-1">Direct same-day bank transfers</div>
              </div>
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4">
                <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Dispute Frequency</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1">0.2%</div>
                <div className="text-xs text-neutral-500 mt-1">Resolved within 2 hours</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: REVIEWS ================= */}
        {activeSection === 'reviews' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900">System Rating & Review Engine</h3>
            <p className="text-xs text-neutral-500">
              Ratings are mathematically aggregated from shift attendance, punctuality, and post-event organiser evaluations.
            </p>
            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero Manual Ratings Policy Enforced</span>
              </div>
              <p className="text-xs text-neutral-600">
                Crew members cannot manually edit or self-rate their score. Every point adjustment requires a completed shift verified by the event organiser.
              </p>
            </div>
          </div>
        )}

        {/* ================= SECTION: SETTINGS ================= */}
        {activeSection === 'settings' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900">Admin Platform Settings</h3>
            <div className="space-y-3 text-xs text-neutral-700">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
                <div>
                  <div className="font-semibold text-neutral-900">Enforce Verification for High-Budget Events</div>
                  <div className="text-neutral-500">Require business identity verification for events above ₹25,000 crew budget</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-neutral-900 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
                <div>
                  <div className="font-semibold text-neutral-900">Automated Escrow Milestone Notifications</div>
                  <div className="text-neutral-500">Dispatch instant SMS & WhatsApp alerts to crew upon shift completion</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-neutral-900 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Event Applicants Transparency Inspector Modal */}
      {inspectingEventForApplicants && (
        <AdminEventApplicantsModal
          isOpen={!!inspectingEventForApplicants}
          onClose={() => setInspectingEventForApplicants(null)}
          event={inspectingEventForApplicants}
          applications={applications}
          crewList={crewList}
          eventGroups={eventGroups}
          onCreateEventGroup={onCreateEventGroup}
          onOpenGroupChat={onOpenGroupChat}
          onUpdateApplicationStatus={onUpdateApplicationStatus}
          onDeleteApplication={onDeleteApplication}
          onViewCrewProfile={onViewCrewProfile}
        />
      )}

      {/* 2. Edit User Modal */}
      {editingUser && (
        <AdminUserEditModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          isNew={false}
          onSave={(origId, updated) => {
            onUpdateUser?.(origId, updated);
            setEditingUser(null);
          }}
          onDelete={(userId) => {
            onDeleteUser?.(userId);
            setEditingUser(null);
          }}
        />
      )}

      {/* 3. Create User Modal */}
      {isCreatingUser && (
        <AdminUserEditModal
          isOpen={isCreatingUser}
          onClose={() => setIsCreatingUser(false)}
          user={null}
          isNew={true}
          onSave={(origId, newUser) => {
            onCreateUser?.(newUser);
            setIsCreatingUser(false);
          }}
        />
      )}

      {/* 4. Edit Event Modal */}
      {editingEvent && (
        <AdminEventEditModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          event={editingEvent}
          onSave={(updatedEvt) => {
            onEditEvent?.(updatedEvt);
            setEditingEvent(null);
          }}
          onDelete={(evtId) => {
            onDeleteEvent?.(evtId);
            setEditingEvent(null);
          }}
        />
      )}

      {/* 5. Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-base font-bold text-neutral-900">Delete User Account</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Are you sure you want to permanently delete the account for <strong className="text-neutral-800">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDeleteUser?.(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Role Change Confirmation Modal */}
      {roleChangeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-neutral-800" />
              <h3 className="text-base font-bold text-neutral-900">Change User Role</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Modify permissions and platform access for <strong className="text-neutral-800">{roleChangeUser.name}</strong> ({roleChangeUser.email}).
            </p>

            <div className="mb-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Current Role:</span>
                <span className="rounded-full bg-neutral-200/80 px-2.5 py-0.5 font-semibold uppercase text-[10px] text-neutral-700">
                  {roleChangeUser.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Target Role:</span>
                <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 font-semibold uppercase text-[10px] text-white">
                  {newSelectedRole}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Select New System Role
              </label>
              <select
                value={newSelectedRole}
                onChange={(e) => setNewSelectedRole(e.target.value as any)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-neutral-400"
              >
                <option value="crew">Crew Member (Job Seeker / Event Staff)</option>
                <option value="organiser">Event Organiser (Job Poster / Company)</option>
                <option value="admin">Platform Administrator (Full Access)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onUpdateUserRole?.(roleChangeUser.id, newSelectedRole);
                  setRoleChangeUser(null);
                }}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Confirm Role Change
              </button>
              <button
                onClick={() => setRoleChangeUser(null)}
                className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
