/**
 * Notification Controller
 * Handles toast notifications with GSAP animations
 */

import { Controller } from '@hotwired/stimulus';
import { gsap } from 'gsap';

export default class extends Controller {
  connect() {
    // Listen for custom notification events
    document.addEventListener('show-notification', this.handleNotificationEvent.bind(this));
  }

  handleNotificationEvent(event) {
    const { message, type } = event.detail;
    this.show(message, type);
  }

  show(message, type = 'info') {
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
        <button class="notification-close" data-action="click->notification#close">
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

    // Add data attribute for controller
    notification.setAttribute('data-controller', 'notification');
    notification.setAttribute('data-notification-element', 'true');

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
    this.autoCloseTimeout = setTimeout(() => {
      this.closeNotification(notification);
    }, 5000);

    // Store reference for manual close
    notification._controller = this;
    notification._autoCloseTimeout = this.autoCloseTimeout;
  }

  // Action triggered when close button is clicked
  close(event) {
    const notification = event.currentTarget.closest('.notification');
    if (notification && notification._autoCloseTimeout) {
      clearTimeout(notification._autoCloseTimeout);
    }
    this.closeNotification(notification);
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

  disconnect() {
    document.removeEventListener('show-notification', this.handleNotificationEvent.bind(this));
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }
}