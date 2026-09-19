import { Router } from 'express';
import {
  sendVerificationEmail,
  verifyOtpCode,
  testBrevoConnection,
  getBrevoConfig,
} from './brevoService.js';

export const apiRouter = Router();

// Ensure request & response helper compatibility across Express, Vite, and Connect
apiRouter.use((req, res, next) => {
  if (typeof req.get !== 'function') {
    req.get = function (headerName) {
      if (!headerName || !this.headers) return undefined;
      const lc = headerName.toLowerCase();
      if (lc === 'referer' || lc === 'referrer') {
        return this.headers['referrer'] || this.headers['referer'];
      }
      return this.headers[lc];
    };
  }
  if (!req.protocol) {
    const proto = (typeof req.get === 'function' ? req.get('x-forwarded-proto') : req.headers?.['x-forwarded-proto']);
    req.protocol = proto === 'https' ? 'https' : 'http';
  }
  if (!res.status) {
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function (data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
      return this;
    };
  }
  next();
});

// Helper for safe header resolution
const getReqHeader = (req, headerName) => {
  if (typeof req?.get === 'function') {
    try {
      return req.get(headerName);
    } catch (_) {}
  }
  if (req?.headers && typeof req.headers === 'object') {
    const lc = headerName.toLowerCase();
    if (lc === 'referer' || lc === 'referrer') {
      return req.headers['referrer'] || req.headers['referer'];
    }
    return req.headers[lc];
  }
  return undefined;
};

// 1. Send Email Verification Code via Brevo
apiRouter.post('/auth/send-verification', async (req, res) => {
  try {
    const { email, name, role, purpose } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const host = getReqHeader(req, 'host') || 'localhost:3000';
    const protoHeader = getReqHeader(req, 'x-forwarded-proto');
    const protocol = req.protocol === 'https' || protoHeader === 'https' ? 'https' : 'http';
    const origin = getReqHeader(req, 'origin') || `${protocol}://${host}`;

    console.log(`[Brevo Auth] Dispatching OTP request for: ${email} (${purpose || 'signup'}, role: ${role || 'crew'})`);

    const result = await sendVerificationEmail({
      email,
      name,
      role: role || 'crew',
      purpose: purpose || 'signup',
      origin,
    });

    console.log(`[Brevo Auth] Dispatch result for ${email}: method=${result.deliveryMethod}, simulated=${result.simulated}`);
    return res.json(result);
  } catch (err) {
    console.error(`[Brevo Auth] Error dispatching OTP to ${req.body?.email}:`, err.message || err);
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to send verification code.',
    });
  }
});

// 2. Verify Email 6-digit OTP Code
apiRouter.post('/auth/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required.' });
    }

    console.log(`[Brevo Auth] Verifying OTP code for ${email}`);
    const result = await verifyOtpCode({ email, code });
    if (!result.verified) {
      console.warn(`[Brevo Auth] Code rejected for ${email}: ${result.error}`);
      return res.status(400).json(result);
    }

    console.log(`[Brevo Auth] Code successfully verified for ${email}`);
    return res.json(result);
  } catch (err) {
    console.error(`[Brevo Auth] Verification error for ${req.body?.email}:`, err.message || err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal verification error.',
    });
  }
});

// 3. Send Password Reset Code via Brevo
apiRouter.post('/auth/send-reset-code', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const result = await sendVerificationEmail({
      email,
      purpose: 'reset-password',
    });

    return res.json(result);
  } catch (err) {
    console.error('Error in /api/auth/send-reset-code:', err);
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to send password reset code.',
    });
  }
});

// 4. Check Brevo SMTP Configuration Status
apiRouter.get('/brevo/status', (_req, res) => {
  try {
    const config = getBrevoConfig();
    return res.json({
      configured: config.isConfigured,
      isSmtpConfigured: config.isSmtpConfigured,
      isApiConfigured: config.isApiConfigured,
      preferredMethod: config.preferredMethod,
      mode: config.preferredMethod === 'api' ? 'HTTPS REST API v3' : config.preferredMethod === 'smtp' ? 'SMTP Relay' : 'Sandbox',
      host: config.host,
      port: config.port,
      user: config.user ? `${config.user.substring(0, 3)}***@***` : null,
      senderEmail: config.senderEmail,
      senderName: config.senderName,
      provider: 'Brevo (formerly Sendinblue)',
      defaultHost: 'smtp-relay.brevo.com',
      defaultPort: 587,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. Test Brevo SMTP Relay & Dispatch Live Test
apiRouter.post('/brevo/test-connection', async (req, res) => {
  try {
    const { testEmail, customConfig } = req.body || {};
    const connectionTest = await testBrevoConnection(customConfig || {});

    // If testEmail is provided and connection succeeded, dispatch a real test verification email!
    let emailResult = null;
    if (connectionTest.success && testEmail) {
      emailResult = await sendVerificationEmail({
        email: testEmail,
        name: 'Evencify Admin',
        purpose: 'signup',
        customConfig: customConfig || {},
      });
    }

    if (testEmail) {
      if (emailResult?.success) {
        return res.json({
          ...connectionTest,
          success: true,
          emailSent: true,
          message: `Live verification email successfully dispatched to ${testEmail}! Check your inbox for the 6-digit OTP code.`,
          emailDetails: emailResult,
        });
      } else {
        return res.json({
          ...connectionTest,
          success: false,
          emailSent: false,
          message: emailResult?.error || 'Failed to dispatch test verification email.',
          emailDetails: emailResult,
        });
      }
    }

    return res.json({
      ...connectionTest,
      emailSent: false,
      emailDetails: emailResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
