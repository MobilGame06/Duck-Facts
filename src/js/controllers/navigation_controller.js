/**
 * Navigation Controller
 * Handles smooth scrolling navigation
 */

import { Controller } from '@hotwired/stimulus';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export default class extends Controller {
  static targets = ['link'];

  connect() {
    gsap.registerPlugin(ScrollToPlugin);
  }

  // Action triggered when navigation link is clicked
  smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: targetElement,
          offsetY: 80,
        },
        ease: 'power2.out',
      });
    }
  }
}