import { m, useInView } from 'motion/react';
import { MotionProvider } from './MotionProvider';
import { useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import type { Translations } from '../i18n/utils';

interface ExperienceProps {
  translations: Translations;
}

export default function Experience({ translations: t }: ExperienceProps) {
  // fallow-ignore-next-line code-duplication -- Section-Boilerplate (Ref/InView), bewusst je Section dupliziert
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <MotionProvider>
    <section id="experience" className="py-24 bg-secondary/30 dark:bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.experience.title} isInView={isInView} />

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-accent to-primary" />

          {t.experience.jobs.map((exp, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />

              {/* Content */}
              <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-12 md:pl-0`}>
                <m.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                        <Calendar className="w-4 h-4" />
                        {exp.period}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-accent">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                        <span className="text-muted-foreground">• {exp.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </m.div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />
            </m.div>
          ))}
        </div>
      </div>
    </section>
    </MotionProvider>
  );
}
