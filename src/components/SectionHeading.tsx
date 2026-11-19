import type { CSSProperties } from 'react';

interface SectionHeadingProps {
  title: string;
}

/** Gradient section heading with underline - shared by all content sections. */
export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div
      data-reveal
      style={{ '--reveal-y': '50px' } as CSSProperties}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="w-24 h-1 bg-linear-to-r from-primary via-accent to-primary mx-auto rounded-full" />
    </div>
  );
}
