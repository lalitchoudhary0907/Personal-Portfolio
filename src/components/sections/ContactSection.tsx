/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  User,
  MessageSquare,
  Tag,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  MapPin,
  GraduationCap,
  Loader2,
  Info,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading, Kicker } from '../ui/Typography';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { portfolioData } from '../../data/portfolio';
import { validateContactInput, ContactFormData, ContactFormErrors } from '../../lib/validations/contact';
import { cn } from '../../lib/utils';

export const ContactSection: React.FC<{ id?: string }> = ({ id = 'contact' }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
    formRenderedAt: 0,
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submissionState, setSubmissionState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverFeedback, setServerFeedback] = useState<{
    message?: string;
    error?: string;
    configured?: boolean;
    retryAfterSeconds?: number;
  }>({});

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [providerStatus, setProviderStatus] = useState<{
    loaded: boolean;
    configured: boolean;
    recipientEmail: string;
    provider: string;
  }>({
    loaded: false,
    configured: false,
    recipientEmail: portfolioData.personalInfo.email,
    provider: 'Checking...',
  });

  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Set rendered timestamp for bot timing detection
  useEffect(() => {
    setFormData((prev) => ({ ...prev, formRenderedAt: Date.now() }));

    // Check email gateway status
    fetch('/api/contact/status')
      .then((res) => res.json())
      .then((data) => {
        setProviderStatus({
          loaded: true,
          configured: Boolean(data.configured),
          recipientEmail: data.recipientEmail || portfolioData.personalInfo.email,
          provider: data.provider || 'Unconfigured',
        });
      })
      .catch(() => {
        setProviderStatus({
          loaded: true,
          configured: false,
          recipientEmail: portfolioData.personalInfo.email,
          provider: 'Offline Gateway',
        });
      });
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.personalInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error as user types
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactFormData];
        return next;
      });
    }

    if (submissionState === 'error') {
      setSubmissionState('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side Zod validation
    const validation = validateContactInput(formData);
    if (!validation.success || !validation.data) {
      setErrors(validation.errors || {});
      setSubmissionState('error');
      setServerFeedback({
        error: 'Please resolve the highlighted validation errors before sending.',
      });

      // Focus first erroneous field for accessibility
      setTimeout(() => {
        const firstField = Object.keys(validation.errors || {})[0];
        const el = document.getElementById(`contact-${firstField}`);
        el?.focus();
      }, 50);
      return;
    }

    setErrors({});
    setSubmissionState('loading');
    setServerFeedback({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(validation.data),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setSubmissionState('error');
        setServerFeedback({
          error: data.error || `Server responded with status code ${response.status}`,
          configured: data.configured,
          retryAfterSeconds: data.retryAfterSeconds,
        });

        if (data.errors) {
          setErrors(data.errors);
        }
        return;
      }

      // Success
      setSubmissionState('success');
      setServerFeedback({
        message: data.message || 'Your message has been safely delivered to Lalit Choudhary.',
      });
    } catch (err: any) {
      setSubmissionState('error');
      setServerFeedback({
        error: `Unable to submit message (${err.message || 'Network error'}). You can email Lalit directly using the direct link below.`,
      });
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      honeypot: '',
      formRenderedAt: Date.now(),
    });
    setErrors({});
    setSubmissionState('idle');
    setServerFeedback({});
  };

  // Pre-filled mailto URL generator for instant fallback
  const getMailtoUrl = () => {
    const subjectParam = encodeURIComponent(
      formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim() || 'Visitor'}`
    );
    const bodyParam = encodeURIComponent(
      `${formData.message.trim()}\n\n---\nSent by: ${formData.name.trim() || 'Visitor'}\nEmail: ${formData.email.trim() || 'Not specified'}`
    );
    return `mailto:${portfolioData.personalInfo.email}?subject=${subjectParam}&body=${bodyParam}`;
  };

  return (
    <section
      id={id}
      aria-label="Contact Lalit Choudhary"
      className="relative py-24 sm:py-32 w-full overflow-hidden border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-transparent"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-gradient-to-t from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none select-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-0 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none select-none"
      />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Kicker className="mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Get In Touch</span>
          </Kicker>

          <SectionHeading gradient className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            Let's Build Something Meaningful Together
          </SectionHeading>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-balance">
            Whether you are discussing software engineering internships, exploring AI collaborations,
            or discussing open-source projects, my inbox is always open.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Direct Contact & Info Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Primary Email Card */}
            <Card className="border-cyan-500/20 dark:border-cyan-500/20 relative overflow-hidden bg-white dark:bg-[#0c1220]/80">
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"
              />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Direct Email
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Preferred contact channel
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-sm text-slate-800 dark:text-cyan-300 truncate select-all">
                    {portfolioData.personalInfo.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={copiedEmail ? 'Email address copied' : 'Copy email address'}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-200 border shrink-0',
                      copiedEmail
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 border-slate-300 dark:border-slate-700'
                    )}
                  >
                    {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${portfolioData.personalInfo.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    <span>Launch default email client</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* University & Location Card */}
            <Card className="bg-white dark:bg-[#0c1220]/80">
              <CardContent className="pt-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Academic Institution
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {portfolioData.education[0].institution}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {portfolioData.education[0].university}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/[0.06] pt-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Base Location
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Delhi NCR / Sonipat, {portfolioData.personalInfo.location}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Standard Time Zone: IST (UTC+05:30)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability & Turnaround Time */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div className="text-xs">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Open for opportunities & internships
                </span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Responses typically sent within 24–48 hours</span>
                </p>
              </div>
            </div>

            {/* Professional Profiles */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={portfolioData.personalInfo.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-[#0c1220] hover:border-cyan-500/50 hover:bg-cyan-500/[0.05] transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href={portfolioData.personalInfo.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-[#0c1220] hover:border-cyan-500/50 hover:bg-cyan-500/[0.05] transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <span>GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border-slate-300 dark:border-white/[0.1] bg-white dark:bg-[#0c1220]/95 backdrop-blur-md shadow-xl relative overflow-hidden">
              <CardHeader className="border-b border-slate-200 dark:border-white/[0.06] pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Send a Message</span>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Validated with Zod · Protected by rate limiting and spam filters
                    </p>
                  </div>

                  {providerStatus.loaded && (
                    <span
                      className={cn(
                        'text-[11px] font-mono px-2.5 py-1 rounded-full border',
                        providerStatus.configured
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                      )}
                      title={
                        providerStatus.configured
                          ? 'Resend API provider configured on server'
                          : 'Live provider API key pending in environment'
                      }
                    >
                      {providerStatus.configured ? '● Live Gateway' : '○ Standby Mode'}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Notice if provider is unconfigured in environment */}
                {providerStatus.loaded && !providerStatus.configured && submissionState !== 'success' && (
                  <div className="mb-6 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] dark:bg-amber-500/[0.05] text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <strong className="font-semibold block mb-0.5">Configuration Notice:</strong>
                      <span>
                        The backend email service is currently in unconfigured standby mode (no{' '}
                        <code className="font-mono bg-amber-500/10 px-1 py-0.5 rounded">RESEND_API_KEY</code> set).
                        You may validate input through the form, or click{' '}
                        <a
                          href={getMailtoUrl()}
                          className="font-bold underline text-amber-900 dark:text-amber-200 hover:text-cyan-300"
                        >
                          Send via Email App
                        </a>{' '}
                        to launch your mail client with your drafted inquiry.
                      </span>
                    </div>
                  </div>
                )}

                {/* Success View */}
                {submissionState === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Message Delivered Successfully!
                    </h4>

                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                      {serverFeedback.message ||
                        'Thank you for reaching out! Lalit has received your message and will respond to your email as soon as possible.'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button variant="outline" size="sm" onClick={handleResetForm}>
                        Send Another Message
                      </Button>

                      <a
                        href={portfolioData.personalInfo.socials.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:border-cyan-400/50 transition-colors"
                      >
                        <span>Connect on LinkedIn</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  /* Form View */
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    {/* General Error Banner */}
                    <AnimatePresence>
                      {submissionState === 'error' && serverFeedback.error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          role="alert"
                          className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/[0.08] dark:bg-rose-500/[0.05] text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                          <div className="flex-1">
                            <strong className="font-semibold block mb-0.5">Submission Error:</strong>
                            <span>{serverFeedback.error}</span>
                            {/* If email delivery is not configured, provide one-click mailto fallback */}
                            {serverFeedback.configured === false && (
                              <div className="mt-2.5 pt-2 border-t border-rose-500/20">
                                <a
                                  href={getMailtoUrl()}
                                  className="inline-flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200 underline hover:text-cyan-300"
                                >
                                  <span>Click here to send via your mail client instead</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Honeypot field (hidden from screen reader & users, traps automated bots) */}
                    <div aria-hidden="true" className="sr-only opacity-0 pointer-events-none absolute -left-[9999px]">
                      <label htmlFor="contact-honeypot">Leave this blank</label>
                      <input
                        id="contact-honeypot"
                        type="text"
                        name="honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.honeypot}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                        >
                          Full Name <span className="text-cyan-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            aria-required="true"
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? 'contact-name-error' : undefined}
                            disabled={submissionState === 'loading'}
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Alex Morgan"
                            className={cn(
                              'w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm transition-all duration-200',
                              'bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white',
                              'border focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
                              errors.name
                                ? 'border-rose-500/70 dark:border-rose-500/70 focus:border-rose-500'
                                : 'border-slate-300 dark:border-white/[0.1] focus:border-cyan-400'
                            )}
                          />
                        </div>
                        {errors.name && (
                          <p
                            id="contact-name-error"
                            role="alert"
                            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                        >
                          Email Address <span className="text-cyan-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            aria-required="true"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'contact-email-error' : undefined}
                            disabled={submissionState === 'loading'}
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="alex@example.com"
                            className={cn(
                              'w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm transition-all duration-200',
                              'bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white',
                              'border focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
                              errors.email
                                ? 'border-rose-500/70 dark:border-rose-500/70 focus:border-rose-500'
                                : 'border-slate-300 dark:border-white/[0.1] focus:border-cyan-400'
                            )}
                          />
                        </div>
                        {errors.email && (
                          <p
                            id="contact-email-error"
                            role="alert"
                            className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Subject <span className="text-cyan-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Tag className="w-4 h-4" />
                        </div>
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          required
                          aria-required="true"
                          aria-invalid={Boolean(errors.subject)}
                          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                          disabled={submissionState === 'loading'}
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="SWE Internship Opportunity / Technical Collaboration"
                          className={cn(
                            'w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm transition-all duration-200',
                            'bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white',
                            'border focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
                            errors.subject
                              ? 'border-rose-500/70 dark:border-rose-500/70 focus:border-rose-500'
                              : 'border-slate-300 dark:border-white/[0.1] focus:border-cyan-400'
                          )}
                        />
                      </div>
                      {errors.subject && (
                        <p
                          id="contact-subject-error"
                          role="alert"
                          className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                        >
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="contact-message"
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Message <span className="text-cyan-500">*</span>
                        </label>
                        <span
                          className={cn(
                            'text-[11px] font-mono',
                            formData.message.length > 2400
                              ? 'text-amber-500 font-semibold'
                              : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {formData.message.length} / 2500
                        </span>
                      </div>
                      <div className="relative">
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          aria-required="true"
                          aria-invalid={Boolean(errors.message)}
                          aria-describedby={errors.message ? 'contact-message-error' : undefined}
                          disabled={submissionState === 'loading'}
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Hi Lalit, I reviewed your work on DocDrift and would like to discuss..."
                          className={cn(
                            'w-full p-3.5 rounded-xl text-sm transition-all duration-200 resize-y',
                            'bg-slate-50 dark:bg-slate-900/70 text-slate-900 dark:text-white',
                            'border focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
                            errors.message
                              ? 'border-rose-500/70 dark:border-rose-500/70 focus:border-rose-500'
                              : 'border-slate-300 dark:border-white/[0.1] focus:border-cyan-400'
                          )}
                        />
                      </div>
                      {errors.message && (
                        <p
                          id="contact-message-error"
                          role="alert"
                          className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Actions and Status */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        glow
                        disabled={submissionState === 'loading'}
                        icon={
                          submissionState === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )
                        }
                      >
                        {submissionState === 'loading' ? 'Transmitting...' : 'Send Message'}
                      </Button>

                      {/* Direct Mailto Fallback Button */}
                      <a
                        href={getMailtoUrl()}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-400 border border-slate-300 dark:border-white/[0.08] hover:border-cyan-400/40 bg-transparent transition-all"
                      >
                        <span>Draft in Email Client</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};
