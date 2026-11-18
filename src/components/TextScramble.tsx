import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

interface TextScrambleProps {
  text: string;
  className?: string;
  /** Delay in ms between the element entering the viewport and the first scramble frame */
  delay?: number;
  /** Time in ms between two frames; one more character resolves per frame */
  speed?: number;
  /** Skip the effect when it would start later than this many ms after page load (slow devices) */
  skipAfter?: number;
}

/**
 * The real text is always the SSR / first-paint state, so crawlers, no-JS visitors
 * and reduced-motion users get the content untouched. After hydration a short
 * left-to-right scramble plays once. The real text stays in the flow (transparent,
 * selectable, read by screen readers) and the random characters are an absolutely
 * positioned overlay, so the box never changes size and copying yields the real text.
 */
export function TextScramble({ text, className = '', delay = 0, speed = 35, skipAfter }: TextScrambleProps) {
  const [scrambled, setScrambled] = useState<string | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (skipAfter !== undefined && performance.now() > skipAfter) return;

    // Interval handle lives in the effect scope so the cleanup can clear both timers
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      let revealed = 0;

      interval = setInterval(() => {
        if (revealed >= text.length) {
          clearInterval(interval);
          setScrambled(null);
          return;
        }

        setScrambled(
          text
            .split('')
            .map((char, index) =>
              char === ' ' || index < revealed ? char : chars[Math.floor(Math.random() * chars.length)]
            )
            .join('')
        );
        revealed += 1;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isInView, text, delay, speed, skipAfter]);

  return (
    <span ref={ref} className={className}>
      {scrambled === null ? (
        text
      ) : (
        <span className="relative inline-block">
          <span className="text-transparent">{text}</span>
          <span aria-hidden="true" className="absolute inset-0 select-none overflow-hidden whitespace-nowrap">
            {scrambled}
          </span>
        </span>
      )}
    </span>
  );
}
