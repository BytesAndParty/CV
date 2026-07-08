import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  isInView: boolean;
}

/** Gradient section heading with underline - shared by all content sections. */
export function SectionHeading({ title, isInView }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="w-24 h-1 bg-linear-to-r from-primary via-accent to-primary mx-auto rounded-full" />
    </motion.div>
  );
}
