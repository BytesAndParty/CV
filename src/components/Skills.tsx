import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Wrench, Brain } from 'lucide-react';

const skillCategories = [
  {
    name: 'Programming & Frameworks',
    icon: Code2,
    skills: [
      { name: 'C# / .NET', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'JavaScript', level: 85 },
      { name: 'Next.js', level: 80 },
      { name: 'Astro', level: 75 },
      { name: 'Power Platform', level: 88 },
    ],
  },
  {
    name: 'Databases & Cloud',
    icon: Database,
    skills: [
      { name: 'SQL Server', level: 85 },
      { name: 'Firebase', level: 80 },
      { name: 'Azure Web Jobs', level: 78 },
      { name: 'Azure App Registration', level: 75 },
    ],
  },
  {
    name: 'Tools & Practices',
    icon: Wrench,
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Azure DevOps', level: 85 },
      { name: 'Agile/Scrum', level: 88 },
      { name: 'CI/CD', level: 75 },
    ],
  },
  {
    name: 'Business Skills',
    icon: Brain,
    skills: [
      { name: 'Solution Design', level: 85 },
      { name: 'Requirements Engineering', level: 88 },
      { name: 'Pre-Sales', level: 80 },
      { name: 'Effort Estimation', level: 82 },
    ],
  },
];

const languages = [
  { name: 'Deutsch', level: 'Muttersprache' },
  { name: 'English', level: 'Fluent' },
  { name: 'Dutch', level: 'Basic' },
];

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
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full bg-linear-to-r from-primary to-accent rounded-full"
        />
      </div>
    </div>
  );
}

export default function Skills() {
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
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Skills & Fähigkeiten
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.15 }}
            >
              <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <category.icon className="w-5 h-5 text-primary" />
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
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-center">Sprachen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                {languages.map((lang) => (
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
          </Card>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <h3 className="text-lg text-muted-foreground mb-4">Interessen</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Klettern',
              'Volleyball',
              'Skifahren',
              'Programmieren',
              'Lesen',
              'Schreiben',
              'Musik',
              'Team Events',
            ].map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-default hover:bg-primary/10 hover:border-primary/50 transition-colors"
                >
                  {interest}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
