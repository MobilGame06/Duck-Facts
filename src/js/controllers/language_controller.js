/**
 * Language Controller
 * Handles language switching dropdown functionality
 */

import { Controller } from '@hotwired/stimulus';
import { gsap } from 'gsap';

export default class extends Controller {
  static targets = ['toggle', 'dropdown', 'chevron'];

  connect() {
    this.currentLanguage = this.getCurrentLanguage();
    this.setupEventListeners();
  }

  // Action triggered when toggle button is clicked
  toggle(event) {
    event.stopPropagation();
    this.dropdownTarget.classList.toggle('show');

    // Animate the chevron with GSAP
    if (this.hasChevronTarget) {
      gsap.to(this.chevronTarget, {
        rotation: this.dropdownTarget.classList.contains('show') ? 180 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  // Close dropdown when clicking outside
  setupEventListeners() {
    document.addEventListener('click', this.closeDropdown.bind(this));
    
    // Prevent dropdown close when clicking inside
    this.dropdownTarget.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  closeDropdown() {
    this.dropdownTarget.classList.remove('show');
    if (this.hasChevronTarget) {
      gsap.to(this.chevronTarget, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || 'en';
  }

  disconnect() {
    document.removeEventListener('click', this.closeDropdown.bind(this));
  }
}