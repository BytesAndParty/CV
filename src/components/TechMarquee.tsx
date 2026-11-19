import type { CSSProperties } from 'react';
import { Badge } from '@/components/ui/badge';

const techStack = [
  // Languages
  { name: 'C#', category: 'language' },
  { name: 'TypeScript', category: 'language' },
  { name: 'JavaScript', category: 'language' },
  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'Astro', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  // Backend
  { name: '.NET', category: 'backend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Bun', category: 'backend' },
  // Database
  { name: 'SQL Server', category: 'database' },
  { name: 'Firebase', category: 'database' },
  // Cloud/DevOps
  { name: 'Azure', category: 'cloud' },
  { name: 'Docker', category: 'cloud' },
  { name: 'GitHub Actions', category: 'cloud' },
  { name: 'Azure DevOps', category: 'cloud' },
  // Microsoft
  { name: 'Power Platform', category: 'microsoft' },
  { name: 'Power Automate', category: 'microsoft' },
  { name: 'Power Apps', category: 'microsoft' },
  { name: 'Dynamics 365', category: 'microsoft' },
  { name: 'Dataverse', category: 'microsoft' },
  { name: 'SharePoint', category: 'microsoft' },
  // Tools
  { name: 'Git', category: 'tools' },
];

interface TechMarqueeProps {
  title?: string;
}

export default function TechMarquee({ title = "Tech Stack" }: TechMarqueeProps) {
  // Duplicate items for seamless loop
  const duplicatedTech = [...techStack, ...techStack];

  return (
    <div className="py-12 overflow-hidden">
      <div data-reveal className="text-center mb-8">
        <h3 className="text-lg text-muted-foreground">{title}</h3>
      </div>

      {/* First row - normal direction */}
      <div
        data-reveal
        style={{ '--reveal-y': '0px', '--reveal-delay': '0.2s' } as CSSProperties}
        className="marquee mb-4"
      >
        <div className="marquee-content">
          {duplicatedTech.map((tech, index) => (
            <Badge
              key={`${tech.name}-${index}`}
              variant="outline"
              className="px-4 py-2 text-sm whitespace-nowrap border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Second row - reverse direction */}
      <div
        data-reveal
        style={{ '--reveal-y': '0px', '--reveal-delay': '0.4s' } as CSSProperties}
        className="marquee marquee-reverse"
      >
        <div className="marquee-content">
          {duplicatedTech.toReversed().map((tech, index) => (
            <Badge
              key={`${tech.name}-reverse-${index}`}
              variant="outline"
              className="px-4 py-2 text-sm whitespace-nowrap border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
