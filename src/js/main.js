/**
 * Modern Duck Facts API Frontend with GSAP Animations
 * Enhanced build with Vite + SCSS + GSAP
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

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

class DuckFactsApp {
  constructor() {
    this.currentLanguage = this.getCurrentLanguage();
    this.init();
  }

  init() {
    // Apply dark mode by default
    document.body.classList.add('dark-mode');

    this.setupLanguageSwitcher();
    this.setupSmoothScrolling();
    this.setupFactsLoader();
    this.setupAPITester();
    this.setupGSAPAnimations();
  }

  // Language utilities
  getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || 'en';
  }

  // Language switcher functionality
  setupLanguageSwitcher() {
    const toggle = document.getElementById('languageDropdown');
    const dropdown = document.getElementById('langDropdown');

    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');

      // Animate the chevron with GSAP
      const chevron = toggle.querySelector('i');
      if (chevron) {
        gsap.to(chevron, {
          rotation: dropdown.classList.contains('show') ? 180 : 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
      const chevron = toggle.querySelector('i');
      if (chevron) {
        gsap.to(chevron, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Prevent dropdown close when clicking inside
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Enhanced smooth scrolling with GSAP
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
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
      });
    });

    // Enhanced navbar styling on scroll
    ScrollTrigger.create({
      start: 'top -50',
      end: 'max',
      onUpdate: (self) => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          const opacity = self.direction === 1 ? 0.98 : 0.95;
          const shadow =
            self.direction === 1 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none';

          gsap.to(navbar, {
            backgroundColor: `rgba(15, 23, 42, ${opacity})`,
            boxShadow: shadow,
            duration: 0.3,
          });
        }
      },
    });
  }

  // Load more facts functionality with enhanced animations
  setupFactsLoader() {
    const loadButton = document.getElementById('loadMoreFacts');
    if (!loadButton) return;

    loadButton.addEventListener('click', async () => {
      await this.loadRandomFacts();
    });
  }

  async loadRandomFacts() {
    const factsGrid = document.querySelector('.facts-grid');
    const loadButton = document.getElementById('loadMoreFacts');

    if (!factsGrid || !loadButton) return;

    // Show loading state with GSAP
    const originalText = loadButton.innerHTML;
    loadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadButton.disabled = true;

    // Animate out existing facts
    const existingFacts = factsGrid.querySelectorAll('.fact-card');
    if (existingFacts.length > 0) {
      await new Promise((resolve) => {
        gsap.to(existingFacts, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          stagger: 0.05,
          onComplete: resolve,
        });
      });
    }

    try {
      // Get 4 random facts
      const facts = await Promise.all([
        this.fetchRandomFact(),
        this.fetchRandomFact(),
        this.fetchRandomFact(),
        this.fetchRandomFact(),
      ]);

      // Clear existing facts
      factsGrid.innerHTML = '';

      // Add new facts
      facts.forEach((fact, index) => {
        if (fact) {
          const factCard = this.createFactCard(fact, index);
          factCard.style.opacity = '0';
          factCard.style.transform = 'translateY(30px)';
          factsGrid.appendChild(factCard);
        }
      });

      // Animate in new facts with GSAP
      const newFacts = factsGrid.querySelectorAll('.fact-card');
      gsap.fromTo(
        newFacts,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        }
      );
    } catch (error) {
      console.error('Error loading facts:', error);
      this.showNotification('Error loading facts. Please try again.', 'error');
    } finally {
      // Reset button
      loadButton.innerHTML = originalText;
      loadButton.disabled = false;
    }
  }

  async fetchRandomFact() {
    try {
      const response = await fetch(
        `/api/facts/random?lang=${this.currentLanguage}`
      );
      if (!response.ok) throw new Error('Failed to fetch fact');

      const data = await response.json();
      return data.fact;
    } catch (error) {
      console.error('Error fetching random fact:', error);
      return null;
    }
  }

  createFactCard(fact, index) {
    const card = document.createElement('div');
    card.className = 'fact-card';
    card.innerHTML = `
      <div class="fact-icon">
        <i class="fas fa-quote-left"></i>
      </div>
      <p class="fact-text">${fact}</p>
      <div class="fact-number">#${index + 1}</div>
    `;
    return card;
  }

  // API testing functionality
  setupAPITester() {
    const testButton = document.getElementById('tryApiBtn');
    if (!testButton) return;

    testButton.addEventListener('click', async () => {
      await this.testAPI();
    });
  }

  async testAPI() {
    const button = document.getElementById('tryApiBtn');
    if (!button) return;

    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    button.disabled = true;

    // Add loading animation
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    try {
      const response = await fetch(
        `/api/facts/random?lang=${this.currentLanguage}`
      );
      if (!response.ok) throw new Error('API test failed');

      const data = await response.json();

      // Show success notification with the fact
      this.showNotification(
        `API Test Successful! Random fact: "${data.fact}"`,
        'success'
      );
    } catch (error) {
      console.error('API test error:', error);
      this.showNotification('API test failed. Please try again.', 'error');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  // GSAP Animations setup
  setupGSAPAnimations() {
    // Hero animations
    const heroTimeline = gsap.timeline();

    heroTimeline
      .from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
      })
      .from(
        '.hero-subtitle',
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.5'
      )
      .from(
        '.hero-buttons .btn',
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      )
      .from(
        '.duck-illustration',
        {
          opacity: 0,
          scale: 0.8,
          rotation: -10,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=0.8'
      )
      .from(
        '.stats .stat',
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        '-=0.4'
      );

    // Scroll-triggered animations for sections
    gsap.utils.toArray('.feature-card').forEach((card, _index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    gsap.utils.toArray('.fact-card').forEach((card, _index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 30,
          rotation: -5,
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    gsap.utils.toArray('.example-card').forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Floating shapes animation enhancement
    gsap.utils.toArray('.shape').forEach((shape, index) => {
      gsap.to(shape, {
        y: 'random(-30, 30)',
        x: 'random(-20, 20)',
        rotation: 'random(-45, 45)',
        duration: 'random(4, 8)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * 0.5,
      });
    });

    // Enhanced button hover animations
    gsap.utils.toArray('.btn').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    // Duck illustration continuous animation
    gsap.to('.duck-illustration', {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // Enhanced notification system with GSAP
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      gsap.to(existing, {
        x: 400,
        opacity: 0,
        duration: 0.3,
        onComplete: () => existing.remove(),
      });
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      zIndex: '10000',
      background:
        type === 'success'
          ? '#10b981'
          : type === 'error'
            ? '#ef4444'
            : '#3b82f6',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      transform: 'translateX(100%)',
    });

    document.body.appendChild(notification);

    // Animate in with GSAP
    gsap.fromTo(
      notification,
      {
        x: 400,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }
    );

    // Auto close
    const autoClose = setTimeout(() => {
      this.closeNotification(notification);
    }, 5000);

    // Manual close
    notification
      .querySelector('.notification-close')
      .addEventListener('click', () => {
        clearTimeout(autoClose);
        this.closeNotification(notification);
      });
  }

  closeNotification(notification) {
    gsap.to(notification, {
      x: 400,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      },
    });
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'exclamation-circle';
      default:
        return 'info-circle';
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DuckFactsApp();
});

// Performance optimization: Preload critical resources
document.addEventListener('DOMContentLoaded', () => {
  // Preload API endpoint
  fetch('/api/facts/random').catch(() => {
    // Silently fail if preload doesn't work
  });
});
