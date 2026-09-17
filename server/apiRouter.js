import { Router } from 'express';
import {
  sendVerificationEmail,
  verifyOtpCode,
  testBrevoConnection,
  getBrevoConfig,
} from './brevoService.js';

export const apiRouter = Router();

// Ensure response helper compatibility across both Express and Connect (Vite)
apiRouter.use((req, res, next) => {
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

// 1. Send Email Verification Code via Brevo
apiRouter.post('/auth/send-verification', async (req, res) => {
  try {
    const { email, name, role, purpose } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const origin = req.get('origin') || `${protocol}://${host}`;

    const result = await sendVerificationEmail({
      email,
      name,
      role: role || 'crew',
      purpose: purpose || 'signup',
      origin,
    });

    return res.json(result);
  } catch (err) {
    console.error('Error in /api/auth/send-verification:', err);
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

    const result = await verifyOtpCode({ email, code });
    if (!result.verified) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (err) {
    console.error('Error in /api/auth/verify-code:', err);
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

// 5. Test Brevo SMTP Relay
apiRouter.post('/brevo/test-connection', async (req, res) => {
  try {
    const { testEmail, customConfig } = req.body || {};
    const connectionTest = await testBrevoConnection(customConfig || {});

    // If testEmail is provided and connection succeeded, dispatch a real test verification email!
    let emailResult = null;
    if (connectionTest.success && testEmail) {
      emailResult = await sendVerificationEmail({
        email: testEmail,
        name: 'Brevo Test User',
        purpose: 'signup',
        customConfig: customConfig || {},
      });
    }

    return res.json({
      ...connectionTest,
      emailSent: emailResult?.success || false,
      emailDetails: emailResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
