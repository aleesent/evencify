export type UserRole = 'visitor' | 'crew' | 'organiser' | 'admin';

export type CrewCategory =
  | 'Event Helper'
  | 'Registration Desk'
  | 'Security'
  | 'Support'
  | 'Hospitality Staff'
  | 'Promoter'
  | 'Setup / Teardown'
  | 'Waiter / Service Staff'
  | 'Other';

export const CREW_CATEGORIES: CrewCategory[] = [
  'Event Helper',
  'Registration Desk',
  'Security',
  'Support',
  'Hospitality Staff',
  'Promoter',
  'Setup / Teardown',
  'Waiter / Service Staff',
  'Other',
];

export type EventType =
  | 'Wedding'
  | 'Corporate'
  | 'Concert'
  | 'Exhibition'
  | 'College Event'
  | 'Festival'
  | 'Sports Event'
  | 'Other Event';

export const EVENT_TYPES: EventType[] = [
  'Wedding',
  'Corporate',
  'Concert',
  'Exhibition',
  'College Event',
  'Festival',
  'Sports Event',
  'Other Event',
];

export interface CrewProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  experienceYears: number;
  experienceLevel: 'Fresher' | 'Experienced' | 'Veteran';
  categories: CrewCategory[];
  age: number;
  gender?: 'Male' | 'Female' | 'Other';
  address: string;
  pinCode?: string;
  pincode?: string;
  city: string;
  photoUrl: string;
  systemRating: number; // system-generated from reviews/history, never manually entered
  reviewsCount?: number;
  completedEventsCount: number;
  availability?: string;
  expectedPay?: string;
  bio?: string;
  profileCompletionPercentage?: number;
}

export interface OrganiserProfile {
  id: string;
  name: string;
  companyName: string;
  hasUdyam: boolean;
  udyamNumber?: string;
  address: string;
  pinCode?: string;
  pincode?: string;
  city: string;
  email: string;
  phone: string;
  activeEventsCount?: number;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  lastLogin?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'crew' | 'organiser' | 'admin';
  status: 'Active' | 'Suspended';
  city?: string;
  createdAt: string;
  verificationBadge?: string;
  isVerified?: boolean;
  companyName?: string;
  systemRating?: number;
  completedEventsCount?: number;
  expectedPay?: string;
  categories?: CrewCategory[];
  hasUdyam?: boolean;
  udyamNumber?: string;
  address?: string;
}

export type EventStatus =
  | 'published'
  | 'draft'
  | 'paused'
  | 'closed'
  | 'completed'
  | 'cancelled'
  | 'Open';

export interface EventCrewRequirement {
  id: string;
  eventId: string;
  category: CrewCategory;
  numberRequired: number;
  genderRequirement: 'Male' | 'Female' | 'Any';
  minAge?: number;
  maxAge?: number;
  experienceRequirement: 'Fresher' | 'Experienced' | 'Both';
  dressCode?: string;
  specialRequirements?: string;
  payAmount: number;
  payBasis: 'Per Day' | 'Per Hour' | 'Per Shift';
  paymentMethod?: string;
  paymentTimeline: 'Same Day' | 'Within 24 Hours' | 'Within 3 Days' | string;
  advanceRequired?: boolean;
  advanceAmount?: number;
}

export interface EventItem {
  id: string;
  name: string;
  eventType: EventType;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  fullAddress?: string;
  city: string;
  expectedAttendance?: number;
  organiserId: string;
  organiserName: string;
  crewPositionsTotal: number;
  crewPositionsAvailable: number;
  requiredCategory: CrewCategory;
  genderRequirement: 'Male' | 'Female' | 'Any';
  ageRequirement?: string;
  experienceRequirement: 'Fresher' | 'Experienced' | 'Both';
  dressCode?: string;
  specialRequirements?: string;
  payAmount: number;
  payBasis: 'Per Day' | 'Per Hour' | 'Per Shift';
  paymentMethod?: string;
  paymentTimeline: 'Same Day' | 'Within 24 Hours' | 'Within 3 Days' | string;
  advanceRequired?: boolean;
  createdAt: string;
  status: EventStatus;
  requirements?: EventCrewRequirement[];
}

export interface CrewApplication {
  id: string;
  eventId: string;
  eventName?: string;
  eventDate?: string;
  crewId: string;
  crewName: string;
  crewEmail?: string;
  crewPhoto: string;
  crewPhone: string;
  crewCategory: CrewCategory;
  experienceYears: number;
  systemRating: number;
  city: string;
  status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  appliedAt: string;
  note?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'application' | 'system' | 'event' | 'payment';
  read: boolean;
}

export interface EventChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'organiser' | 'crew';
  senderPhoto?: string;
  content: string;
  timestamp: string;
  isAnnouncement?: boolean;
}

export interface EventCoordinationGroup {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  organiserId: string;
  organiserName: string;
  organiserPhone?: string;
  crewMembers: {
    crewId: string;
    crewName: string;
    crewPhoto?: string;
    crewCategory: string;
    phone?: string;
  }[];
  createdByAdminId: string;
  createdAt: string;
  status: 'active' | 'archived';
  messages: EventChatMessage[];
}

export type Application = CrewApplication;
export type EventListing = EventItem;

