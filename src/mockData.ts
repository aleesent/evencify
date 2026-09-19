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

export const INITIAL_CREW_PROFILES: CrewProfile[] = [
  {
    id: 'crew-1',
    name: 'Sneha Verma',
    phone: '+91 98251 44321',
    email: 'sneha.verma@example.com',
    experienceYears: 3,
    experienceLevel: 'Experienced',
    categories: ['Hospitality Staff', 'Registration Desk'],
    age: 23,
    gender: 'Female',
    address: '402, Riverfront Enclave, Vesu',
    pincode: '395007',
    city: 'Surat',
    photoUrl: '',
    systemRating: 0,
    reviewsCount: 0,
    completedEventsCount: 0,
    availability: 'Available for Upcoming Shifts',
    expectedPay: '₹1,500 / shift',
    bio: 'Experienced in VIP hospitality, guest registration desks, and crowd facilitation for luxury weddings and corporate summits.',
    profileCompletionPercentage: 95,
  },
];

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
  age: 18,
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
  id: 'org-1',
  name: 'Rajesh Singhania',
  companyName: 'Singhania Events & Media Ltd.',
  hasUdyam: true,
  udyamNumber: 'UDYAM-GJ-24-0098412',
  address: '601, World Trade Center, Ring Road',
  pincode: '395002',
  city: 'Surat',
  email: 'rajesh@singhaniaevents.com',
  phone: '+91 98251 10022',
  activeEventsCount: 0,
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
    id: 'usr-1',
    name: 'Rajesh Singhania',
    email: 'rajesh@singhaniaevents.com',
    password: 'organiser123',
    phone: '+91 98251 10022',
    role: 'organiser',
    status: 'Active',
    city: 'Surat',
    createdAt: '2026-09-01',
    verificationBadge: 'Business Verified',
    isVerified: true,
    companyName: 'Singhania Events & Media Ltd.',
    hasUdyam: true,
    udyamNumber: 'UDYAM-GJ-24-0098412',
    address: '601, World Trade Center, Ring Road',
  },
  {
    id: 'usr-2',
    name: 'Sneha Verma',
    email: 'sneha.verma@example.com',
    password: 'crewpass123',
    phone: '+91 98251 44321',
    role: 'crew',
    status: 'Active',
    city: 'Surat',
    createdAt: '2026-09-01',
    verificationBadge: 'Verified Crew Member',
    isVerified: true,
    systemRating: 0,
    completedEventsCount: 0,
    expectedPay: '₹1,500 / shift',
    categories: ['Hospitality Staff', 'Registration Desk'],
  },
  {
    id: 'usr-admin',
    name: 'Evencify Operations Admin',
    email: 'admin@evencify.com',
    password: 'admin123',
    phone: '+91 98000 00001',
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
