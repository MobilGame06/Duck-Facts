/**
 * Modern Duck Facts API Frontend
 * Handles all interactive functionality for the one-page design
 */

class DuckFactsApp {
  constructor() {
    this.currentLanguage = this.getCurrentLanguage();
    this.isDarkMode = this.getDarkModePreference();
    this.init();
  }

  init() {
    this.setupDarkModeToggle();
    this.setupLanguageSwitcher();
    this.setupSmoothScrolling();
    this.setupFactsLoader();
    this.setupAPITester();
    this.setupAnimations();
    this.applyInitialTheme();
  }

  // Language utilities
  getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || 'en';
  }

  // Dark mode utilities
  getDarkModePreference() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'enabled';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyInitialTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // Dark mode toggle functionality
  setupDarkModeToggle() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this.isDarkMode = !this.isDarkMode;
      this.updateDarkMode();
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        this.isDarkMode = e.matches;
        this.updateDarkMode(false);
      }
    });
  }

  updateDarkMode(savePreference = true) {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      if (savePreference) {
        localStorage.setItem('darkMode', 'enabled');
      }
    } else {
      document.body.classList.remove('dark-mode');
      if (savePreference) {
        localStorage.setItem('darkMode', 'disabled');
      }
    }

    // Add a small animation effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }

  // Language switcher functionality
  setupLanguageSwitcher() {
    const toggle = document.getElementById('languageDropdown');
    const dropdown = document.getElementById('langDropdown');
    
    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
      
      // Rotate the chevron
      const chevron = toggle.querySelector('i');
      if (chevron) {
        chevron.style.transform = dropdown.classList.contains('show') 
          ? 'rotate(180deg)' 
          : 'rotate(0deg)';
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
      const chevron = toggle.querySelector('i');
      if (chevron) {
        chevron.style.transform = 'rotate(0deg)';
      }
    });

    // Prevent dropdown close when clicking inside
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Smooth scrolling for navigation
  setupSmoothScrolling() {
    // Add navigation items if they exist
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add scroll-based navbar styling
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = this.isDarkMode 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.background = this.isDarkMode 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
        }
      }
    });
  }

  // Load more facts functionality
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

    // Show loading state
    const originalText = loadButton.innerHTML;
    loadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadButton.disabled = true;

    try {
      // Get 4 random facts
      const facts = await Promise.all([
        this.fetchRandomFact(),
        this.fetchRandomFact(),
        this.fetchRandomFact(),
        this.fetchRandomFact()
      ]);

      // Clear existing facts
      factsGrid.innerHTML = '';

      // Add new facts with animation
      facts.forEach((fact, index) => {
        if (fact) {
          const factCard = this.createFactCard(fact, index);
          factCard.style.opacity = '0';
          factCard.style.transform = 'translateY(20px)';
          factsGrid.appendChild(factCard);

          // Animate in
          setTimeout(() => {
            factCard.style.transition = 'all 0.5s ease';
            factCard.style.opacity = '1';
            factCard.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
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
      const response = await fetch(`/api/facts/random?lang=${this.currentLanguage}`);
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

    try {
      const response = await fetch(`/api/facts/random?lang=${this.currentLanguage}`);
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

  // Animation setup
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.feature-card, .fact-card, .example-card');
    animateElements.forEach(element => {
      observer.observe(element);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
      .feature-card, .fact-card, .example-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }
      
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Notification system
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
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
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;

    notification.querySelector('.notification-content').style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;

    notification.querySelector('.notification-close').style.cssText = `
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      margin-left: auto;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto close
    const autoClose = setTimeout(() => {
      this.closeNotification(notification);
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(autoClose);
      this.closeNotification(notification);
    });
  }

  closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      default: return 'info-circle';
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