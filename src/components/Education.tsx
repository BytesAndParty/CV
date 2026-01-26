import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';
import type { Translations } from '../i18n/utils';

const certIcons = ['🔷', '🔷', '☁️', '⚡'];

interface EducationProps {
  translations: Translations;
}

export default function Education({ translations: t }: EducationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="py-24 bg-secondary/30 dark:bg-secondary/30 overflow-x-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t.education.title}
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary via-accent to-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Education */}
          <div className="min-w-0">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3"
            >
              <span className="p-2 bg-primary/20 rounded-lg shrink-0">
                <GraduationCap className="w-6 h-6 text-primary" />
              </span>
              {t.education.educationTitle}
            </motion.h3>

            <div className="space-y-6">
              {t.education.items.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-colors overflow-hidden min-w-0">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span className="truncate">{edu.period}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-foreground wrap-break-word">{edu.degree} in {edu.field}</h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="wrap-break-word">{edu.institution}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="wrap-break-word">{edu.location}</span>
                      </div>
                    </CardHeader>
                    {edu.highlight && (
                      <CardContent className="pt-2">
                        <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent whitespace-normal text-left">
                          🇺🇸 {edu.highlight}
                        </Badge>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="min-w-0">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3"
            >
              <span className="p-2 bg-accent/20 rounded-lg shrink-0">
                <Award className="w-6 h-6 text-accent" />
              </span>
              {t.education.certificatesTitle}
            </motion.h3>

            <div className="space-y-4">
              {t.education.certificates.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border hover:border-accent/50 transition-colors overflow-hidden min-w-0">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0 text-base sm:text-xl md:text-2xl">
                        {certIcons[index] || '🔷'}
                      </div>
                      <div className="grow min-w-0 overflow-hidden">
                        <h4 className="text-foreground font-medium text-[11px] sm:text-xs md:text-sm leading-tight truncate sm:whitespace-normal sm:wrap-break-word">{cert.name}</h4>
                        <p className="text-muted-foreground text-[10px] sm:text-xs truncate">{cert.issuer} Certified</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 hidden sm:inline-flex">
                        {t.education.verified}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
