/**
 * Shared mobile number validation & normalization helpers.
 * Enforces compulsory mobile number collection across signup, onboarding,
 * admin provisioning, contact inquiries, and existing account verification.
 */

export function normalizeMobileNumber(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';

  // Keep leading '+' if present, collapse multiple spaces/dashes
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  // Format standard 10-digit Indian mobile numbers cleanly as +91 XXXXX XXXXX
  if (!hasPlus && digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Format 12-digit +91 numbers cleanly
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  return trimmed.replace(/\s+/g, ' ');
}

export function isValidMobileNumber(input?: string | null): boolean {
  if (!input) return false;
  const digits = input.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return false;
  // Reject obvious fake placeholders like 0000000000
  if (/^0+$/.test(digits)) return false;
  return true;
}

export function getMobileValidationError(input?: string | null): string | null {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return 'Mobile number is compulsory. Please enter your active mobile number.';
  }
  if (!isValidMobileNumber(trimmed)) {
    return 'Please enter a valid mobile number (at least 10 digits, e.g. +91 98765 43210).';
  }
  return null;
}
