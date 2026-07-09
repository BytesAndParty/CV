# Refactor-Plan — CV Portfolio Website

*Erstellt: 2026-07-08 · Basis: fallow 3.2.0, astro check, manueller Code-Review (alle 33 Source-Files)*

## Executive Summary

Der Code ist strukturell gesund (Maintainability Index **90,9**, ⌀ Cyclomatic 2,1), aber es gibt:

- **6 funktionale Bugs** (P0), davon 2 in Produktion sichtbar (kaputter Hero-Hintergrund, wirkungslose Sprach-Detection)
- **29,3 % tote Exports** + 1 tote Datei + **~350 Zeilen ungenutztes CSS** (15 von 24 dokumentierten Effekt-Klassen werden nirgends verwendet)
- **4 Clone-Gruppen** (103 Zeilen, 2 %), v. a. der 5× duplizierte Section-Header
- **1 Komplexitäts-Hotspot**: `EasterEgg.tsx` (964 LOC, 45 Hooks, cognitive complexity 53, CRAP 240 — größter Churn-Hotspot der letzten 6 Monate)
- **Kein Linting, keine Tests** (bestätigt Projektanalyse.md)
- Offene TODOs aus `todo.md`/`CLAUDE.md`: Form-Validierung, Accessibility, Performance, 404-Seite

Build: ✅ fehlerfrei · astro check: 0 Errors, 10 Hints.

Legende: ✅ = wird in dieser Session umgesetzt · 📋 = geplant, braucht Entscheidung/Folge-Session

---

## 1. Bugs (Priorität P0 — funktional kaputt)

| # | Fund | Ort | Fix | Status |
|---|------|-----|-----|--------|
| 1 | **Netlify-Sprach-Detection greift nie.** `src/pages/index.astro` erzeugt statisches `/index.html` (Meta-Refresh → `/de/`). Netlify-Redirects ohne `!` schattieren existierende Dateien nicht → die `Language=en`-Regel in `_redirects` ist wirkungslos. | `public/_redirects`, `src/pages/index.astro` | Redirects forcen (`302!`) — lokales Dev-Verhalten bleibt unverändert | ✅ |
| 2 | **Hero „Morphing Gradient" rendert nicht.** `rgba(var(--theme-primary), 0.12)` mischt space-separated RGB (`16 185 129`) mit Komma-Alpha → invalid at computed-value time → Deklaration wird verworfen. | `global.css:731–751` | `rgb(var(--theme-primary) / 0.12)` Syntax | ✅ |
| 3 | **JSON-LD `sameAs` zeigt auf nicht existierende Profile** (`linkedin.com/in/robert-stickler`, `github.com/robert-stickler`). Echte Profile laut Contact: `robert-stickler-6b30b8258`, `BytesAndParty`. SEO-Schaden. | `Layout.astro:33–34` | Echte URLs eintragen | ✅ |
| 4 | **E-Mail-Diskrepanz:** Site verwendet 3× `rstickler98@gmail.com`, Account läuft auf `rstickler87@gmail.com`. | `Contact.tsx:79–80`, `cv-a4.html` | Vom Betreiber bestätigt (09.07.2026): `rstickler98` ist korrekt — kein Bug | ✅ |
| 5 | **Power-Up-Spawner: Timer-Leak + kaputter Guard.** Der „nur spawnen wenn keins da"-Check ist wirkungslos (Code darunter überschreibt trotzdem), und bei belegtem Feld wird `scheduleSpawn()` doppelt aufgerufen → exponentiell wachsende Timer-Ketten; nur der letzte Timer wird gecleart. | `EasterEgg.tsx:279–321` | Spawner restrukturieren (ein Timer, Ref-basierter Existenz-Check) | ✅ |
| 6 | **Unvalidierte localStorage-Werte crashen die Navigation.** `localStorage.colorScheme` wird ungeprüft gecastet; ein Altwert (README nannte mal 6 Schemes inkl. `slate`, Code kennt 5) → `colorSchemes[scheme]` ist `undefined` → Destructuring-TypeError in `updateFavicon` → React-Crash. | `ThemeSwitcher.tsx:45–47, 77` | Whitelist-Validierung beim Lesen | ✅ |

## 2. Bugs (P1 — Logik/Robustheit)

| # | Fund | Ort | Fix | Status |
|---|------|-----|-----|--------|
| 7 | **TextScramble Interval-Leak:** das `return () => clearInterval(...)` steht *im setTimeout-Callback* — Rückgabewerte von Timer-Callbacks werden ignoriert. Bei Unmount während der Animation läuft das Interval ewig weiter. | `TextScramble.tsx:47–72` | Interval-Handle im Effect-Scope halten, im Cleanup beides clearen | ✅ |
| 8 | **Side-Effects in setState-Updatern** (`setScore`/`setSnake`/`applySpeedEffect`/`spawnParticles` innerhalb von `setSnake`-/`setPowerUp`-Updatern). Updater müssen pur sein — unter StrictMode/Concurrent-Features würden Effekte doppelt feuern (Bonus +100 statt +50, Snake +10 Segmente). | `EasterEgg.tsx:324–425` | Game-Loop auf `useReducer` umstellen (Teil des EasterEgg-Refactorings, Phase 3) | 📋 |
| 9 | **Ctrl/Cmd+Shift+T-Shortcut:** zwei ThemeSwitcher-Instanzen (Desktop + Mobile-Dropdown) registrieren beide global den Listener → Doppel-Toggle wenn beide gemountet; zusätzlich hijackt der Shortcut den Browser-Standard „geschlossenen Tab wiederherstellen". | `ThemeSwitcher.tsx:128–138` | Shortcut entfernen oder auf konfliktfreie Taste legen | ✅ (entfernt) |
| 10 | **Toast-Timer:** neuer Toast wird vom 5s-Timer des vorherigen gelöscht; Timer werden bei Unmount nicht aufgeräumt. Gleiches Muster in EasterEgg (`showToastMessage`, `showPowerUpMessage`). | `Contact.tsx:102–105`, `EasterEgg.tsx:121–125, 273–276` | Timeout-Ref, clear bei neuem Toast + Unmount | ✅ |
| 11 | **Skills crasht bei >4 Kategorien:** `categoryIcons[categoryIndex]` liefert `undefined`, `<Icon />` wirft. Übersetzungen bestimmen die Anzahl. | `Skills.tsx:10, 91` | Fallback-Icon | ✅ |
| 12 | **CV-Download fragil:** `printWindow.addEventListener('load')` raced (wenn schon geladen, feuert nie), Popup-Blocker unbehandelt, Logik 2× dupliziert (Clone-Gruppe `dup:775b9b83`). Die Fallback-PDFs in `/public` werden nirgends verwendet. | `Hero.tsx:270–278`, `Contact.tsx:233–241` | Gemeinsamer Helper `src/lib/download-cv.ts` mit readyState-Check + PDF-Fallback bei blockiertem Popup | ✅ |
| 13 | **`theme-color` hardcoded** auf Grün — falsch für 4 von 5 Farbschemata. | `Layout.astro:57` | Beim Schemawechsel mitsetzen | ✅ |

## 3. Bugs/Smells (P2 — klein)

- `parseInt` ohne Radix/NaN-Guard (`Layout.astro:130`, `EasterEgg.tsx:117`) ✅
- Lucide **Brand-Icons deprecated** (`Linkedin`, `Github`, `Instagram` — astro check ts(6385)); Lucide entfernt Brand-Icons perspektivisch → mittelfristig auf Inline-SVGs (simple-icons) umstellen 📋
- Ungenutzter State: `direction` (`EasterEgg.tsx:56`), `isComplete` (`TextScramble.tsx:34`) ✅
- `@keyframes *`-Block ist invalides CSS, wird vom Parser verworfen (`global.css:79–81`) ✅
- `[data-motion]`-Regel wirkungslos — Framer Motion setzt kein solches Attribut (`global.css:84–86`) ✅
- **Universelle Transition auf `html *` + Pseudo-Elemente** (`global.css:68–76`): Perf-Antipattern, kollidiert potenziell mit Framer-Animationen. Ersatz: Transitions gezielt auf Farb-Properties der themenden Elemente 📋 (visuelle Regression möglich → separat testen)
- `opacity` auf `::-webkit-scrollbar-thumb` hat keine Wirkung (`global.css:97–119`) ✅
- `TechMarquee`-Titel „Tech Stack" nicht i18n-fähig (`Skills.tsx:87`) — kosmetisch 📋
- README nennt **6** Farbschemata (inkl. Slate), Code hat **5** → Doku-Drift ✅ (README korrigiert)

## 4. Dead Code (fallow dead-code + CSS-Grep)

**Fallow-Metriken:** dead files 2,9 % (1/34) · dead exports 29,3 % (17/58)

| Kategorie | Fund | Aktion | Status |
|---|---|---|---|
| Tote Datei | `src/components/ScrollRotate.tsx` (von keinem Entry Point erreichbar) | Löschen | ✅ |
| Tote Exports | `i18n/utils.ts`: `isValidLang`, `getLangFromUrl`, `getLocalizedPath` (75 % der Datei tot) | Löschen | ✅ |
| Tote Exports | `dropdown-menu.tsx` (9), `card.tsx` (3: `CardFooter`, `CardAction`, `CardDescription`), `badgeVariants`, `buttonVariants` | shadcn-Konvention, aber Single-App: ungenutzte Komponenten + Exports löschen (per shadcn-CLI jederzeit regenerierbar) | ✅ |
| Totes CSS | **15 ungenutzte Effekt-Klassen** (~350 Zeilen): `glow-border`, `gradient-border`, `magnetic-hover`, `text-gradient-animated`, `glass-card`, `spotlight-card`, `shimmer`, `tilt-card`, `animated-underline`, `pulse-ring`, `float-animation`, `reveal-up`, `stagger-children`, `neon-text`, `badge-hover`, dazu `scroll-rotate*`, `parallax-*`, `text-scramble*`-CSS, `blur-reveal-stagger` | Löschen + `CLAUDE.md`/`DESIGN.md` bereinigen | ✅ |
| Dependencies | fallow: `astro`, `@astrojs/react`, `@tailwindcss/vite` „test-only" (= nur Build-/Config-Imports). Statische Site → alles Build-Zeit; zusammen mit `@types/*` nach `devDependencies` | Verschieben (install-neutral) | ✅ |

**Danach gilt als Quality Gate:** `bunx fallow dead-code` → 0 files / 0 exports / 0 dupes vor jedem PR.

## 5. Duplikate (fallow dupes: 4 Clone-Gruppen, 103 Zeilen)

| Clone | Instanzen | Fix | Status |
|---|---|---|---|
| Section-Header (`dup:78b6d8d7`, 5×) | About, Education, Experience, Projects, Skills | `SectionHeading`-Komponente extrahieren | ✅ |
| CV-Download (`dup:775b9b83`) | Hero, Contact | → Bug #12, gemeinsamer Helper | ✅ |
| Page-Frontmatter (`dup:8ccaa2c8`) | `de/index.astro`, `en/index.astro` | Gemeinsame `CvPage`-Komponente oder `[lang]/index.astro` + `getStaticPaths` | 📋 (geringer Nutzen bei 2 Seiten, Astro-i18n-Umbau nur wenn mehr Seiten kommen) |

## 6. Komplexität (fallow health)

**Refactoring-Targets (Priorität nach fallow):**

1. **`EasterEgg.tsx` — 964 LOC, 45 Hooks, cognitive 53, Churn-Hotspot #1 (accelerating).** Plan:
   - Game-Logik in `useSnakeGame`-Hook mit `useReducer` (fixt zugleich Bug #8)
   - UI aufteilen: `SnakeBoard`, `GameOverlay`, `GameToast`
   - **Lazy Loading**: Modal per `React.lazy` erst beim Freischalten laden — hängt aktuell komplett im `client:load`-Navigation-Bundle (110 kB / 35 kB gzip) 📋
2. **`Contact.tsx` — 431 LOC:** `Toast` + `ContactForm` + `ContactInfo` extrahieren 📋
3. **`ThemeSwitcher.tsx`:** Theme-Lese/Schreib-Logik in `src/lib/theme.ts` bündeln (wird von FOUC-Script, Switcher und Favicon geteilt) 📋

`GlowCard` triggert außerdem pro Mousemove einen React-Re-Render des gesamten Karten-Subtrees → CSS-Variablen direkt am DOM-Node setzen (Ref statt State) 📋

## 7. Linting & Code-Qualität *(neu, wie besprochen)*

Setup gemäß Artelier-Standard:

- **ESLint 9 Flat Config** (`eslint.config.js`) mit:
  - `typescript-eslint` (type-aware: ungenutzte Vars, Type-Imports, `any`-Eskalation)
  - `eslint-plugin-react-hooks` (Rules of Hooks + `react-compiler`-Rule — hätte Bug #8 automatisch gefunden)
  - `eslint-plugin-react-refresh` (HMR-Safety)
  - `eslint-plugin-astro` (für `.astro`-Files)
  - `eslint-plugin-jsx-a11y` (zahlt aufs Accessibility-TODO ein)
- Script `bun lint`, alle Findings der Erstausführung fixen ✅
- 📋 Optional danach: `lint-staged` Pre-Commit, `fallow audit --base main` als zweites Gate, CI-Workflow

## 8. Restyling — „professioneller" 📋 *(Empfehlungen, bewusst nicht autonom umgesetzt)*

Geschmacksfragen → hier nur die Analyse + priorisierte Vorschläge. Objektive Punkte (a11y, DSGVO) sind in Phase „Offene TODOs" enthalten.

1. **Motion-Diät (größter Hebel):** Aktuell konkurrieren TextScramble (Name *und* Kontaktdaten), 3 animierte Blobs, Morphing-Gradient, Grain, Glow-Cards, Magnetic Buttons, 2 Marquee-Reihen und Skill-Bars. Ein Signature-Effekt (Vorschlag: GlowCard behalten), Scramble nur im Hero-Titel — bei E-Mail/Telefon stört er sogar die Nutzbarkeit (Copy-Paste während Animation).
2. **Skill-Prozente ersetzen:** „React 85 %" wirkt willkürlich und ist im CV-Design verpönt. Alternative: Gruppierung „Kernkompetenz / Vertraut / Grundlagen" oder Jahre + Kontext („React — 3 Jahre, 4 Projekte").
3. **Emoji-Icons ersetzen:** Cert-Icons `🔷☁️⚡` und `🇺🇸`-Badge durch echte Icons/Logos; wirkt sonst spielerisch statt seriös.
4. **Typografie konsistent:** `h1` nutzt `font-mono` ohne geladenen Mono-Font (System-Fallback) + `tracking-tighter`. Entweder bewusst JetBrains Mono laden (passt zum Scramble) oder auf Inter vereinheitlichen.
5. **Gradient-Text sparsamer:** identischer Verlauf auf jeder Section-Überschrift → nur im Hero, Sections mit klarer Typo-Hierarchie.
6. **Marquee reduzieren:** 2 Reihen × 24 Techs doppeln die Skills-Section — eine Reihe oder ersatzlos.
7. **Hero-CTAs: 3 → 2** („Mehr erfahren" scrollt nur; Kontakt + CV-Download reichen).
8. **`prefers-reduced-motion` respektieren** — aktuell ignoriert jede Animation die OS-Einstellung (auch a11y-Pflicht). ✅ *wird umgesetzt (CSS-Basis)*
9. **Impressum + Datenschutzerklärung fehlen komplett.** Für eine öffentliche Site mit Kontaktformular aus Österreich rechtlich erforderlich (§ 5 ECG, DSGVO) — und Google-Fonts-Einbindung via CDN ist in der EU heikel → **Fonts self-hosten** (`@fontsource`). Fonts: ✅ · Impressum/Datenschutz: ✅ (DE/EN unter `/{lang}/impressum` + `/{lang}/datenschutz`, Footer-Links; private „kleine Website" nach § 25 Abs. 5 MedienG)
10. **System-Theme respektieren:** Der Code enthält bereits den toten Pfad `systemPrefersDark ? 'dark' : 'dark'` — Light-Nutzer bekommen erzwungen Dark. Empfehlung: System-Präferenz als Default. 📋 (Design-Entscheidung)

## 9. Offene TODOs (aus todo.md / CLAUDE.md)

| TODO | Umsetzung | Status |
|---|---|---|
| **Form-Validierung** | Client-seitige Validierung (Name ≥ 2, E-Mail-Format, Nachricht ≥ 10) mit i18n-Fehlermeldungen + `aria-invalid`; HTML5-`required` bleibt | ✅ |
| **404-Seite** | `src/pages/404.astro`, zweisprachig, Netlify nutzt `/404.html` automatisch | ✅ |
| **Accessibility** | `prefers-reduced-motion`-Support, `role="dialog"`/`aria-modal` + Fokus-Management im Snake-Modal, Tastatur-Zugang zum EasterEgg-Trigger, `aria-label`s für Icon-Buttons | ✅ (Basis) / 📋 (vollständiger Audit mit Screenreader + Kontrast-Messung) |
| **Performance** | Fonts self-hosten (+ DSGVO), `test_only`-Deps aufgeräumt; 📋 Folge-Session: EasterEgg lazy-loaden, `astro:assets` fürs Profilbild, universelle Transition ersetzen, Lighthouse-Budget | teils ✅ |
| **Testimonials / Blog / Analytics** | Braucht Inhalte bzw. Account-Entscheidung (Empfehlung: **Umami** oder Cloudflare Analytics, beide cookielos) | 📋 |
| **LinkedIn-Profil analysieren** | Kein Code-Task — separat angehen | 📋 |
| `todo.md` veraltet (nennt PDF-Download als offen, ist erledigt) | Mit CLAUDE.md konsolidieren | ✅ |

## 10. Bewusst NICHT gemacht

- **E-Mail-Adresse geändert** (Bug #4) — erst verifizieren, welche stimmt
- **Full-Restyle** (Abschnitt 8) — Geschmacksentscheidungen gehören dir; Vorschläge liegen priorisiert vor
- **EasterEgg-Reducer-Umbau** (Bug #8) — 964-Zeilen-Umbau mit Gameplay-Risiko, gehört in eine eigene Session mit manuellem Spieltest
- **Astro-i18n-Routing-Umbau** — lohnt erst bei mehr als einer Seite pro Sprache
- **Test-Suite** (Vitest + Playwright) — sinnvoll, aber eigener Task; Priorität: `useSnakeGame`-Hook und Form-Validierung zuerst testbar machen

## Verifikation (je Phase)

```bash
bun run build          # muss fehlerfrei durchlaufen
bun x astro check      # 0 Errors
bun lint               # 0 Errors (ab Phase 7)
bunx fallow dead-code  # 0 files / 0 exports / 0 unlisted deps (ab Phase 4)
bunx fallow dupes      # Clone-Gruppen: nur noch de/en-Frontmatter (akzeptiert)
```

Manuell: Theme-Wechsel (alle 5 Schemes × light/dark), Sprach-Wechsel mit Scroll-Restore, Kontaktformular (Validierungsfehler + Erfolg), Snake-Game (Unlock, Power-Ups, Game Over, ESC), CV-Download mit und ohne Popup-Blocker.
