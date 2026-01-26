import { useState, useEffect } from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Translations } from '../i18n/utils';

interface ThemeSwitcherProps {
  translations?: Translations;
}

type ColorScheme = 'green' | 'orange' | 'purple' | 'red' | 'blue';
type ThemeMode = 'light' | 'dark';

const colorSchemes: Record<ColorScheme, { name: string; hue: number; primary: string; accent: string }> = {
  green: { name: 'Green/Mint', hue: 165, primary: '#10b981', accent: '#14b8a6' },
  orange: { name: 'Orange/Amber', hue: 35, primary: '#f59e0b', accent: '#f97316' },
  purple: { name: 'Purple/Pink', hue: 300, primary: '#a855f7', accent: '#e879f9' },
  red: { name: 'Red/Rose', hue: 350, primary: '#ef4444', accent: '#f43f5e' },
  blue: { name: 'Indigo/Blue', hue: 240, primary: '#6366f1', accent: '#3b82f6' },
};

// Generate favicon SVG with dynamic colors
const generateFavicon = (primary: string, accent: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary}"/>
      <stop offset="100%" style="stop-color:${accent}"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#grad)"/>
  <text x="16" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="white" text-anchor="middle">RS</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const updateFavicon = (scheme: ColorScheme) => {
  const { primary, accent } = colorSchemes[scheme];
  const faviconUrl = generateFavicon(primary, accent);

  // Update existing favicon link or create new one
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (link) {
    link.href = faviconUrl;
  } else {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }

  // Also update apple-touch-icon
  let appleLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  if (appleLink) {
    appleLink.href = faviconUrl;
  }
};

export default function ThemeSwitcher({ translations }: ThemeSwitcherProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('green');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Detect system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Load saved preferences
    const savedColor = localStorage.getItem('colorScheme') as ColorScheme;
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;

    if (savedColor) setColorScheme(savedColor);
    if (savedMode) {
      setThemeMode(savedMode);
      document.documentElement.classList.toggle('dark', savedMode === 'dark');
    } else {
      // Use system preference or default to dark mode
      const defaultMode: ThemeMode = systemPrefersDark ? 'dark' : 'dark'; // Always default to dark as requested
      setThemeMode(defaultMode);
      document.documentElement.classList.toggle('dark', defaultMode === 'dark');
    }

    // Apply color scheme and update favicon
    applyColorScheme(savedColor || 'green');

    // Listen for system theme changes (optional enhancement)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply if user hasn't set a preference
      if (!localStorage.getItem('themeMode')) {
        const newMode: ThemeMode = e.matches ? 'dark' : 'light';
        setThemeMode(newMode);
        document.documentElement.classList.toggle('dark', newMode === 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyColorScheme = (scheme: ColorScheme) => {
    document.documentElement.setAttribute('data-color-scheme', scheme);
    updateFavicon(scheme);
  };

  const handleColorChange = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    applyColorScheme(scheme);
  };

  const handleThemeModeToggle = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    document.documentElement.classList.toggle('dark', newMode === 'dark');
  };

  // Keyboard shortcut: Ctrl+Shift+T (or Cmd+Shift+T on Mac)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        handleThemeModeToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [themeMode]);

  return (
    <div className="flex items-center gap-2">
      {/* Theme Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleThemeModeToggle}
        className="hover:bg-secondary relative overflow-hidden"
        title={`${themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} (Ctrl+Shift+T)`}
        aria-label={`Currently in ${themeMode} mode. Click to switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {themeMode === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Color Scheme Picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary"
            title="Change Color Scheme"
          >
            <Palette className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{translations?.nav.settings.colorScheme ?? 'Color Scheme'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(colorSchemes).map(([key, { name, hue }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleColorChange(key as ColorScheme)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `oklch(0.65 0.19 ${hue})` }}
              />
              <span>{name}</span>
              {colorScheme === key && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
