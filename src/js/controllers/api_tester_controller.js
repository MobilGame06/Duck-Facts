import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['button'];

  connect() {
    this.currentLanguage = this.getCurrentLanguage();
  }

  // Action triggered when "Try API Now" button is clicked
  async test() {
    const button = this.buttonTarget;
    const originalText = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    button.disabled = true;

    // Add loading animation
    const animationController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller*="animation"]'),
      'animation'
    );
    if (animationController) {
      animationController.animateButtonLoading(button);
    }

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