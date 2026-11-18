import { m, useInView } from 'motion/react';
import { MotionProvider } from './MotionProvider';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import type { Translations } from '../i18n/utils';

interface AboutProps {
  translations: Translations;
}

export default function About({ translations: t }: AboutProps) {
  const stats = [
    { value: '4+', label: t.about.stats.experience, icon: Briefcase },
    { value: '5', label: t.about.stats.certificates, icon: Award },
    { value: 'Master', label: t.about.stats.degree, icon: GraduationCap },
  ];
  // fallow-ignore-next-line code-duplication -- Section-Boilerplate (Ref/InView), bewusst je Section dupliziert
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <MotionProvider>
    <section id="about" className="py-24 relative grain-texture" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.about.title} isInView={isInView} />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-primary to-accent rounded-2xl rotate-6" />
              <div className="absolute inset-0 bg-card rounded-2xl overflow-hidden border border-border">
                <img
                  src="/profile.webp"
                  alt="Robert Stickler"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badges - hidden on very small screens to prevent overflow */}
            <m.div
              className="absolute -top-4 right-0 sm:-right-4 md:right-8 hidden sm:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                <Users className="w-3 h-3 mr-1" />
                {t.about.company}
              </Badge>
            </m.div>
          </m.div>

          {/* Bio */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              {t.about.greeting} <span className="text-primary">{t.about.name}</span>
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t.about.bio1}
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t.about.bio2}
            </p>

            {/* Soft Skills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {t.about.softSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs border-primary/30 text-foreground">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {stats.map((stat, index) => (
                <m.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                    <CardContent className="p-2 sm:p-4 text-center">
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{stat.label}</div>
                    </CardContent>
                  </Card>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
    </MotionProvider>
  );
}
