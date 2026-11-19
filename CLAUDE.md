# CV Portfolio Website

Personal CV & Portfolio website for Robert Stickler - Software Engineer & Solution Architect.

## Tech Stack

- **Framework:** Astro 7.x mit React Integration
- **Styling:** Tailwind CSS 4.x + tw-animate-css
- **UI Components:** Radix UI (Dropdown, Label, Separator, Slot)
- **Animations:** Motion (`motion/react`, Nachfolger von framer-motion)
- **Icons:** Lucide React
- **Package Manager:** Bun
- **Node:** 24 (`.nvmrc`, Netlify liest sie ebenfalls); Astro 7 braucht mindestens 22.23.4
- **Deployment:** Netlify (mit Netlify Forms)

## Projektstruktur

```
CV/
├── src/
│   ├── components/           # React Komponenten
│   │   ├── ui/               # Shadcn/ui Basis-Komponenten
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   └── textarea.tsx
│   │   ├── About.tsx         # Über mich Section
│   │   ├── Contact.tsx       # Kontaktformular (Netlify Forms)
│   │   ├── Education.tsx     # Ausbildung Section
│   │   ├── Experience.tsx    # Berufserfahrung Section
│   │   ├── Hero.tsx          # Hero/Header Section
│   │   ├── LanguageSwitcher.tsx
│   │   ├── Navigation.tsx    # Hauptnavigation
│   │   ├── Projects.tsx      # Projekte Section
│   │   ├── Skills.tsx        # Skills/Technologien Section
│   │   └── ThemeSwitcher.tsx # Dark/Light + Farbschema
│   │
│   ├── i18n/                 # Internationalisierung
│   │   ├── config.ts         # Sprach-Konfiguration (de, en)
│   │   ├── utils.ts          # Translation Helper
│   │   └── translations/
│   │       ├── de.json       # Deutsche Übersetzungen
│   │       └── en.json       # Englische Übersetzungen
│   │
│   ├── layouts/
│   │   └── Layout.astro      # Haupt-Layout mit Theme-Init
│   │
│   ├── lib/
│   │   └── utils.ts          # cn() Helper für Tailwind
│   │
│   ├── pages/
│   │   ├── index.astro       # Redirect zu /de
│   │   ├── de/index.astro    # Deutsche Version
│   │   └── en/index.astro    # Englische Version
│   │
│   └── styles/
│       └── global.css        # Globale Styles + CSS-Effekte
│
├── public/
│   ├── favicon.svg           # RS Favicon
│   ├── profile.webp          # Profilbild
│   ├── cv-a4.html            # HTML-Version des CV (Print-Quelle, ?lang=de|en&color=green|...)
│   ├── cv-photo.jpg          # Kleines Foto (480 px) für den CV, hält das PDF klein
│   ├── fonts/                # Lokales Inter (latin) für cv-a4.html
│   ├── CV-RobertStickler-DE.pdf  # PDF Fallback (DE), aus cv-a4.html erzeugt
│   ├── CV-RobertStickler-EN.pdf  # PDF Fallback (EN), aus cv-a4.html erzeugt
│   ├── robots.txt            # SEO robots.txt
│   └── sitemap.xml           # SEO Sitemap
│
├── astro.config.mjs
├── components.json           # Shadcn/ui Konfiguration
├── package.json
├── tsconfig.json
└── todo.md                   # Projekt TODOs
```

## Befehle

```bash
bun dev       # Development Server starten
bun build     # Production Build
bun preview   # Production Build previewen
bun lint      # ESLint (Flat Config: typescript-eslint, react-hooks, astro, jsx-a11y)
bun check     # astro check (Typen)
bunx fallow   # Codebase-Analyse (dead code, dupes, health) - Gate: 0 dead files/exports

# CV-PDFs nach Änderungen an public/cv-a4.html neu erzeugen (macOS, Chrome)
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=public/CV-RobertStickler-DE.pdf "file://$PWD/public/cv-a4.html?lang=de&color=green"
"$CH" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=public/CV-RobertStickler-EN.pdf "file://$PWD/public/cv-a4.html?lang=en&color=green"
```

## Theming System

### Farbschemata
Das Projekt unterstützt 5 Farbschemata, gesteuert via `data-color-scheme` Attribut auf `<html>`:
- `green` (default) - Emerald/Teal
- `orange` - Amber/Orange
- `purple` - Violet/Fuchsia
- `red` - Red/Rose
- `blue` - Indigo/Blue

### Dark/Light Mode
- Gesteuert via `.dark` Klasse auf `<html>`
- Theme-Präferenz wird in localStorage gespeichert
- FOUC-Prevention im Layout.astro `<head>`

### CSS Variables
```css
--theme-primary: RGB-Werte (z.B. "16 185 129")
--theme-accent: RGB-Werte
--theme-hue: Hue-Wert für oklch() (z.B. 165)
```

## CSS-Effekte (global.css)

Nur tatsächlich verwendete Klassen (Details in DESIGN.md):
- `.cursor-glow-card` - Cursor-folgender Border-Glow (via GlowCard-Komponente)
- `.magnetic-btn` - Magnetischer Button (via MagneticButton-Komponente)
- `.marquee` / `.marquee-reverse` - Infinite-Scroll Tech-Leiste
- `.blur-reveal` - Blur-to-Sharp Einblendung (Hero)
- `.morphing-gradient` - Bewegter Gradient-Hintergrund (Hero)
- `.hero-pattern` / `.hero-decorative-pattern` - CSS-Patterns im Hero
- `.hero-text-scrim` - Dämpft den Glow hinter dem Hero-Text (Kontrast WCAG AA)
- `.grain-texture` - Film-Grain Overlay
- `[data-reveal]` / `.skill-fill` - Scroll-Reveal der Sections ohne JS-Abhängigkeit (Skript in Layout.astro, Details in DESIGN.md §12)
- `primary-ink` / `accent-ink` - Text-sichere Farbvarianten für den Hero-Titel (Kontrast >= 4,5:1)
- `.skill-tooltip` / `.skill-tooltip-wrapper` - Tooltips bzw. Mobile Bottom Sheets

## i18n System

- **Default Language:** Deutsch (`de`)
- **Supported Languages:** `de`, `en`
- **URL Routing:** `/de/`, `/en/`
- **Translations:** JSON-Dateien in `src/i18n/translations/`

### Verwendung:
```tsx
import { getTranslations } from '../i18n/utils';
const t = getTranslations('de');
// t.hero.title, t.about.description, etc.
```

## Komponenten-Architektur

Alle Sections verwenden:
- `client:load` - Für Navigation (sofort interaktiv)
- `client:visible` - Für Content-Sections (Lazy Loading)

Jede Section erhält `translations` prop für i18n.

Animationen: `m.*` statt `motion.*` (LazyMotion, spart ca. 15 KB gzip). Jede Insel (`client:*`) ist ein eigener React-Root und wickelt ihren Inhalt in `<MotionProvider>` (`src/components/MotionProvider.tsx`). Ein `m.*` außerhalb eines Providers wirft nicht, es animiert nur nie: Elemente mit `initial={{ opacity: 0 }}` bleiben unsichtbar. `drag`/`layout` bräuchten `domMax` statt `domAnimation`.

## TODOs

Single Source of Truth: `todo.md` (Status) und `REFACTOR-PLAN.md` (Analyse & Begründungen, Stand 2026-07-08).
Wichtigste offene Punkte: EasterEgg-Refactoring (useReducer + lazy), Restyling-Entscheidungen (Plan §8).
Erledigt: E-Mail-Adresse verifiziert (`rstickler98` korrekt, 09.07.2026), Impressum/Datenschutz (DE/EN).

## Netlify Deployment

- Site `robertstickler-cv`, per `netlify link` verknüpft (`.netlify/` ist gitignored), Production-Branch `main`
- Forms: `data-netlify="true"` im Contact-Formular (Astro rendert die Insel serverseitig, das Formular steht im statischen HTML) plus verstecktes Duplikat in `Layout.astro`; Netlify führt `contact` als ein Formular, bisher 0 Einsendungen (Stand 2026-11-18). Netlify entfernt `data-netlify` und `netlify-honeypot` im ausgelieferten HTML (Formularverarbeitung beim Deploy, normal)
- Build Command `bun run build` und Publish Directory `dist/` stehen in `netlify.toml` (deckt sich mit der Netlify-UI, geprüft 2026-11-18)
- Node: `.nvmrc`; in Netlify sind weder `NODE_VERSION` noch `BUN_VERSION` gesetzt
- Stand 2026-11-18: letzter Production-Deploy vom 2026-11-18 10:31 (`a783d8b` = `origin/main`, Live-Seite aktuell); der Refactor-Branch `refactor/analysis-fixes-2026-07` ist gemergt, Branch-Deploys sind aus
- Der Build-Log ist über die Netlify-API nicht abrufbar; ob `bun install` lief, zeigt nur das Deploy-Log in der Netlify-UI
- Netlify-MCP ist lokal registriert (Login über `/mcp` nötig); Rezepte zum Prüfen der Site: Skill `netlify`
