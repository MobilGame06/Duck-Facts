import { Controller } from '@hotwired/stimulus';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export default class extends Controller {
  static targets = ['hero', 'section', 'card', 'button', 'shape', 'duck'];

  connect() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Apply dark mode by default
    document.body.classList.add('dark-mode');

    this.setupAnimations();
  }

  setupAnimations() {
    this.setupHeroAnimations();
    this.setupScrollTriggers();
    this.setupButtonAnimations();
    this.setupFloatingShapes();
    this.setupNavbarScrollEffect();
    this.setupDuckAnimation();
  }

  setupHeroAnimations() {
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
  }

  setupScrollTriggers() {
    // Feature cards animation
    gsap.utils.toArray('.feature-card').forEach((card) => {
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

    // Fact cards animation
    gsap.utils.toArray('.fact-card').forEach((card) => {
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

    // Example cards animation
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
  }

  setupButtonAnimations() {
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
  }

  setupFloatingShapes() {
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
  }

  setupNavbarScrollEffect() {
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

  setupDuckAnimation() {
    gsap.to('.duck-illustration', {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // Method to animate fact cards when they are updated
  animateFactCards(cards) {
    gsap.fromTo(
      cards,
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
  }

  // Method to animate out existing elements
  animateOut(elements) {
    return new Promise((resolve) => {
      gsap.to(elements, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        onComplete: resolve,
      });
    });
  }

  // Method to animate button loading state
  animateButtonLoading(button) {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  }
}