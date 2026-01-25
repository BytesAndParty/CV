import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail } from 'lucide-react';
import { TextScramble } from './TextScramble';
import type { Translations } from '../i18n/utils';

// Animated Pattern Mask Component - creates spotlight effect synchronized with blobs
function AnimatedPatternMask() {
  // Motion values for Spotlight 1 (top-left, synced with blob 1)
  const spot1X = useMotionValue(0);
  const spot1Y = useMotionValue(0);
  const spot1Scale = useMotionValue(1);

  // Motion values for Spotlight 2 (bottom-right, synced with blob 2)
  const spot2X = useMotionValue(0);
  const spot2Y = useMotionValue(0);
  const spot2Scale = useMotionValue(1);

  // Start animations synchronized with blob animations
  useEffect(() => {
    // Spotlight 1 - matches blob 1 animation (duration: 12s)
    const animation1X = animate(spot1X, [0, 60, 20, 0], {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    const animation1Y = animate(spot1Y, [0, 40, -20, 0], {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    const animation1Scale = animate(spot1Scale, [1, 1.2, 0.9, 1], {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut',
    });

    // Spotlight 2 - matches blob 2 animation (duration: 15s)
    const animation2X = animate(spot2X, [0, -70, -30, 0], {
      duration: 15,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    const animation2Y = animate(spot2Y, [0, -50, 20, 0], {
      duration: 15,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    const animation2Scale = animate(spot2Scale, [1, 1.3, 0.85, 1], {
      duration: 15,
      repeat: Infinity,
      ease: 'easeInOut',
    });

    return () => {
      animation1X.stop();
      animation1Y.stop();
      animation1Scale.stop();
      animation2X.stop();
      animation2Y.stop();
      animation2Scale.stop();
    };
  }, [spot1X, spot1Y, spot1Scale, spot2X, spot2Y, spot2Scale]);

  // Create dynamic mask image from motion values
  const maskImage = useTransform(
    [spot1X, spot1Y, spot1Scale, spot2X, spot2Y, spot2Scale],
    ([x1, y1, s1, x2, y2, s2]) => {
      // Base positions: 25% from edges for spot1, 75% for spot2
      // Spotlight radius: 450px (larger than blob 384px/192px radius)
      const radius1 = 450 * (s1 as number);
      const radius2 = 450 * (s2 as number);

      // Calculate positions (percentage + pixel offset)
      const pos1X = `calc(25% + ${x1}px)`;
      const pos1Y = `calc(25% + ${y1}px)`;
      const pos2X = `calc(75% + ${x2}px)`;
      const pos2Y = `calc(75% + ${y2}px)`;

      return `
        radial-gradient(circle ${radius1}px at ${pos1X} ${pos1Y}, black 30%, transparent 70%),
        radial-gradient(circle ${radius2}px at ${pos2X} ${pos2Y}, black 30%, transparent 70%)
      `;
    }
  );

  return (
    <motion.div
      className="absolute inset-0 -z-30 hero-decorative-pattern"
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
        maskComposite: 'add',
        WebkitMaskComposite: 'source-over',
      }}
    />
  );
}

interface HeroProps {
  translations: Translations;
}

export default function Hero({ translations: t }: HeroProps) {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Line Pattern Background with animated spotlight mask */}
      <AnimatedPatternMask />

      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 -z-20 hero-pattern" />

      {/* Morphing Gradient Background */}
      <div className="absolute inset-0 -z-10 morphing-gradient" />

      {/* Animated Blobs */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl opacity-60 dark:opacity-100"
          animate={{
            x: [0, 60, 20, 0],
            y: [0, 40, -20, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 dark:bg-accent/30 rounded-full blur-3xl opacity-60 dark:opacity-100"
          animate={{
            x: [0, -70, -30, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.3, 0.85, 1],
            rotate: [0, -120, -240, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Third blob for more visual interest */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-full blur-3xl opacity-50 dark:opacity-80"
          animate={{
            scale: [1, 1.15, 1, 0.9, 1],
            rotate: [0, 45, 90, 135, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <MapPin className="w-3 h-3 mr-1" />
              {t.hero.location}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 blur-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-foreground">
              <TextScramble text={t.hero.name} delay={400} speed={40} />
            </span>
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl mb-8 blur-reveal"
            style={{ animationDelay: '0.2s' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-semibold">
              {t.hero.title}
            </span>
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {['Power Platform', 'Dynamics 365', 'C# / .NET', 'Azure', 'TypeScript'].map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-sm border-primary/30 text-primary"
              >
                {tech}
              </Badge>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MagneticButton
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="w-4 h-4 mr-2" />
              {t.hero.cta}
            </MagneticButton>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/50 hover:bg-primary/10"
            >
              <motion.a
                href="#experience"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.hero.learnMore}
              </motion.a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
