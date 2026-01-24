import { useRef, useState, useCallback } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    setPosition({ x: distanceX, y: distanceY });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <Button
      ref={buttonRef}
      className={cn('magnetic-btn', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
