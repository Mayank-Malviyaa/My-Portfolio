import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the project root directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Configurable CORS
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS request blocked by server policy.'));
    },
    credentials: true,
  })
);

// Body parser with 25kb limit
app.use(express.json({ limit: '25kb' }));

// Abuse Protection: max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many contact submissions from this IP. Please wait 15 minutes before trying again or email directly.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/contact', contactLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const isConfigured = Boolean(
    process.env.EMAIL_USER && (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS)
  );
  res.status(200).json({
    status: 'ok',
    service: 'portfolio-contact-api',
    emailConfigured: isConfigured,
  });
});

// HTML sanitization helper
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, honeypot } = req.body;

    // Spam honeypot detection
    if (honeypot) {
      return res.status(400).json({ success: false, error: 'Spam submission detected.' });
    }

    // 1. Validate Name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your name.' });
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 2 and 80 characters.',
      });
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 120) {
      return res.status(400).json({
        success: false,
        error: 'Email address cannot exceed 120 characters.',
      });
    }

    // 3. Validate Subject (Optional)
    let cleanSubject = 'New Portfolio Message';
    if (subject && typeof subject === 'string') {
      const trimmedSubject = subject.trim();
      if (trimmedSubject.length > 150) {
        return res.status(400).json({
          success: false,
          error: 'Subject cannot exceed 150 characters.',
        });
      }
      if (trimmedSubject.length > 0) {
        cleanSubject = sanitize(trimmedSubject);
      }
    }

    // 4. Validate Message
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters.',
      });
    }
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 4000) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot exceed 4000 characters.',
      });
    }

    const cleanName = sanitize(trimmedName);
    const cleanMessage = sanitize(trimmedMessage);
    const submissionTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || 'mayank.bhadauns@gmail.com';

    // Method A: If EMAIL_USER and EMAIL_PASSWORD are configured in .env, use Nodemailer (Gmail/SMTP)
    if (emailUser && emailPass) {
      const transporterConfig = process.env.SMTP_HOST
        ? {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          }
        : {
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          };

      const transporter = nodemailer.createTransport(transporterConfig);

      await transporter.sendMail({
        from: `"Portfolio Contact Form" <${emailUser}>`,
        to: emailTo,
        replyTo: `"${cleanName}" <${trimmedEmail}>`,
        subject: `New Portfolio Contact: ${cleanSubject}`,
        text: `New Portfolio Contact\n\nName: ${cleanName}\nEmail: ${trimmedEmail}\nSubject: ${cleanSubject}\nTime: ${submissionTime} IST\n\nMessage:\n${trimmedMessage}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #FF6A00; margin-top: 0; font-size: 22px;">New Portfolio Contact</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #111;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #111;"><a href="mailto:${trimmedEmail}" style="color: #FF6A00;">${trimmedEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0; color: #111;">${cleanSubject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Submitted:</strong></td>
                <td style="padding: 8px 0; color: #111;">${submissionTime} IST</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 16px 0;" />
            <h3 style="color: #222; font-size: 15px; margin-bottom: 8px;">Message Content:</h3>
            <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap; border-left: 3px solid #FF6A00;">
${cleanMessage}
            </div>
          </div>
        `,
      });

      console.log(`[Contact API Success - Nodemailer] Message from "${cleanName}" <${trimmedEmail}> delivered to ${emailTo}`);

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully. I will get back to you shortly.',
      });
    }

    // Method B: Seamless FormSubmit delivery directly to mayank.bhadauns@gmail.com
    console.log(`[Contact API] Dispatching message via FormSubmit to ${emailTo}...`);

    const formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(emailTo)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
      body: JSON.stringify({
        name: cleanName,
        email: trimmedEmail,
        _replyto: trimmedEmail,
        _subject: `New Portfolio Contact: ${cleanSubject}`,
        subject: cleanSubject,
        message: trimmedMessage,
        submission_time: `${submissionTime} IST`,
      }),
    });

    const formSubmitData = await formSubmitResponse.json().catch(() => ({}));

    if (formSubmitResponse.ok && (formSubmitData.success === 'true' || formSubmitData.success === true)) {
      console.log(`[Contact API Success - FormSubmit] Message from "${cleanName}" <${trimmedEmail}> delivered to ${emailTo}`);
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully. I will get back to you shortly.',
      });
    }

    // If FormSubmit requires one-time activation, explain clearly
    if (formSubmitData.message && formSubmitData.message.includes('Activation')) {
      console.warn('[Contact API - FormSubmit Activation Pending]:', formSubmitData.message);
      return res.status(200).json({
        success: true,
        message: 'Message registered! FormSubmit sent a one-time activation link to mayank.bhadauns@gmail.com. Please check your inbox and click activate.',
      });
    }

    throw new Error(formSubmitData.message || 'External form delivery service failed');
  } catch (err) {
    console.error('[Contact API Delivery Error]:', err.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to deliver message due to an email service error. Please try again or email Mayank directly at mayank.bhadauns@gmail.com.',
    });
  }
});

app.listen(PORT, () => {
  const isSmtpConfigured = Boolean(
    process.env.EMAIL_USER && (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS)
  );
  console.log(`Portfolio API server running on port ${PORT}`);
  if (isSmtpConfigured) {
    console.log(`[Contact API] Nodemailer SMTP delivery enabled -> ${process.env.EMAIL_TO || 'mayank.bhadauns@gmail.com'}`);
  } else {
    console.log(`[Contact API] FormSubmit direct delivery enabled -> ${process.env.EMAIL_TO || 'mayank.bhadauns@gmail.com'}`);
  }
});
