import { m, useInView } from 'motion/react';
import { MotionProvider } from './MotionProvider';
import { useRef, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlowCard } from '@/components/ui/glow-card';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Wrench, Brain, Sparkles } from 'lucide-react';
import TechMarquee from './TechMarquee';
import { SectionHeading } from './SectionHeading';
import type { Translations } from '../i18n/utils';

const categoryIcons = [Code2, Database, Wrench, Brain];

interface SkillsProps {
  translations: Translations;
}

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-foreground font-medium">{name}</span>
        <span className="text-xs text-primary">{level}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <m.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full bg-linear-to-r from-primary to-accent rounded-full"
        />
      </div>
    </div>
  );
}

export default function Skills({ translations: t }: SkillsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Dismiss mobile hobby bottom-sheet flyouts on scroll
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      // Blur any focused tooltip wrapper to dismiss bottom sheet
      if (document.activeElement instanceof HTMLElement && document.activeElement.closest('.skill-tooltip-wrapper')) {
        document.activeElement.blur();
      }
      // Suppress hover-triggered tooltips while scrolling
      document.querySelectorAll('.skill-tooltip-wrapper').forEach(el => {
        el.classList.add('scroll-dismiss');
      });
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.querySelectorAll('.skill-tooltip-wrapper').forEach(el => {
          el.classList.remove('scroll-dismiss');
        });
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // fallow-ignore-next-line code-duplication -- Section-Boilerplate (Ref/InView), bewusst je Section dupliziert
  return (
    <MotionProvider>
    <section id="skills" className="py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.skills.title} isInView={isInView} />

        {/* Tech Stack Marquee */}
        <TechMarquee title="Tech Stack" />

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {t.skills.categories.map((category, categoryIndex) => {
            // Translations define the category count - never crash on a fifth one
            const Icon = categoryIcons[categoryIndex] ?? Code2;
            return (
              <m.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.15 }}
              >
                <GlowCard className="bg-card/50 h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={categoryIndex * 0.15 + skillIndex * 0.08}
                      />
                    ))}
                  </CardContent>
                </GlowCard>
              </m.div>
            );
          })}
        </div>

        {/* AI Development - plain chips, no level bars */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: t.skills.categories.length * 0.15 }}
          className="mt-6"
        >
          <GlowCard className="bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                {t.skills.ai.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {t.skills.ai.items.map((item) => (
                  <Badge key={item} variant="outline" className="px-3 py-1.5 border-primary/30 text-foreground">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </GlowCard>
        </m.div>

        {/* Languages */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <GlowCard className="bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-center">{t.skills.languages.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                {t.skills.languages.items.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg"
                  >
                    <span className="font-medium text-foreground">{lang.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlowCard>
        </m.div>

        {/* Interests */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <h3 className="text-lg text-muted-foreground mb-4">{t.skills.interests.title}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {t.skills.interests.items.map((interest, index) => {
              const item = typeof interest === 'string'
                ? { name: interest, tooltip: undefined }
                : interest as { name: string; tooltip?: string };
              return (
                <m.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                  whileHover={{ scale: 1.05, zIndex: 50 }}
                  className={item.tooltip ? 'skill-tooltip-wrapper relative' : ''}
                >
                  <Badge
                    variant="outline"
                    className={`px-4 py-2 hover:bg-primary/10 hover:border-primary/50 transition-colors border-primary/30 text-foreground ${item.tooltip ? 'cursor-help' : 'cursor-default'}`}
                  >
                    {item.name}
                  </Badge>
                  {item.tooltip && (
                    <div className="skill-tooltip">
                      <div className="skill-tooltip-title">{item.name}</div>
                      <div className="skill-tooltip-desc">{item.tooltip}</div>
                    </div>
                  )}
                </m.div>
              );
            })}
          </div>
        </m.div>
      </div>
    </section>
    </MotionProvider>
  );
}
