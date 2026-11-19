import { m } from 'motion/react';
import { MotionProvider } from './MotionProvider';
import { useEffect, type CSSProperties } from 'react';
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

/** The fill is at its level in the server HTML; it runs up from 0 when the surrounding card is revealed. */
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-foreground font-medium">{name}</span>
        <span className="text-xs text-primary">{level}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          style={{ '--level': `${level}%`, '--fill-delay': `${delay}ms` } as CSSProperties}
          className="skill-fill w-(--level) h-full bg-linear-to-r from-primary to-accent rounded-full"
        />
      </div>
    </div>
  );
}

export default function Skills({ translations: t }: SkillsProps) {
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

  return (
    <MotionProvider>
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.skills.title} />

        {/* Tech Stack Marquee */}
        <TechMarquee title="Tech Stack" />

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {t.skills.categories.map((category, categoryIndex) => {
            // Translations define the category count - never crash on a fifth one
            const Icon = categoryIcons[categoryIndex] ?? Code2;
            // Stagger by grid column: each row of the grid enters the viewport on its own
            const delay = (categoryIndex % 2) * 150;
            return (
              <div
                key={category.name}
                data-reveal
                style={{ '--reveal-y': '50px', '--reveal-delay': `${delay}ms` } as CSSProperties}
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
                        delay={delay + skillIndex * 80}
                      />
                    ))}
                  </CardContent>
                </GlowCard>
              </div>
            );
          })}
        </div>

        {/* AI Development - plain chips, no level bars */}
        <div data-reveal style={{ '--reveal-y': '50px' } as CSSProperties} className="mt-6">
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
        </div>

        {/* Languages */}
        <div data-reveal style={{ '--reveal-y': '30px' } as CSSProperties} className="mt-12">
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
        </div>

        {/* Interests */}
        <div data-reveal style={{ '--reveal-y': '30px' } as CSSProperties} className="mt-8 text-center">
          <h3 className="text-lg text-muted-foreground mb-4">{t.skills.interests.title}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {t.skills.interests.items.map((interest, index) => {
              const item = typeof interest === 'string'
                ? { name: interest, tooltip: undefined }
                : interest as { name: string; tooltip?: string };
              return (
                <m.div
                  key={item.name}
                  data-reveal
                  style={{
                    '--reveal-y': '0px',
                    '--reveal-scale': '0.8',
                    '--reveal-duration': '0.3s',
                    '--reveal-delay': `${200 + index * 50}ms`,
                  } as CSSProperties}
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
        </div>
      </div>
    </section>
    </MotionProvider>
  );
}
