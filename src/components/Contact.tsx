import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Linkedin, Instagram, Download, Send, CheckCircle2 } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'E-Mail',
    value: 'rstickler98@gmail.com',
    href: 'mailto:rstickler98@gmail.com',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+43 650 503 0177',
    href: 'tel:+436505030177',
  },
  {
    icon: MapPin,
    label: 'Standort',
    value: 'Vienna, Austria',
    href: null,
  },
];

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/your-profile', // TODO: Ersetze mit deinem LinkedIn Profil
    icon: Linkedin,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/your-profile', // TODO: Ersetze mit deinem Instagram Profil
    icon: Instagram,
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    // Hier kannst du später einen echten Form-Handler einbauen (z.B. Formspree, Netlify Forms, etc.)
    // Für jetzt simulieren wir einen Submit
    console.log('Form submitted:', data);

    // Simuliere API Call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset nach 5 Sekunden
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 relative" ref={ref}>
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-primary/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Kontakt
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/50 border-border h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Lass uns in Kontakt treten
                </h3>
                <p className="text-muted-foreground mb-8">
                  Interesse an einer Zusammenarbeit oder hast du Fragen?
                  Fülle das Formular aus oder kontaktiere mich direkt.
                </p>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
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
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{info.value}</p>
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
                  className="mb-6"
                >
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href="/cv-robert-stickler.pdf" download>
                      <Download className="w-4 h-4 mr-2" />
                      CV als PDF herunterladen
                    </a>
                  </Button>
                </motion.div>

                <Separator className="my-6" />

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <p className="text-sm text-muted-foreground mb-4">Folge mir auf</p>
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
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Nachricht senden
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
                      Nachricht gesendet!
                    </h4>
                    <p className="text-muted-foreground">
                      Danke für deine Nachricht. Ich melde mich bald bei dir.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Dein Name"
                          required
                          className="bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="deine@email.com"
                          required
                          className="bg-secondary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Betreff</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Worum geht es?"
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Nachricht *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Deine Nachricht..."
                        rows={5}
                        required
                        className="bg-secondary/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Nachricht senden
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      * Pflichtfelder. Deine Daten werden vertraulich behandelt.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
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
            © {new Date().getFullYear()} Robert Stickler. Alle Rechte vorbehalten.
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            Erstellt mit Astro, React, Tailwind CSS & shadcn/ui
          </p>
        </motion.div>
      </div>
    </section>
  );
}
