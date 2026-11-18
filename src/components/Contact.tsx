import { motion, useInView, AnimatePresence, MotionConfig } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { CardContent } from '@/components/ui/card';
import { GlowCard } from '@/components/ui/glow-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Download, Send, CheckCircle2, XCircle, X } from 'lucide-react';
import { Github, Instagram, Linkedin } from './BrandIcons';
import { TextScramble } from './TextScramble';
import { downloadCV } from '@/lib/download-cv';
import { SectionHeading } from './SectionHeading';
import type { Translations } from '../i18n/utils';
import type { Language } from '../i18n/config';

// Toast component
interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

function Toast({ type, message, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 50, x: '-50%' }}
      className={`fixed bottom-20 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
        type === 'success'
          ? 'bg-green-500/10 border-green-500/30 text-green-500'
          : 'bg-red-500/10 border-red-500/30 text-red-500'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/robert-stickler-6b30b8258/',
    icon: Linkedin,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/BytesAndParty',
    icon: Github,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/robert_stickler/',
    icon: Instagram,
  },
];

interface ContactProps {
  lang: Language;
  translations: Translations;
}

export default function Contact({ lang, translations: t }: ContactProps) {
  const contactInfo = [
    {
      icon: Mail,
      label: t.contact.info.email,
      value: 'rstickler98@gmail.com',
      href: 'mailto:rstickler98@gmail.com',
    },
    {
      icon: Phone,
      label: t.contact.info.phone,
      value: '+43 650 503 0177',
      href: 'tel:+436505030177',
    },
    {
      icon: MapPin,
      label: t.contact.info.location,
      value: lang === 'de' ? 'Wien, Österreich' : 'Vienna, Austria',
      href: null,
    },
  ];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'email' | 'message', string>>>({});
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    // A pending timer from a previous toast would dismiss this one early
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const validate = (formData: FormData) => {
    const errors: typeof fieldErrors = {};
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (name.length < 2) errors.name = t.contact.form.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t.contact.form.errors.email;
    if (message.length < 10) errors.message = t.contact.form.errors.message;

    return errors;
  };

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (hasSubmittedOnce) {
      showToast('error', t.contact.error?.alreadySubmitted || 'You have already sent a message.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setHasSubmittedOnce(true);
        form.reset();
        showToast('success', t.contact.success.message);
      } else {
        showToast('error', t.contact.error?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('error', t.contact.error?.message || 'Something went wrong. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <MotionConfig reducedMotion="user">
    <section id="contact" className="py-24 relative grain-texture overflow-x-hidden" ref={ref}>
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-primary/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.contact.title} isInView={isInView} />

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowCard className="bg-card/50 h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  {t.contact.heading}
                </h3>
                <p className="text-muted-foreground mb-8">
                  {t.contact.description}
                </p>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <info.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-foreground font-medium hover:text-primary transition-colors"
                          >
                            <TextScramble
                              text={info.value}
                              delay={500 + index * 200}
                              speed={25}
                            />
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">
                            <TextScramble
                              text={info.value}
                              delay={500 + index * 200}
                              speed={25}
                            />
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* CV Download */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="mb-6 skill-tooltip-wrapper"
                >
                  <Button
                    variant="outline"
                    className="w-full cursor-help"
                    onClick={() => downloadCV(lang)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t.contact.download}
                  </Button>
                  <div className="skill-tooltip">
                    <div className="skill-tooltip-title">{t.contact.download}</div>
                    <div className="skill-tooltip-desc">{t.contact.downloadTooltip}</div>
                  </div>
                </motion.div>

                <Separator className="my-6" />

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <p className="text-sm text-muted-foreground mb-4">{t.contact.followMe}</p>
                  <div className="flex gap-3">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-secondary text-muted-foreground hover:text-primary rounded-full border border-border hover:border-primary/50 transition-colors"
                        title={link.name}
                      >
                        <link.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </GlowCard>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlowCard className="bg-card/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  {t.contact.form.submit}
                </h3>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      {t.contact.success.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {t.contact.success.message}
                    </p>
                  </motion.div>
                ) : (
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <p className="hidden">
                      <label>Don't fill this out: <input name="bot-field" /></label>
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.contact.form.name} *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder={t.contact.form.namePlaceholder}
                          required
                          aria-invalid={!!fieldErrors.name}
                          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                          onChange={() => clearFieldError('name')}
                          className="bg-secondary/50"
                        />
                        {fieldErrors.name && (
                          <p id="name-error" className="text-xs text-destructive" role="alert">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.contact.form.email} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t.contact.form.emailPlaceholder}
                          required
                          aria-invalid={!!fieldErrors.email}
                          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                          onChange={() => clearFieldError('email')}
                          className="bg-secondary/50"
                        />
                        {fieldErrors.email && (
                          <p id="email-error" className="text-xs text-destructive" role="alert">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t.contact.form.subject}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder={t.contact.form.subjectPlaceholder}
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t.contact.form.message} *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={t.contact.form.messagePlaceholder}
                        rows={5}
                        required
                        aria-invalid={!!fieldErrors.message}
                        aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                        onChange={() => clearFieldError('message')}
                        className="bg-secondary/50 resize-none"
                      />
                      {fieldErrors.message && (
                        <p id="message-error" className="text-xs text-destructive" role="alert">
                          {fieldErrors.message}
                        </p>
                      )}
                    </div>

                    <MagneticButton
                      type="submit"
                      size="lg"
                      className="w-full bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                      disabled={isSubmitting}
                      strength={0.2}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          {t.contact.form.submitting}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t.contact.form.submit}
                        </>
                      )}
                    </MagneticButton>

                    <p className="text-xs text-muted-foreground text-center">
                      {t.contact.form.required}
                    </p>
                  </form>
                )}
              </CardContent>
            </GlowCard>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-border text-center"
        >
          <p className="text-muted-foreground text-sm">
            {t.contact.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            {t.contact.footer.madeWith}
          </p>
          <div className="flex justify-center gap-3 mt-4 text-xs">
            <a
              href={`/${lang}/impressum`}
              className="text-muted-foreground/70 hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              {t.contact.footer.imprint}
            </a>
            <span className="text-muted-foreground/40" aria-hidden="true">·</span>
            <a
              href={`/${lang}/datenschutz`}
              className="text-muted-foreground/70 hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              {t.contact.footer.privacy}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </section>
    </MotionConfig>
  );
}
