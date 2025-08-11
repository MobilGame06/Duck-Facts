/**
 * Facts Controller
 * Handles loading and displaying duck facts from the API
 */

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['grid', 'loadButton'];

  connect() {
    this.currentLanguage = this.getCurrentLanguage();
  }

  // Action triggered when "Load More Facts" button is clicked
  async loadMore() {
    await this.loadRandomFacts();
  }

  async loadRandomFacts() {
    const factsGrid = this.gridTarget;
    const loadButton = this.loadButtonTarget;

    // Show loading state
    const originalText = loadButton.innerHTML;
    loadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadButton.disabled = true;

    // Get existing facts for animation
    const existingFacts = factsGrid.querySelectorAll('.fact-card');
    
    // Animate out existing facts if any
    if (existingFacts.length > 0) {
      const animationController = this.application.getControllerForElementAndIdentifier(
        document.querySelector('[data-controller*="animation"]'), 
        'animation'
      );
      if (animationController) {
        await animationController.animateOut(existingFacts);
      }
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

      // Animate in new facts
      const newFacts = factsGrid.querySelectorAll('.fact-card');
      const animationController = this.application.getControllerForElementAndIdentifier(
        document.querySelector('[data-controller*="animation"]'), 
        'animation'
      );
      if (animationController) {
        animationController.animateFactCards(newFacts);
      }
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

  getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || 'en';
  }

  showNotification(message, type) {
    // Dispatch custom event for notification controller
    const notificationEvent = new CustomEvent('show-notification', {
      detail: { message, type }
    });
    document.dispatchEvent(notificationEvent);
  }
}