import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';

const education = [
  {
    degree: 'Master of Science in Software Engineering',
    institution: 'FH Technikum Wien',
    location: 'Vienna, Austria',
    period: 'Aug 2022 – Oct 2024',
    highlight: 'Exchange Semester: Iowa State University, USA (Jan – May 2023)',
  },
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'FH Technikum Wien',
    location: 'Vienna, Austria',
    period: 'Aug 2019 – June 2022',
  },
];

const certifications = [
  {
    name: 'Power Platform Functional Consultant Associate',
    issuer: 'Microsoft',
    icon: '🔷',
  },
  {
    name: 'Dynamics 365 Fundamentals (CRM)',
    issuer: 'Microsoft',
    icon: '🔷',
  },
  {
    name: 'Azure Fundamentals',
    issuer: 'Microsoft',
    icon: '☁️',
  },
  {
    name: 'Power Platform Fundamentals',
    issuer: 'Microsoft',
    icon: '⚡',
  },
];

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="py-24 bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Ausbildung & Zertifikate
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary via-accent to-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3"
            >
              <span className="p-2 bg-primary/20 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary" />
              </span>
              Ausbildung
            </motion.h3>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                        <Calendar className="w-4 h-4" />
                        {edu.period}
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">{edu.degree}</h4>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{edu.institution}</span>
                        <span>•</span>
                        <span>{edu.location}</span>
                      </div>
                    </CardHeader>
                    {edu.highlight && (
                      <CardContent className="pt-2">
                        <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent">
                          🇺🇸 {edu.highlight}
                        </Badge>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3"
            >
              <span className="p-2 bg-accent/20 rounded-lg">
                <Award className="w-6 h-6 text-accent" />
              </span>
              Microsoft Zertifikate
            </motion.h3>

            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <Card className="bg-card/50 border-border hover:border-accent/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0 text-2xl">
                        {cert.icon}
                      </div>
                      <div className="grow">
                        <h4 className="text-foreground font-medium text-sm">{cert.name}</h4>
                        <p className="text-muted-foreground text-xs">{cert.issuer} Certified</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
