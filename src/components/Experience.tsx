import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, CheckCircle2 } from 'lucide-react';

const experiences = [
  {
    title: 'Software Engineer',
    company: 'Avanade Austria',
    location: 'Vienna',
    period: 'Feb 2022 – Present',
    highlights: [
      'Entwicklung und Automatisierung von Geschäftsprozessen mit Microsoft Power Platform und C#/.NET Backend',
      'Leitung der Digitalisierung und Automatisierung des Honorar-Systems (HN) für externe Mitarbeiter',
      'Aufbau eines sicheren Portals unter Einhaltung strenger Datenschutzanforderungen',
      'Automatisierte PDF-Generierung, Genehmigung und Rückgabe von ~500 Honoraren pro Woche für 50 aktive User',
      'Implementierung automatischer HN-Berechnung und verbessertes historisches Tracking (von Excel zu Datenbank)',
      'Verwaltung von SQL Server, Firebase und Azure Services (Web Jobs, App Registration)',
      'Erstellung technischer Spezifikationen, Requirements-Analyse und Pre-Sales Support',
      'Selbstständige Kundenberatung und Architekturentscheidungen',
      'Mentoring von Junior Developern und interne Schulungen',
    ],
    technologies: ['C# / .NET', 'Power Platform', 'SQL Server', 'Firebase', 'Azure', 'REST APIs'],
  },
  {
    title: 'Mechanical Engineer / Project Coordinator',
    company: 'Bernadorf Sondermaschinenbau',
    location: 'Austria',
    period: 'Feb 2019 – Dec 2020',
    highlights: [
      'Unterstützung bei Projektdurchführung und mechanischem Design',
      'Koordination zwischen verschiedenen Abteilungen',
      'Technische Dokumentation und Projektplanung',
    ],
    technologies: ['CAD', 'Project Management', 'Technical Documentation'],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-24 bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Berufserfahrung
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary via-accent to-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-accent to-primary" />

          {experiences.map((exp, index) => (
            <motion.div
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
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
                </motion.div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
