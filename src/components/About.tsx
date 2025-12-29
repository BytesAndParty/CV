import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react';

const stats = [
  { value: '3+', label: 'Jahre Erfahrung', icon: Briefcase },
  { value: '4', label: 'MS Zertifikate', icon: Award },
  { value: 'Master', label: 'Software Engineering', icon: GraduationCap },
];

const softSkills = [
  'Leadership & Mentoring',
  'Self-Management',
  'Client Communication',
  'Problem-Solving',
  'Team Player',
  'Adaptability',
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Über mich
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-primary to-accent rounded-2xl rotate-6" />
              <div className="absolute inset-0 bg-card rounded-2xl overflow-hidden border border-border">
                <div className="w-full h-full bg-linear-to-br from-secondary to-card flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary">RS</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 md:right-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                <Users className="w-3 h-3 mr-1" />
                Avanade
              </Badge>
            </motion.div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Hallo, ich bin <span className="text-primary">Robert</span>
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Software Engineer & aspiring Solution Architect mit 3+ Jahren Erfahrung
              in Softwareentwicklung und Consulting bei <span className="text-primary font-medium">Avanade Austria</span>.
              Spezialisiert auf C#/.NET, Microsoft Power Platform und Full-Stack Web Development.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Ich bin erfahren in Requirements Engineering, Solution Design, Pre-Sales und
              Aufwandsschätzung. Meine Stärke liegt darin, skalierbare und automatisierte
              Lösungen zu konzipieren und direkt umzusetzen. Teamarbeit, Mentoring und
              Kundenkommunikation gehören zu meinem täglichen Geschäft.
            </p>

            {/* Soft Skills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {softSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
