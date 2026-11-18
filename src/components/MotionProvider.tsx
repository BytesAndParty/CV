import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

/**
 * Motion setup shared by all islands: every Astro island is its own React root, so each one
 * needs this provider. `m.*` components only animate inside it; `strict` flags a leftover `motion.*` in development.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
