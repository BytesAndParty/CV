import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
const defaultPlaceholder = '0'; // Zero character for consistent initial display

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  placeholder?: string; // Character to show before animation starts (default: █)
}

// Generate initial placeholder text (deterministic, no random)
function generatePlaceholder(text: string, placeholderChar: string = defaultPlaceholder): string {
  return text
    .split('')
    .map((char) => (char === ' ' ? ' ' : placeholderChar))
    .join('');
}

export function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30,
  onComplete,
  placeholder = defaultPlaceholder,
}: TextScrambleProps) {
  // Use deterministic placeholder for SSR/hydration compatibility
  const [displayText, setDisplayText] = useState(() => generatePlaceholder(text, placeholder));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    // Interval handle must live in the effect scope: a cleanup returned from
    // the setTimeout callback is ignored, leaking the interval on unmount
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      let iteration = 0;
      const maxIterations = text.length;

      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
          onComplete?.();
        }

        iteration += 1 / 3;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isInView, text, delay, speed, onComplete]);

  return (
    <span
      ref={ref}
      className={className}
    >
      {displayText}
    </span>
  );
}
