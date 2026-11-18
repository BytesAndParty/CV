# CV Website - TODO

Details und Begründungen zu allen Punkten: siehe [REFACTOR-PLAN.md](REFACTOR-PLAN.md).

## Erledigt

- [x] **Profilbild** - Echtes Foto in About-Section eingebunden
- [x] **Mehrsprachigkeit** - DE/EN mit URL-Routing (`/de`, `/en`) und Sprach-Umschalter
- [x] **Projekte Section** - Honorarnoten-System und Mailjet-Dynamics Integration
- [x] **Kontaktformular Backend** - Netlify Forms integriert
- [x] **PDF Download** - Print-Version + Fallback-PDFs, mit Popup-Blocker-Fallback
- [x] **SEO Optimierung** - Open Graph, JSON-LD, robots.txt, sitemap.xml
- [x] **Bugfixes aus Code-Review (Juli 2026)** - Sprach-Redirects, Morphing-Gradient, JSON-LD-Links, Timer-Leaks, Theme-Validierung (siehe REFACTOR-PLAN.md Abschnitte 1-3)
- [x] **Dead Code entfernt** - ScrollRotate, ungenutzte Exports, ~350 Zeilen CSS
- [x] **Linting** - ESLint 10 Flat Config (`bun lint`), astro check (`bun check`)
- [x] **Form-Validierung** - Client-seitig mit lokalisierten Inline-Fehlern
- [x] **404-Seite** - Zweisprachig
- [x] **Accessibility-Basis** - prefers-reduced-motion, Dialog-Semantik im Snake-Modal, Tastatur-Zugang zum Easter Egg
- [x] **Fonts self-hosted** - @fontsource statt Google-Fonts-CDN (DSGVO + Performance)
- [x] **E-Mail-Adresse verifiziert** - `rstickler98@gmail.com` ist korrekt (bestätigt 09.07.2026)
- [x] **Impressum + Datenschutzerklärung** - DE/EN unter `/{lang}/impressum` und `/{lang}/datenschutz`, im Footer verlinkt
- [x] **CV neu gestaltet (18.11.2026)** - `cv-a4.html` modern, einseitig DE/EN, lokales Inter statt Google Fonts, Akzentfarben ≥ 4,5:1 Kontrast, Consultant-Stand + AI-Skills + AI-901; PDFs neu erzeugt (je 3,2 MB → 0,4 MB), Befehl in CLAUDE.md
- [x] **Lucide 1.x** - Brand-Icons (Linkedin/Github/Instagram) liegen lokal in `BrandIcons.tsx` (Glyphen aus lucide-react 0.562)

## Offen

### Inhalte (CV + Website aktualisieren)
- [ ] **Beförderung zum Consultant: genaues Datum klären** - offiziell ca. Juni 2026 (Jahr angenommen). Bis es feststeht, als Range/„ab Juni 2026" führen, in `de.json`/`en.json` (hero, about, experience) und im CV

### Refactoring (aus Fallow-Analyse)
- [ ] **EasterEgg.tsx umbauen** - 964 LOC, useReducer für Game-Loop (fixt Side-Effects in Updatern), React.lazy fürs Modal (Navigation-Bundle -X kB)
- [ ] **Contact.tsx aufteilen** - Toast/ContactForm/ContactInfo
- [ ] **GlowCard** - CSS-Variablen per Ref statt State (Re-Render pro Mousemove)
- [ ] **Universelle Transition auf `html *` ersetzen** - Perf-Antipattern (global.css)

### Restyling (Entscheidungen nötig - siehe REFACTOR-PLAN.md §8)
- [ ] Motion-Diät (ein Signature-Effekt, Scramble nur im Hero)
- [ ] Skill-Prozente durch Gruppen/Jahre ersetzen
- [ ] Emoji-Icons (Certs, Flaggen) durch echte Icons ersetzen
- [ ] Typografie: font-mono im h1 bewusst machen oder entfernen
- [ ] Hero-CTAs 3 → 2
- [ ] System-Theme-Präferenz als Default statt erzwungenem Dark

### Technisch
- [ ] Profilbild über astro:assets optimieren
- [ ] Vollständiger a11y-Audit (Screenreader, Kontraste)
- [ ] Test-Setup (Vitest; zuerst Game-Logik + Form-Validierung)

### Mögliche Erweiterungen
- [ ] **Referenzen/Testimonials** - Empfehlungen von Kollegen/Kunden?
- [ ] **Blog/Artikel** - Technische Artikel oder Gedanken?
- [ ] **Analytics** - Empfehlung: Umami oder Cloudflare Analytics (cookielos)
- [ ] **LinkedIn-Profil analysieren** und Verbesserungsvorschläge umsetzen

---

*Zuletzt aktualisiert: 18.11.2026*
