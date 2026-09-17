/**
 * Brevo SMTP & Email Verification Client Service
 * Communicates with backend endpoints (/api/auth/*, /api/brevo/*)
 */

export interface SendVerificationResult {
  success: boolean;
  message?: string;
  error?: string;
  simulated?: boolean;
  previewCode?: string;
  deliveryMethod?: string;
  expiresAt?: number;
}

export interface VerifyCodeResult {
  success: boolean;
  verified: boolean;
  message?: string;
  error?: string;
  userData?: {
    email: string;
    name?: string;
    role?: 'crew' | 'organiser';
    purpose?: string;
  };
}

export interface BrevoStatus {
  configured: boolean;
  isSmtpConfigured: boolean;
  isApiConfigured: boolean;
  host: string;
  port: number;
  user: string | null;
  senderEmail: string;
  senderName: string;
  provider: string;
  defaultHost: string;
  defaultPort: number;
}

export const BrevoClient = {
  /**
   * Request a 6-digit email verification code via Brevo SMTP relay
   */
  async sendVerificationCode(params: {
    email: string;
    name?: string;
    role?: 'crew' | 'organiser';
    purpose?: 'signup' | 'verify-email' | 'reset-password';
  }): Promise<SendVerificationResult> {
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send verification code via Brevo.',
        };
      }
      return data;
    } catch (err: any) {
      console.warn('Network error requesting Brevo verification code:', err);
      return {
        success: false,
        error: err.message || 'Network connection error. Please try again.',
      };
    }
  },

  /**
   * Verify the 6-digit OTP code entered by the user
   */
  async verifyCode(email: string, code: string): Promise<VerifyCodeResult> {
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          verified: false,
          error: data.error || 'Invalid or expired verification code.',
        };
      }
      return data;
    } catch (err: any) {
      console.warn('Network error verifying code:', err);
      return {
        success: false,
        verified: false,
        error: err.message || 'Verification network error. Please try again.',
      };
    }
  },

  /**
   * Send password reset OTP code via Brevo SMTP
   */
  async sendPasswordResetCode(email: string): Promise<SendVerificationResult> {
    try {
      const res = await fetch('/api/auth/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send reset code.',
        };
      }
      return data;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network connection error. Please try again.',
      };
    }
  },

  /**
   * Check Brevo connection status from the backend
   */
  async getStatus(): Promise<BrevoStatus | null> {
    try {
      const res = await fetch('/api/brevo/status');
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Failed to fetch Brevo status:', err);
      return null;
    }
  },

  /**
   * Test Brevo SMTP relay connection and optionally dispatch a test email
   */
  async testConnection(testEmail?: string, customConfig?: any): Promise<any> {
    try {
      const res = await fetch('/api/brevo/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail, customConfig }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Connection test failed.',
      };
    }
  },
};
