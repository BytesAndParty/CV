import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGES, type Language } from '../i18n/config';

interface LanguageSwitcherProps {
  currentLang: Language;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const getNewPath = (newLang: Language) => {
    if (typeof window === 'undefined') return `/${newLang}/`;
    const path = window.location.pathname;
    const hash = window.location.hash;
    const newPath = path.replace(`/${currentLang}`, `/${newLang}`);
    return newPath + hash;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="w-5 h-5" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[10px] font-bold">
            {currentLang.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {(Object.entries(LANGUAGES) as [Language, { name: string; flag: string }][]).map(
          ([code, { name, flag }]) => (
            <DropdownMenuItem key={code} asChild className="cursor-pointer">
              <a
                href={getNewPath(code)}
                className="flex items-center gap-2 w-full"
              >
                <span>{flag}</span>
                <span>{name}</span>
                {currentLang === code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </a>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
