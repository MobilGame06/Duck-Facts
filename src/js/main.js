import '../scss/main.scss';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-ext-400.css';
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

dom.watch();

import { Application } from '@hotwired/stimulus';
import {
  AnimationController,
  LanguageController,
  FactsController,
  NavigationController,
  NotificationController,
  ApiTesterController
} from './controllers';

const application = Application.start();

application.register('animation', AnimationController);
application.register('language', LanguageController);
application.register('facts', FactsController);
application.register('navigation', NavigationController);
application.register('notification', NotificationController);
application.register('api-tester', ApiTesterController);

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/facts/random').catch(() => {
  });
});
