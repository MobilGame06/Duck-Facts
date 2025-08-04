# Frontend Development Guide

## Build System Overview

This project uses **Vite** as the modern build tool for frontend assets, with **SCSS 7-1 architecture** and **GSAP animations**.

## Project Structure

```
src/
├── scss/
│   ├── abstracts/
│   │   ├── _variables.scss    # Color palette, typography, breakpoints
│   │   └── _mixins.scss       # Reusable mixins and utilities
│   ├── base/
│   │   ├── _reset.scss        # CSS reset and base styles
│   │   └── _typography.scss   # Typography scale and text utilities
│   ├── components/
│   │   ├── _buttons.scss      # Button styles and variants
│   │   ├── _navbar.scss       # Navigation components
│   │   ├── _cards.scss        # Card components
│   │   └── _animations.scss   # CSS animations and keyframes
│   ├── layout/
│   │   ├── _hero.scss         # Hero section layout
│   │   ├── _sections.scss     # General section layouts
│   │   └── _footer.scss       # Footer layout
│   └── main.scss              # Main entry point importing all modules
├── js/
│   └── main.js                # Main JavaScript with GSAP animations
└── index.html                 # Development HTML file
```

## Available Scripts

### Development

```bash
npm run dev:frontend    # Start Vite development server (port 5173)
npm run dev            # Start Express server (port 3000)
npm run dev:full       # Run both servers concurrently
```

### Production Build

```bash
npm run build         # Build for production (outputs to public/dist/)
npm run preview       # Preview production build
```

### Quality Assurance

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues automatically
npm run test          # Run Jest tests
npm run format        # Format code with Prettier
```

## SCSS 7-1 Architecture

The stylesheets follow the **7-1 pattern**:

1. **abstracts/** - Variables, mixins, functions (no CSS output)
2. **base/** - Reset, typography, base element styles
3. **components/** - Individual UI components
4. **layout/** - Layout-related sections
5. **pages/** - Page-specific styles (if needed)
6. **themes/** - Theme variations (dark mode handled in components)
7. **vendors/** - Third-party library styles

### Using Variables and Mixins

```scss
// Using color variables
.my-component {
  background: get-color(brand-primary);
  color: get-color(text-primary);

  @include dark-mode {
    background: get-color(dark-bg-primary);
    color: get-color(dark-text-primary);
  }
}

// Using responsive mixins
.responsive-component {
  padding: get-spacing(lg);

  @include tablet {
    padding: get-spacing(md);
  }

  @include mobile {
    padding: get-spacing(sm);
  }
}
```

## GSAP Animations

The project includes sophisticated GSAP animations:

- **Hero animations**: Staggered entrance effects
- **Scroll triggers**: Elements animate in as they enter viewport
- **Interactive animations**: Button hovers, fact loading
- **Smooth scrolling**: Enhanced navigation experience
- **Dark mode transitions**: Smooth theme switching

### Adding New Animations

```javascript
// Scroll-triggered animation
gsap.fromTo(
  '.my-element',
  {
    opacity: 0,
    y: 30,
  },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.my-element',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  }
);
```

## Responsive Design

The design system includes:

- **Breakpoints**: Mobile (480px), Tablet (768px), Desktop (1024px)
- **Flexible grids**: CSS Grid with auto-fit
- **Fluid typography**: Clamp functions for responsive text
- **Touch-friendly**: Optimized for mobile interaction

## Dark Mode

Dark mode is implemented with:

- CSS custom properties for theme colors
- JavaScript toggle functionality
- Smooth GSAP transitions
- Local storage persistence
- System preference detection

## Performance

- **Vite bundling**: Optimized production builds
- **Tree shaking**: Unused code elimination
- **Asset optimization**: Compressed CSS and JS
- **Modern syntax**: ES modules and modern CSS
- **Lazy loading**: GSAP plugins loaded on demand

## Browser Support

- Modern browsers supporting ES6+ modules
- CSS Grid and Flexbox support required
- GSAP handles browser compatibility for animations
