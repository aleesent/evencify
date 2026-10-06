import { CrewProfile, OrganiserProfile, UserRole, isCrewProfileComplete, isOrganiserProfileComplete } from '../types';

const ONBOARDING_STORAGE_PREFIX = 'evencify_onboarding_completed_';

/**
 * Checks whether a user has already completed onboarding.
 *
 * Rules:
 * 1. If persistent storage has recorded onboarding as completed for this email, return true.
 * 2. If the user's role profile already has complete details (verified pro / established organiser), return true.
 * 3. Seed demo accounts (Admin, Singhania, Rohan, Sneha) are pre-onboarded, return true.
 */
export function hasUserCompletedOnboarding(
  email?: string | null,
  role?: UserRole | null,
  profile?: Partial<CrewProfile | OrganiserProfile> | null
): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check local storage persistent marker
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${ONBOARDING_STORAGE_PREFIX}${cleanEmail}`);
      if (stored === 'true') {
        return true;
      }
    } catch {
      // ignore storage access errors
    }
  }

  // 2. Pre-seeded platform and demo accounts are already fully set up
  const PRE_ONBOARDED_EMAILS = [
    'admin@evencify.com',
    'singhania.events@gmail.com',
    'rohan.events@gmail.com',
    'sneha.verma@gmail.com',
  ];
  if (PRE_ONBOARDED_EMAILS.includes(cleanEmail)) {
    return true;
  }

  // 3. Check profile completeness in domain data
  if (role === 'crew' && profile && isCrewProfileComplete(profile as Partial<CrewProfile>)) {
    return true;
  }
  if (role === 'organiser' && profile && isOrganiserProfileComplete(profile as Partial<OrganiserProfile>)) {
    return true;
  }

  return false;
}

/**
 * Marks onboarding as completed for the specified user email in persistent storage.
 */
export function markUserOnboardingCompleted(email?: string | null): void {
  if (!email || typeof window === 'undefined') return;
  const cleanEmail = email.trim().toLowerCase();
  try {
    localStorage.setItem(`${ONBOARDING_STORAGE_PREFIX}${cleanEmail}`, 'true');
  } catch (err) {
    console.warn('Unable to persist onboarding status:', err);
  }
}
