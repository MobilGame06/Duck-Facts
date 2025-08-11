/**
 * Modern Duck Facts API Frontend with Stimulus Controllers
 * Enhanced build with Vite + SCSS + GSAP + Stimulus
 */

import '../scss/main.scss';
import '@fontsource/inter/latin-400.css'; // Latin characters
import '@fontsource/inter/latin-ext-400.css'; // Latin Extended for German chars (ä, ö, ü)
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { 
  faChevronDown, 
  faCode, 
  faRandom, 
  faGlobe, 
  faRocket, 
  faQuoteLeft, 
  faRefresh, 
  faPlay, 
  faHeart, 
  faSpinner, 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

// Add only the icons we need to the library
library.add(
  faChevronDown, 
  faCode,
  faRandom,
  faGlobe,
  faRocket,
  faQuoteLeft,
  faRefresh,
  faPlay,
  faHeart,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimes
);

// Replace any existing <i> tags with SVGs  
dom.watch();

// Stimulus application setup
import { Application } from '@hotwired/stimulus';
import {
  AnimationController,
  LanguageController,
  FactsController,
  NavigationController,
  NotificationController,
  ApiTesterController
} from './controllers';

// Start Stimulus application
const application = Application.start();

// Register controllers
application.register('animation', AnimationController);
application.register('language', LanguageController);
application.register('facts', FactsController);
application.register('navigation', NavigationController);
application.register('notification', NotificationController);
application.register('api-tester', ApiTesterController);

// Performance optimization: Preload critical resources
document.addEventListener('DOMContentLoaded', () => {
  // Preload API endpoint
  fetch('/api/facts/random').catch(() => {
    // Silently fail if preload doesn't work
  });
});
