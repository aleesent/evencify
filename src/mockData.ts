import {
  CrewProfile,
  OrganiserProfile,
  AdminProfile,
  UserAccount,
  EventItem,
  CrewApplication,
  AppNotification,
  CREW_CATEGORIES,
  EVENT_TYPES,
  EventCoordinationGroup,
} from './types';

export { CREW_CATEGORIES, EVENT_TYPES };

export const INITIAL_CREW_PROFILES: CrewProfile[] = [];

export const INITIAL_EVENTS: EventItem[] = [];

export const INITIAL_APPLICATIONS: CrewApplication[] = [];

export const EMPTY_CREW_PROFILE: CrewProfile = {
  id: '',
  name: '',
  phone: '',
  email: '',
  experienceYears: 0,
  experienceLevel: 'Fresher',
  categories: [],
  age: 0,
  gender: 'Male',
  address: '',
  pincode: '',
  city: '',
  photoUrl: '',
  systemRating: 0,
  reviewsCount: 0,
  completedEventsCount: 0,
  availability: 'Available',
  expectedPay: '',
  bio: '',
  profileCompletionPercentage: 0,
};

export const EMPTY_ORGANISER_PROFILE: OrganiserProfile = {
  id: '',
  name: '',
  companyName: '',
  hasUdyam: false,
  udyamNumber: '',
  address: '',
  pincode: '',
  city: '',
  email: '',
  phone: '',
  photoUrl: '',
  activeEventsCount: 0,
};

export const INITIAL_ORGANISER_PROFILE: OrganiserProfile = {
  ...EMPTY_ORGANISER_PROFILE,
};

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
  id: 'adm-1',
  name: 'Evencify Operations Admin',
  email: 'admin@evencify.com',
  role: 'admin',
  lastLogin: 'Today, 11:30 AM',
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin',
    name: 'Evencify Operations Admin',
    email: 'admin@evencify.com',
    password: 'admin123',
    phone: '',
    role: 'admin',
    status: 'Active',
    city: 'Bengaluru',
    createdAt: '2026-08-01',
    verificationBadge: 'Platform Superadmin',
    isVerified: true,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_EVENT_GROUPS: EventCoordinationGroup[] = [];
