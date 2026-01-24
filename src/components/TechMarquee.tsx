import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Duplicate items for seamless loop
  const duplicatedTech = [...techStack, ...techStack];

  return (
    <div ref={ref} className="py-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h3 className="text-lg text-muted-foreground">{title}</h3>
      </motion.div>

      {/* First row - normal direction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
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
      </motion.div>

      {/* Second row - reverse direction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="marquee marquee-reverse"
      >
        <div className="marquee-content">
          {[...duplicatedTech].reverse().map((tech, index) => (
            <Badge
              key={`${tech.name}-reverse-${index}`}
              variant="outline"
              className="px-4 py-2 text-sm whitespace-nowrap border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-default"
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
