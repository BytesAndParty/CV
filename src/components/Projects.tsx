import { m } from 'motion/react';
import { MotionProvider } from './MotionProvider';
import type { CSSProperties } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Folder } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import type { Translations } from '../i18n/utils';

interface ProjectsProps {
  translations: Translations;
}

export default function Projects({ translations: t }: ProjectsProps) {
  return (
    <MotionProvider>
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.projects.title} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Stagger by grid column: each row of the grid enters the viewport on its own */}
          {t.projects.items.map((project, index) => (
            <m.div
              key={project.title}
              data-reveal
              style={{ '--reveal-y': '50px', '--reveal-delay': `${(index % 2) * 200}ms` } as CSSProperties}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-colors h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                    {project.technologies.map((tech) => (
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
          ))}
        </div>
      </div>
    </section>
    </MotionProvider>
  );
}
