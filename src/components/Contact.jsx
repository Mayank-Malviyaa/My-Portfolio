import React, { useState } from 'react';
import SectionLabel from './SectionLabel';
import { Mail, Linkedin, Github, Send, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // anti-bot spam field
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: '',
    successMessage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-level error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      errors.name = 'Please enter your name.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (trimmedName.length > 80) {
      errors.name = 'Name cannot exceed 80 characters.';
    }

    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    } else if (trimmedEmail.length > 120) {
      errors.email = 'Email cannot exceed 120 characters.';
    }

    if (formData.subject && formData.subject.trim().length > 150) {
      errors.subject = 'Subject cannot exceed 150 characters.';
    }

    if (!trimmedMessage) {
      errors.message = 'Please enter your message.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters.';
    } else if (trimmedMessage.length > 4000) {
      errors.message = 'Message cannot exceed 4000 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({
      submitting: true,
      submitted: false,
      error: '',
      successMessage: '',
    });

    try {
      const apiBase = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
        : '';
      const endpoint = `${apiBase}/api/contact`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus({
          submitting: false,
          submitted: true,
          error: '',
          successMessage: data.message || 'Message sent successfully. I will get back to you shortly.',
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          honeypot: '',
        });
        setFieldErrors({});
      } else {
        // Keep entered data in form so user does not lose input
        setStatus({
          submitting: false,
          submitted: false,
          error:
            data.error ||
            'Unable to process your message. You can also email me directly at mayank.bhadauns@gmail.com.',
          successMessage: '',
        });
      }
    } catch (err) {
      // Network or offline error
      setStatus({
        submitting: false,
        submitted: false,
        error:
          'Unable to connect to the server. Please check your connection or email me directly at mayank.bhadauns@gmail.com.',
        successMessage: '',
      });
    }
  };

  const handleResetSuccess = () => {
    setStatus({
      submitting: false,
      submitted: false,
      error: '',
      successMessage: '',
    });
  };

  return (
    <section id="contact" className="section-container contact-section">
      <SectionLabel number="05" text="CONTACT" />

      <div className="contact-grid-layout">
        {/* Left Column: Direct Channels */}
        <div className="contact-info-col">
          <h2 className="contact-huge-heading">
            LET'S BUILD <br />
            <span className="accent-highlight">SOMETHING.</span>
          </h2>

          <p className="contact-intro-p">
            Have an engineering project, internship opportunity, or idea? Whether you're looking for
            a dedicated full-stack developer or want to connect, feel free to reach out.
          </p>

          <div className="contact-direct-links">
            <a href="mailto:mayank.bhadauns@gmail.com" className="direct-link-card">
              <div className="link-card-icon">
                <Mail size={20} />
              </div>
              <div className="link-card-content">
                <span className="link-card-label">EMAIL DIRECTLY</span>
                <span className="link-card-value">mayank.bhadauns@gmail.com</span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/mayank-malviya-9b87882a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="direct-link-card"
            >
              <div className="link-card-icon">
                <Linkedin size={20} />
              </div>
              <div className="link-card-content">
                <span className="link-card-label">LINKEDIN</span>
                <span className="link-card-value">Connect on LinkedIn</span>
              </div>
            </a>

            <a
              href="https://github.com/Mayank-Malviyaa"
              target="_blank"
              rel="noopener noreferrer"
              className="direct-link-card"
            >
              <div className="link-card-icon">
                <Github size={20} />
              </div>
              <div className="link-card-content">
                <span className="link-card-label">GITHUB</span>
                <span className="link-card-value">Explore GitHub Profile</span>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Functional Contact Form */}
        <div className="contact-form-col">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <h3 className="form-title">Send a Direct Message</h3>

            {/* Hidden honeypot field for bot suppression */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            {status.submitted && (
              <div className="form-alert success" role="alert">
                <CheckCircle2 size={18} />
                <div style={{ flex: 1 }}>
                  <strong>MESSAGE SENT:</strong> {status.successMessage}
                </div>
                <button
                  type="button"
                  onClick={handleResetSuccess}
                  className="alert-reset-btn"
                  aria-label="Send another message"
                >
                  <RotateCcw size={14} />
                  <span>Send Another</span>
                </button>
              </div>
            )}

            {status.error && (
              <div className="form-alert error" role="alert">
                <AlertCircle size={18} />
                <span>{status.error}</span>
              </div>
            )}

            <div className="form-row-dual">
              <div className="form-field">
                <label htmlFor="name" className="form-label">
                  YOUR NAME *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Smith"
                  className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status.submitting}
                  required
                />
                {fieldErrors.name && (
                  <span className="field-error-msg">{fieldErrors.name}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  YOUR EMAIL *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. alex@example.com"
                  className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status.submitting}
                  required
                />
                {fieldErrors.email && (
                  <span className="field-error-msg">{fieldErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="subject" className="form-label">
                SUBJECT (OPTIONAL)
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="e.g. Project Opportunity / Collaboration"
                className={`form-input ${fieldErrors.subject ? 'input-error' : ''}`}
                value={formData.subject}
                onChange={handleChange}
                disabled={status.submitting}
              />
              {fieldErrors.subject && (
                <span className="field-error-msg">{fieldErrors.subject}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="message" className="form-label">
                MESSAGE *
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message here (minimum 10 characters)..."
                className={`form-input textarea ${fieldErrors.message ? 'input-error' : ''}`}
                value={formData.message}
                onChange={handleChange}
                disabled={status.submitting}
                required
              />
              {fieldErrors.message && (
                <span className="field-error-msg">{fieldErrors.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="form-submit-btn"
              disabled={status.submitting}
            >
              <span>
                {status.submitting
                  ? 'SENDING...'
                  : status.submitted
                  ? 'MESSAGE SENT'
                  : 'SEND MESSAGE'}
              </span>
              <Send size={16} className="btn-send-icon" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
