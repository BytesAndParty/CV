import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlowCard } from '@/components/ui/glow-card';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Wrench, Brain } from 'lucide-react';
import TechMarquee from './TechMarquee';
import type { Translations } from '../i18n/utils';

const categoryIcons = [Code2, Database, Wrench, Brain];

interface SkillsProps {
  translations: Translations;
}

function SkillBar({ name, level, delay, tooltip }: { name: string; level: number; delay: number; tooltip?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={`mb-3 ${tooltip ? 'skill-tooltip-wrapper cursor-help' : ''}`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-foreground font-medium">{name}</span>
        <span className="text-xs text-primary">{level}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full bg-linear-to-r from-primary to-accent rounded-full"
        />
      </div>
      {tooltip && (
        <div className="skill-tooltip">
          <div className="skill-tooltip-title">{name}</div>
          <div className="skill-tooltip-desc">{tooltip}</div>
        </div>
      )}
    </div>
  );
}

export default function Skills({ translations: t }: SkillsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t.skills.title}
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary via-accent to-primary mx-auto rounded-full" />
        </motion.div>

        {/* Tech Stack Marquee */}
        <TechMarquee title="Tech Stack" />

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {t.skills.categories.map((category, categoryIndex) => {
            const Icon = categoryIcons[categoryIndex];
            return (
              <motion.div
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
                        tooltip={(skill as { name: string; level: number; tooltip?: string }).tooltip}
                      />
                    ))}
                  </CardContent>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>

        {/* Languages */}
        <motion.div
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
        </motion.div>

        {/* Interests */}
        <motion.div
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
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={item.tooltip ? 'skill-tooltip-wrapper' : ''}
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
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
