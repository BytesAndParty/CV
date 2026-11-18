# Robert Stickler - CV Website

Modern, responsive CV website built with Astro, React, Tailwind CSS, and shadcn/ui.

## 🎨 Features

- **Dynamic Theme System**: Switch between 5 color schemes and light/dark mode
- **Smooth Animations**: Powered by Framer Motion
- **Fully Responsive**: Mobile-first design
- **Modern Stack**: Built with Astro 7, React 19, and Tailwind v4

## 🎨 Theme Switcher

The website includes a dynamic theme switcher in the navigation bar with:

**Color Schemes:**
- 🟢 Green/Mint (Default)
- 🟠 Orange/Amber
- 🟣 Purple/Pink
- 🔴 Red/Rose
- 🔵 Indigo/Blue

**Theme Modes:**
- ☀️ Light Mode
- 🌙 Dark Mode (Default)

All preferences are saved to `localStorage` and persist across sessions.

## 🚀 Commands

All commands use **Bun** as the package manager:

| Command          | Action                                       |
| :--------------- | :------------------------------------------- |
| `bun install`    | Installs dependencies                        |
| `bun run dev`    | Starts local dev server at `localhost:4321`  |
| `bun run build`  | Build production site to `./dist/`           |
| `bun run preview`| Preview build locally before deploying       |

## 📦 Tech Stack

- **Framework**: [Astro](https://astro.build) 7.x
- **UI Library**: [React](https://react.dev) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Package Manager**: [Bun](https://bun.sh)

## 📁 Project Structure

```text
/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   ├── Navigation.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Astro pages
│   └── styles/          # Global styles
│       └── global.css   # Tailwind + theme variables
└── package.json
```

## 🎯 Customization

### Modifying Content

Edit the component files in `src/components/` to update your information:
- `Hero.tsx` - Name, title, location
- `About.tsx` - Bio, stats, soft skills
- `Experience.tsx` - Work history
- `Skills.tsx` - Technical skills
- `Education.tsx` - Education & certifications
- `Contact.tsx` - Contact information

### Adding New Color Schemes

Edit `src/styles/global.css` and `src/components/ThemeSwitcher.tsx` to add new color options.

## 📝 License

Personal CV Website - All Rights Reserved
