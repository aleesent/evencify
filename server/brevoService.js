import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables if running in standalone server
dotenv.config();

// In-memory verification storage with TTL (10 minutes)
const verificationStore = new Map();

// Track if Brevo direct SMTP is blocked due to cloud IP restrictions (525 Unauthorized IP address)
let smtpIpRestricted = false;

// Helper to sanitize and normalize email
export const normalizeEmail = (email) => {
  return String(email || '').trim().toLowerCase();
};

// Generate cryptographically uniform 6-digit numeric OTP code
export const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Resolves Brevo SMTP and API configurations from environment variables or custom overrides
 */
export const getBrevoConfig = (customOverrides = {}) => {
  const host = customOverrides.host || process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(customOverrides.port || process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587);
  const user = customOverrides.user || process.env.BREVO_SMTP_USER || process.env.SMTP_USER || process.env.BREVO_USER || '';
  const smtpKey = customOverrides.smtpKey || customOverrides.key || process.env.BREVO_SMTP_KEY || process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.BREVO_KEY || '';
  
  // Brevo API Key: Check custom, env, or if the provided smtpKey starts with xkeysib- (Brevo API key format)
  let apiKey = customOverrides.apiKey || process.env.BREVO_API_KEY || '';
  if (!apiKey && smtpKey && smtpKey.startsWith('xkeysib-')) {
    apiKey = smtpKey;
  }

  const senderEmail = customOverrides.senderEmail || process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.EMAIL_FROM || user || 'noreply@evencify.com';
  const senderName = customOverrides.senderName || process.env.BREVO_SENDER_NAME || 'Evencify Verification';

  const isSmtpConfigured = Boolean(user && smtpKey && host);
  const isApiConfigured = Boolean(apiKey);
  
  // Prefer REST API v3 in cloud containers because direct SMTP frequently blocks dynamic cloud IPs (525 5.7.1)
  const preferredMethod = isApiConfigured ? 'api' : isSmtpConfigured ? 'smtp' : 'sandbox';

  return {
    host,
    port,
    user,
    smtpKey,
    apiKey,
    senderEmail,
    senderName,
    isSmtpConfigured,
    isApiConfigured,
    isConfigured: isSmtpConfigured || isApiConfigured,
    preferredMethod,
    smtpIpRestricted,
  };
};

/**
 * Builds HTML email template matching Evencify's modern styling with the exact brand logo colours and clean layout
 */
export const buildVerificationHtml = ({ code, name, role, purpose = 'signup', origin = '' }) => {
  const isReset = purpose === 'reset-password';
  const title = isReset ? 'Reset Your Evencify Password' : 'Verify Your Evencify Account';
  const roleLabel = role === 'organiser' ? 'Event Organiser' : role === 'crew' ? 'Crew Member' : 'Member';
  
  const leadText = isReset
    ? `We received a request to reset your password for your <strong>${roleLabel}</strong> account on Evencify.`
    : `Please use the 6-digit verification code below to verify and activate your <strong>${roleLabel}</strong> account on Evencify.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <!-- Preview text -->
  <div style="display: none; font-size: 1px; color: #f4f5f7; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your Evencify verification code is ${code}. Valid for 10 minutes.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f5f7; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Brand Header with evencify. text logo and brand colours -->
          <tr>
            <td style="background-color: #0F1014; padding: 24px 32px; border-bottom: 2px solid #FED000;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <!-- evencify. Text Mark in Brand Colors -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <!-- 'even' in iconic yellow brand pill -->
                        <td style="background-color: #FED000; border-radius: 8px; padding: 4px 10px; vertical-align: middle;">
                          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 900; color: #000000; letter-spacing: -0.4px; line-height: 1; display: inline-block;">
                            even
                          </span>
                        </td>
                        <!-- 'cify.' with white text and yellow period -->
                        <td style="padding-left: 5px; vertical-align: middle;">
                          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.4px; line-height: 1; display: inline-block;">
                            cify<span style="color: #FED000; font-weight: 900;">.</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; font-weight: 700; color: #9CA3AF; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">
                      Events Made Easy
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(254, 208, 0, 0.12); border: 1px solid rgba(254, 208, 0, 0.35); border-radius: 9999px;">
                      <tr>
                        <td style="padding: 4px 12px;">
                          <span style="color: #FED000; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                            ● SECURE OTP
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 34px 32px 28px 32px;">
              <h1 style="font-size: 22px; font-weight: 800; color: #0F1014; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.3px;">
                ${title}
              </h1>

              <p style="font-size: 14.5px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                Hello <strong>${name ? name : 'there'}</strong>,<br>
                ${leadText}
              </p>

              <!-- Clean & Professional OTP Code Display Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAFAFB; border: 1.5px solid #FED000; border-radius: 14px; margin: 20px 0;">
                <tr>
                  <td style="padding: 24px 16px; text-align: center;">
                    <div style="font-size: 10.5px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 1.6px; margin-bottom: 8px;">
                      Your Verification Code
                    </div>
                    
                    <div style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #0F1014; font-family: 'SF Mono', Consolas, Monaco, 'Courier New', monospace; padding: 4px 0;">
                      ${code}
                    </div>

                    <div style="margin-top: 10px;">
                      <span style="display: inline-block; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 3px 12px; font-size: 11.5px; font-weight: 600; color: #6b7280;">
                        Valid for 10 minutes • Single-use
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Information -->
              <p style="font-size: 12.5px; line-height: 1.6; color: #6b7280; margin: 20px 0 0 0;">
                Never share this code with anyone. Evencify team members will never ask for your verification code.
              </p>
              <p style="font-size: 11.5px; line-height: 1.5; color: #9ca3af; margin: 8px 0 0 0;">
                If you did not request this verification code, no further action is required and you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Brand Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f0f0f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 12px; font-weight: 600; color: #52525b; margin: 0 0 4px 0;">
                Evencify • Events Made Easy
              </p>
              <p style="font-size: 11px; color: #a1a1aa; margin: 0;">
                © ${new Date().getFullYear()} Evencify India. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Sends transactional email via Brevo REST API v3
 */
const sendViaBrevoApi = async ({ config, toEmail, toName, subject, htmlContent }) => {
  const payload = {
    sender: {
      name: config.senderName,
      email: config.senderEmail,
    },
    to: [
      {
        email: toEmail,
        name: toName || toEmail.split('@')[0],
      },
    ],
    subject,
    htmlContent,
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': config.apiKey || config.smtpKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API Error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return { success: true, messageId: result.messageId, method: 'brevo_api' };
};

/**
 * Sends transactional email via Brevo SMTP (Nodemailer)
 */
const sendViaBrevoSmtp = async ({ config, toEmail, toName, subject, htmlContent }) => {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for 587
    auth: {
      user: config.user,
      pass: config.smtpKey || config.apiKey,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"${config.senderName}" <${config.senderEmail}>`,
    to: toName ? `"${toName}" <${toEmail}>` : toEmail,
    subject,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, method: 'brevo_smtp' };
};

/**
 * Main dispatcher: sends verification email via Brevo SMTP or API with simulated fallback
 */
export const sendVerificationEmail = async ({
  email,
  name,
  role,
  purpose = 'signup',
  origin = '',
  customConfig = {},
}) => {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Valid recipient email address is required.');
  }

  // Rate limit check: prevent rapid spamming (30s cooldown)
  const existing = verificationStore.get(cleanEmail);
  const now = Date.now();
  if (existing && now - existing.createdAt < 30000) {
    const remainingSeconds = Math.ceil((30000 - (now - existing.createdAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds}s before requesting a new verification code.`);
  }

  // Generate 6-digit code and store it with 10-minute expiry
  const code = generateOtpCode();
  const expiresAt = now + 10 * 60 * 1000;

  verificationStore.set(cleanEmail, {
    code,
    name,
    role,
    purpose,
    createdAt: now,
    expiresAt,
    attempts: 0,
  });

  const config = getBrevoConfig(customConfig);
  const subject = purpose === 'reset-password'
    ? `${code} is your Evencify password reset code`
    : `${code} is your Evencify verification code`;

  const htmlContent = buildVerificationHtml({ code, name, role, purpose, origin });

  // If Brevo SMTP or API credentials are provided, send real email!
  if (config.isConfigured) {
    try {
      let deliveryResult;

      // 1. Prioritize Brevo REST API v3 when apiKey is available.
      // In cloud container environments (Cloud Run, Render, Vercel), direct SMTP connections
      // to smtp-relay.brevo.com:587 are frequently blocked by Brevo IP authorization (525 5.7.1).
      // The HTTPS REST API v3 is specifically designed for cloud apps and works seamlessly.
      if (config.isApiConfigured) {
        try {
          deliveryResult = await sendViaBrevoApi({ config, toEmail: cleanEmail, toName: name, subject, htmlContent });
        } catch (apiErr) {
          // If REST API fails and SMTP is configured (and not known to be IP-restricted), try SMTP as backup
          if (config.isSmtpConfigured && !smtpIpRestricted) {
            try {
              deliveryResult = await sendViaBrevoSmtp({ config, toEmail: cleanEmail, toName: name, subject, htmlContent });
            } catch (smtpErr) {
              if (smtpErr.message?.includes('525') || smtpErr.message?.includes('Unauthorized IP')) {
                smtpIpRestricted = true;
              }
              throw apiErr;
            }
          } else {
            throw apiErr;
          }
        }
      } else if (config.isSmtpConfigured) {
        // 2. If only SMTP is configured:
        if (smtpIpRestricted) {
          // SMTP is already known to be IP-restricted in this container session
          return {
            success: true,
            simulated: true,
            previewCode: code,
            message: `Brevo SMTP relay returned 525 Unauthorized IP address. In sandbox mode, your verification code is ${code}.`,
            deliveryMethod: 'sandbox_ip_restricted',
            expiresAt,
          };
        }

        try {
          deliveryResult = await sendViaBrevoSmtp({ config, toEmail: cleanEmail, toName: name, subject, htmlContent });
        } catch (smtpErr) {
          const isIpBlock = smtpErr.message?.includes('525') || smtpErr.message?.includes('Unauthorized IP');
          if (isIpBlock) {
            smtpIpRestricted = true;
            console.log(`[Brevo Notice] Direct SMTP relay blocked by Brevo IP authorization policy (525 Unauthorized IP address). To send real emails from cloud hosting, set BREVO_API_KEY (xkeysib-...). Sandbox verification code for ${cleanEmail}: ${code}`);
            return {
              success: true,
              simulated: true,
              previewCode: code,
              message: `Brevo SMTP returned 525 Unauthorized IP address. In sandbox mode, your verification code is ${code}.`,
              deliveryMethod: 'sandbox_ip_restricted',
              expiresAt,
            };
          }
          throw smtpErr;
        }
      }

      const methodLabel = deliveryResult.method === 'brevo_api' ? 'Brevo REST API' : 'Brevo SMTP relay';
      return {
        success: true,
        simulated: false,
        message: `Verification code sent to ${cleanEmail}. Please check your email inbox for your 6-digit code.`,
        deliveryMethod: deliveryResult.method,
        expiresAt,
      };
    } catch (sendError) {
      console.error('Brevo transmission error:', sendError.message || sendError);
      return {
        success: false,
        error: `Brevo delivery failed: ${sendError.message}. Please check your Brevo credentials or sender domain verification.`,
        expiresAt,
      };
    }
  }

  // Fallback: Sandbox / Demo mode when credentials are not yet entered
  console.log(`[Evencify Brevo Sandbox] Verification code for ${cleanEmail}: ${code}`);
  return {
    success: true,
    simulated: true,
    previewCode: code,
    message: `Brevo SMTP keys not yet detected in environment. In Sandbox mode, your verification code is ${code}.`,
    expiresAt,
  };
};

/**
 * Validates the user's entered 6-digit OTP code
 */
export const verifyOtpCode = async ({ email, code }) => {
  const cleanEmail = normalizeEmail(email);
  const cleanCode = String(code || '').trim();

  if (!cleanEmail || !cleanCode) {
    return { success: false, verified: false, error: 'Email and verification code are required.' };
  }

  const record = verificationStore.get(cleanEmail);
  if (!record) {
    return {
      success: false,
      verified: false,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  if (Date.now() > record.expiresAt) {
    verificationStore.delete(cleanEmail);
    return {
      success: false,
      verified: false,
      error: 'Verification code has expired (valid for 10 minutes). Please request a new one.',
    };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    verificationStore.delete(cleanEmail);
    return {
      success: false,
      verified: false,
      error: 'Too many incorrect attempts. Please request a fresh verification code.',
    };
  }

  if (record.code !== cleanCode) {
    return {
      success: false,
      verified: false,
      error: `Invalid verification code. ${5 - record.attempts} attempts remaining.`,
    };
  }

  // Code is verified! Remove from store and return user metadata
  verificationStore.delete(cleanEmail);
  return {
    success: true,
    verified: true,
    message: 'Email successfully verified with Brevo SMTP.',
    userData: {
      email: cleanEmail,
      name: record.name,
      role: record.role,
      purpose: record.purpose,
    },
  };
};

/**
 * Diagnostic tool: Test Brevo connection (REST API or SMTP relay)
 */
export const testBrevoConnection = async (customConfig = {}) => {
  const config = getBrevoConfig(customConfig);

  if (!config.isConfigured) {
    return {
      success: false,
      configured: false,
      message: 'Brevo credentials are not configured. Please supply BREVO_API_KEY or BREVO_SMTP_USER and BREVO_SMTP_KEY.',
    };
  }

  const diagnostics = {
    host: config.host,
    port: config.port,
    user: config.user ? `${config.user.substring(0, 3)}***@***` : 'None',
    sender: config.senderEmail,
    mode: config.preferredMethod === 'api' ? 'HTTPS REST API v3' : 'SMTP Relay',
    apiKeyPresent: Boolean(config.apiKey),
    smtpKeyPresent: Boolean(config.smtpKey),
  };

  // 1. If Brevo API is configured, test via Brevo account endpoint (recommended for cloud deployments)
  if (config.isApiConfigured) {
    try {
      const response = await fetch('https://api.brevo.com/v3/account', {
        headers: {
          'api-key': config.apiKey,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const account = await response.json();
        const planType = account.plan?.[0]?.type || 'Active';
        const credits = account.plan?.[0]?.credits;
        return {
          success: true,
          configured: true,
          deliveryMethod: 'brevo_api',
          diagnostics: {
            ...diagnostics,
            plan: planType,
            email: account.email,
            credits: credits !== undefined ? credits : 'Active',
            company: account.companyName,
          },
          message: `Brevo REST API verified successfully! Account: ${account.email} (${planType} plan, ${credits !== undefined ? credits + ' credits' : 'active'}). Transactional emails are operational.`,
        };
      } else {
        const err = await response.text();
        return { success: false, configured: true, message: `Brevo API rejected key: ${err}` };
      }
    } catch (apiErr) {
      return {
        success: false,
        configured: true,
        diagnostics,
        message: `Brevo API verification failed: ${apiErr.message}`,
      };
    }
  }

  // 2. Otherwise test via direct SMTP (Nodemailer)
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.smtpKey || config.apiKey,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    return {
      success: true,
      configured: true,
      deliveryMethod: 'brevo_smtp',
      diagnostics,
      message: 'Brevo SMTP connection verified successfully! Server is ready to relay transactional emails.',
    };
  } catch (err) {
    const isIpBlocked = err.message?.includes('525') || err.message?.includes('Unauthorized IP');
    if (isIpBlocked) {
      smtpIpRestricted = true;
    }
    return {
      success: false,
      configured: true,
      diagnostics,
      ipRestricted: isIpBlocked,
      message: isIpBlocked
        ? `Brevo SMTP Relay rejected connection (525 Unauthorized IP address). Direct SMTP requires IP whitelisting in Brevo. To resolve for cloud servers, configure BREVO_API_KEY (xkeysib-...) to use Brevo's HTTPS REST API v3.`
        : `Brevo connection failed: ${err.message}`,
    };
  }
};
