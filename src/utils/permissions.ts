import { EventItem, CrewApplication, OrganiserProfile, UserRole } from '../types';

/**
 * Validates whether the active user owns the given event or has administrative authority over it.
 *
 * Rules:
 * 1. Admin role ('admin') has universal permissions across all events and actions.
 * 2. Only the specific Organizer who created the event ('organiser') owns and can manage it.
 * 3. Other Organizers CANNOT edit, delete, pause, complete, or manage events belonging to another Organizer.
 * 4. Crew members and unauthenticated visitors cannot edit, delete, or manage events.
 */
export function checkEventOwnership(
  event: EventItem,
  role: UserRole,
  organiserProfile?: Partial<OrganiserProfile> | null,
  userEmail?: string
): boolean {
  if (!event) return false;

  // 1. Admin has platform-wide authority
  if (role === 'admin') {
    return true;
  }

  // 2. Non-organisers can never manage events
  if (role !== 'organiser') {
    return false;
  }

  const currentEmail = (userEmail || organiserProfile?.email || '').trim().toLowerCase();
  const currentOrgId = (organiserProfile?.id || '').trim().toLowerCase();
  const currentCompanyName = (organiserProfile?.companyName || organiserProfile?.name || '').trim().toLowerCase();

  const eventOrgId = (event.organiserId || '').trim().toLowerCase();
  const eventEmail = (event.organiserEmail || '').trim().toLowerCase();
  const eventOrgName = (event.organiserName || '').trim().toLowerCase();

  // Primary Check: Direct ID match
  if (currentOrgId && eventOrgId && currentOrgId === eventOrgId) {
    return true;
  }

  // Secondary Check: Email match
  if (currentEmail && eventEmail && currentEmail === eventEmail) {
    return true;
  }

  // Fallback Check: Organiser ID stored as user's email
  if (currentEmail && eventOrgId && (currentEmail === eventOrgId || eventOrgId.includes(currentEmail))) {
    return true;
  }

  // Fallback Check: Exact Company/Organizer Name match
  if (
    currentCompanyName &&
    eventOrgName &&
    currentCompanyName.length >= 3 &&
    currentCompanyName === eventOrgName
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if the user is authorized to edit the event.
 */
export function canEditEvent(
  event: EventItem,
  role: UserRole,
  organiserProfile?: Partial<OrganiserProfile> | null,
  userEmail?: string
): boolean {
  return checkEventOwnership(event, role, organiserProfile, userEmail);
}

/**
 * Checks if the user is authorized to delete the event.
 */
export function canDeleteEvent(
  event: EventItem,
  role: UserRole,
  organiserProfile?: Partial<OrganiserProfile> | null,
  userEmail?: string
): boolean {
  return checkEventOwnership(event, role, organiserProfile, userEmail);
}

/**
 * Checks if the user is authorized to change the status (Pause, Resume, Close) of the event.
 */
export function canManageEventStatus(
  event: EventItem,
  role: UserRole,
  organiserProfile?: Partial<OrganiserProfile> | null,
  userEmail?: string
): boolean {
  return checkEventOwnership(event, role, organiserProfile, userEmail);
}

/**
 * Checks if the user is authorized to review, shortlist, hire, or reject applicants for an event.
 */
export function canManageApplication(
  application: CrewApplication,
  event: EventItem | undefined,
  role: UserRole,
  organiserProfile?: Partial<OrganiserProfile> | null,
  userEmail?: string
): boolean {
  if (role === 'admin') return true;
  if (role !== 'organiser') return false;
  if (!event) return false;
  return checkEventOwnership(event, role, organiserProfile, userEmail);
}

/**
 * Checks if the user is authorized to complete the event and submit crew performance ratings.
 */
export function canCompleteAndRateEvent(
  event: EventItem,
  role: UserRole,
  organiserProfile?: Partial<OrganiserProfile> | null,
  userEmail?: string
): boolean {
  return checkEventOwnership(event, role, organiserProfile, userEmail);
}

/**
 * Checks if the user is authorized to create a new event.
 */
export function canCreateEvent(role: UserRole): boolean {
  return role === 'admin' || role === 'organiser';
}

/**
 * Checks if the user is authorized to apply for crew opportunities.
 */
export function canApplyForEvent(role: UserRole): boolean {
  return role === 'crew';
}
