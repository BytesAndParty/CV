import { useState, useEffect } from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ColorScheme = 'green' | 'orange' | 'purple' | 'red' | 'blue';
type ThemeMode = 'light' | 'dark';

const colorSchemes: Record<ColorScheme, { name: string; hue: number }> = {
  green: { name: 'Green/Mint', hue: 165 },
  orange: { name: 'Orange/Amber', hue: 35 },
  purple: { name: 'Purple/Pink', hue: 300 },
  red: { name: 'Red/Rose', hue: 350 },
  blue: { name: 'Indigo/Blue', hue: 240 },
};

export default function ThemeSwitcher() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('green');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Load saved preferences
    const savedColor = localStorage.getItem('colorScheme') as ColorScheme;
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;

    if (savedColor) setColorScheme(savedColor);
    if (savedMode) {
      setThemeMode(savedMode);
      document.documentElement.classList.toggle('dark', savedMode === 'dark');
    } else {
      // Default to dark mode
      setThemeMode('dark');
      document.documentElement.classList.add('dark');
    }

    // Apply color scheme
    if (savedColor) {
      applyColorScheme(savedColor);
    }
  }, []);

  const applyColorScheme = (scheme: ColorScheme) => {
    document.documentElement.setAttribute('data-color-scheme', scheme);
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

  return (
    <div className="flex items-center gap-2">
      {/* Theme Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleThemeModeToggle}
        className="hover:bg-secondary"
        title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {themeMode === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
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
          <DropdownMenuLabel>Farbschema</DropdownMenuLabel>
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
