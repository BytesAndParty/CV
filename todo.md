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

## Offen

### Dringend
- [ ] **E-Mail-Adresse verifizieren** - Site nutzt `rstickler98@gmail.com`, Account läuft auf `rstickler87@gmail.com` (Contact.tsx + cv-a4.html). Tippfehler?
- [ ] **Impressum + Datenschutzerklärung** - rechtlich erforderlich (§ 5 ECG, DSGVO; Kontaktformular!)

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
- [ ] Lucide Brand-Icons (Linkedin/Github/Instagram) deprecated → simple-icons/Inline-SVG
- [ ] cv-a4.html lädt noch Google Fonts (Print-Seite)
- [ ] Profilbild über astro:assets optimieren
- [ ] Vollständiger a11y-Audit (Screenreader, Kontraste)
- [ ] Test-Setup (Vitest; zuerst Game-Logik + Form-Validierung)

### Mögliche Erweiterungen
- [ ] **Referenzen/Testimonials** - Empfehlungen von Kollegen/Kunden?
- [ ] **Blog/Artikel** - Technische Artikel oder Gedanken?
- [ ] **Analytics** - Empfehlung: Umami oder Cloudflare Analytics (cookielos)
- [ ] **LinkedIn-Profil analysieren** und Verbesserungsvorschläge umsetzen

---

*Zuletzt aktualisiert: 08.07.2026*
