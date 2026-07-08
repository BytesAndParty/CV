# Design & CSS Breakdown

Dokumentation der verwendeten Design-Techniken und CSS-Effekte, die diese Portfolio-Website auszeichnen.

---

## 1. Dynamic Color System

Das gesamte Farbschema der Seite ist vollständig dynamisch und wechselbar zur Laufzeit. Statt fest kodierter Farben basiert alles auf CSS Custom Properties mit `oklch()` Farbräumen.

**5 Farbschemata** (Green, Orange, Purple, Red, Blue) werden über ein `data-color-scheme` Attribut auf `<html>` gesteuert. Jedes Schema definiert nur drei Variablen:
- `--theme-primary` (RGB-Werte)
- `--theme-accent` (RGB-Werte)
- `--theme-hue` (für oklch-basierte Farben)

Alle weiteren Farben (Borders, Shadows, Muted, Cards, etc.) werden daraus abgeleitet. Sowohl Light als auch Dark Mode verwenden `oklch()` mit dem dynamischen `--theme-hue` Wert, was perceptually gleichmässige Farbübergänge garantiert.

**Smooth Theme Transitions:** Alle Elemente haben eine globale `transition` auf `background-color`, `border-color`, `color` und `box-shadow` (0.3s ease) - Farbschemawechsel fühlen sich deshalb flüssig an, nicht abrupt.

**Dynamic Favicon:** Beim Farbwechsel wird sogar das Favicon live als SVG mit den neuen Farben generiert und per `<link>` injiziert.

---

## 2. Cursor-Following Border Glow (GlowCard)

Jede Skill-Karte und Content-Card verwendet einen Cursor-folgenden Border-Glow-Effekt, implementiert als React-Komponente (`GlowCard`) + CSS.

**Wie es funktioniert:**
- `onMouseMove` trackt die Mausposition relativ zur Karte
- CSS Custom Properties `--glow-x`, `--glow-y`, `--glow-opacity` werden per `style` gesetzt
- Ein `::before` Pseudo-Element rendert einen `radial-gradient` (250px Radius) an der Mausposition
- Der Gradient wird durch eine `mask` + `mask-composite: exclude` Technik auf den 1px Border beschränkt
- Im Dark Mode ist der Glow intensiver

**Technik:** CSS Mask Compositing (`-webkit-mask-composite: xor` / `mask-composite: exclude`) schneidet den Innenbereich aus, sodass nur der Border leuchtet. Das ist die gleiche Technik, die Vercel und Stripe für ihre Card-Effekte verwenden.

---

## 3. Animated Gradient Border (Snake-Modal)

Das Snake-Game-Modal nutzt einen rotierenden Gradient-Border: ein absolut positionierter
Gradient-Layer mit `animate-[spin_12s_linear_infinite]` + `blur-sm` hinter einer
`inset-px`-Karte, sodass nur der 1px-Rand des Gradients sichtbar bleibt.

---

## 4. Glassmorphism

Mehrere Elemente verwenden den Glassmorphism-Effekt:
- `backdrop-filter: blur(12px)` für die Unschärfe des Hintergrunds
- Semi-transparente Hintergrundfarbe (`bg-card/80`, `bg-background/95`)
- Subtile Borders mit Theme-Farbe (`border-primary/20`)
- Eingesetzt bei: Navigation (beim Scrollen), Snake-Game Modal, Toast-Benachrichtigungen

---

## 5. Magnetic Buttons

Die CTA-Buttons im Hero-Bereich verwenden einen magnetischen Hover-Effekt:
- `onMouseMove` berechnet den Abstand des Cursors zum Button-Zentrum
- Der Button verschiebt sich um einen Bruchteil (`strength: 0.3`) in Richtung Cursor
- `cubic-bezier(0.4, 0, 0.2, 1)` sorgt für eine physikalisch ansprechende Bewegung
- Beim `mouseLeave` springt der Button smooth zurück auf Position (0, 0)

---

## 6. Text Scramble Animation

Der Hero-Titel verwendet einen "Hacker-Style" Text-Scramble-Effekt:
- Jeder Buchstabe beginnt als Platzhalter (`0`)
- Beim Scroll in den Viewport startet die Animation
- Buchstaben werden durch zufällige Zeichen (`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*`) ersetzt
- Von links nach rechts werden die echten Buchstaben eingesetzt (1/3 Buchstabe pro Frame)
- SSR-kompatibel durch deterministischen Initialzustand

---

## 7. Animated Pattern Mask (Hero)

Der Hero-Hintergrund zeigt ein Netzwerk/Circuit-Pattern, das durch animierte Spotlight-Masken sichtbar gemacht wird:

- Zwei Framer Motion Spotlights bewegen sich unabhängig (12s und 15s Zyklen)
- Die Bewegung wird über `useMotionValue` + `useTransform` in einen dynamischen `mask-image` String umgewandelt
- Zwei `radial-gradient` Kreise "beleuchten" das Pattern
- Das Pattern selbst besteht aus CSS-only Layered Backgrounds: Grid-Linien, Diagonale Verbindungen und Radial-Gradient Nodes

---

## 8. Infinite Scroll Marquee

Die Tech-Stack-Leiste verwendet eine rein CSS-basierte Infinite-Scroll-Animation:

- Duplizierter Content für nahtlosen Loop
- CSS `animation: marquee 120s linear infinite`
- `translateX(-50%)` Animation (da der Content 2x vorhanden ist)
- Fade-Edges via `::before`/`::after` Pseudo-Elemente mit Gradients
- Hover pausiert die Animation (`animation-play-state: paused`)

---

## 9. Morphing Gradient Background

Subtile, sich langsam bewegende Gradient-Hintergründe:
- 4-Stop Linear Gradient mit `-45deg`
- `background-size: 400% 400%` für Bewegungsraum
- `background-position` Animation über 12 Sekunden
- Unterschiedliche Opazitäten für Light/Dark Mode

---

## 10. Grain/Noise Texture

Ein subtiler Film-Grain-Effekt über dem gesamten Content:
- Inline SVG als `background-image` mit `feTurbulence` Filter (fractalNoise, baseFrequency: 0.65)
- Sehr niedrige Opacity (3.5% Light, 5% Dark)
- Über `isolation: isolate` und `z-index: 100` über allem, aber `pointer-events: none`
- Gibt der Seite einen analogen, hochwertigen Look

---

## 11. Blur Reveal Animation

Elemente erscheinen mit einem Blur-to-Sharp Effekt:
- Start: `filter: blur(12px)`, `opacity: 0`, `translateY(20px)`
- End: `filter: blur(0)`, `opacity: 1`, `translateY(0)`
- Kombiniert Unschärfe + Fade + Slide für einen Premium-Eindruck

---

## 12. Stagger Children Animations

Kinder-Elemente animieren nacheinander ein - via Framer Motion mit gestaffelten
`delay`-Props (`index * 0.1` bis `index * 0.3` je Section).

---

## 13. Fancy Skill Tooltips / Mobile Bottom Sheets

Die Hobby-Badges zeigen detaillierte Tooltips:

**Desktop:**
- Floating Card über dem Badge
- CSS Arrow mit `::after` Pseudo-Element (rotierter Square)
- Glass-Effekt Overlay via `::before`
- Pulsierender Dot im Titel (`pulse-dot` Animation)
- Smooth `translateY` + `opacity` Transition

**Mobile (< 640px):**
- Transformation zum Bottom Sheet (Full-Width, fixed am unteren Rand)
- `translateY(100%)` → `translateY(0)` Slide-Up Animation
- Drag-Handle Indicator (40px Bar oben)
- Auto-Dismiss beim Scrollen (JS-gesteuert via `.scroll-dismiss` Klasse)

---

## 14. Custom Scrollbar

Theme-aware Scrollbar:
- 8px Breite
- Track in `oklch(0.95 0 0)` (Light) / `oklch(0.15 0.01 hue)` (Dark)
- Thumb in der aktuellen Theme-Primary-Farbe
- Hover-State mit erhöhter Opacity

---

## 15. Hero Network/Circuit Pattern

Rein CSS-basiertes Netzwerk-Pattern ohne SVG oder Bilder:
- 5 Layer aus `linear-gradient` und `radial-gradient`
- Grid-Linien (horizontal + vertikal, 80px Spacing)
- Diagonale Verbindungslinien (45deg + -45deg)
- Node-Dots an Kreuzungspunkten (radial-gradient, 2px)
- Vignette-Overlay via `radial-gradient` Ellipse
- Unterschiedliche Intensitäten für Light/Dark Mode

---

## 16. Smooth Theme Transitions (FOUC Prevention)

Beim Laden der Seite wird im `<head>` ein Inline-Script ausgeführt, das:
- Dark Mode Präferenz aus `localStorage` liest
- Farbschema aus `localStorage` liest
- Beides sofort als Klasse/Attribut auf `<html>` setzt

Dadurch gibt es kein Flash of Unstyled Content (FOUC) - die Seite rendert direkt im richtigen Theme.

---

## 17. Easter Egg: Snake Game

Verstecktes Snake-Spiel, aktivierbar durch 10-maliges Klicken auf das Logo:
- Countdown-Animation (5...4...3...2...1...GO!) mit 3D Flip-Transitions
- Progressives Speed-System (langsamer Start, wird mit jedem Essen schneller)
- Power-Up-System mit komplementären Farben pro Farbschema
- Partikel-Explosionen beim Essen einsammeln
- Mobile D-Pad Controls + Swipe-Gestensteuerung
- High-Score Persistenz via `localStorage`
- Theme-aware Design (alle Farben passen sich dem gewählten Schema an)

---

## Design-Philosophie

### Was das Design auszeichnet:

1. **Kohärenz durch dynamisches Farbsystem** - Ein Farbschema steuert alles: von Shadows über Borders bis zu Scrollbar und Favicon. Nichts ist "hard-coded".

2. **Subtilität** - Die meisten Effekte sind bewusst zurückhaltend (3.5% Grain, 0.05 Opacity Patterns, 0.15 Opacity Glows). Sie addieren sich zu einem Premium-Gefühl, ohne einzeln aufzufallen.

3. **Physikalisch inspirierte Animationen** - Magnetic Buttons, Spring-Transitions (`damping: 25, stiffness: 300`), cubic-bezier Kurven - alles fühlt sich natürlich und responsiv an.

4. **Progressive Enhancement** - CSS-only Effekte (Patterns, Gradients, Scrollbar) funktionieren ohne JavaScript. Framer Motion und React-Komponenten fügen interaktive Layer hinzu.

5. **Performance** - GPU-beschleunigte Properties (`transform`, `opacity`, `filter`), `will-change` wo nötig, `pointer-events: none` auf dekorativen Elementen. Keine Layout-Shifts durch Animationen.

6. **Dark Mode als First-Class** - Nicht nur invertierte Farben, sondern eigenständiges Design mit angepassten Opazitäten, Shadow-Intensitäten und Glow-Stärken.

7. **Mobile-First UX** - Bottom Sheets statt Tooltips, Swipe-Gesten, angepasste Pattern-Grössen, reduzierte Animationen auf kleineren Screens.

8. **Attention to Detail** - Favicon-Generierung, Custom Scrollbar, Theme-aware Grain-Texture, koordinierte Spotlight-Masken - Details, die den Unterschied machen.
