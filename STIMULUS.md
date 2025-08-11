# Stimulus Controllers Documentation

## Overview

The Duck Facts application has been refactored to use **Stimulus controllers** for all interactive functionality. This ensures a modular, testable, and maintainable codebase that follows modern JavaScript patterns.

## Architecture

All functionality is now organized into focused Stimulus controllers, replacing the previous monolithic `DuckFactsApp` class:

### Controller Structure

```
src/js/controllers/
├── index.js                 # Exports all controllers
├── animation_controller.js   # GSAP animations and visual effects
├── api_tester_controller.js  # API testing functionality
├── facts_controller.js       # Duck facts loading and display
├── language_controller.js    # Language switching dropdown
├── navigation_controller.js  # Smooth scrolling navigation
└── notification_controller.js # Toast notifications
```

## Individual Controllers

### 1. Animation Controller (`animation_controller.js`)

**Purpose**: Handles all GSAP animations, scroll triggers, and visual effects.

**HTML Usage**:
```html
<body data-controller="animation">
  <!-- Elements will be automatically animated -->
</body>
```

**Features**:
- Hero section entrance animations
- Scroll-triggered animations for cards and sections
- Button hover effects
- Floating shapes animation
- Duck illustration animation
- Navbar scroll effects

**Methods**:
- `animateFactCards(cards)` - Animate new fact cards
- `animateOut(elements)` - Animate elements out with promise
- `animateButtonLoading(button)` - Add loading animation to buttons

### 2. Language Controller (`language_controller.js`)

**Purpose**: Manages the language switching dropdown functionality.

**HTML Usage**:
```html
<div class="language-switcher" data-controller="language">
  <button data-language-target="toggle" 
          data-action="click->language#toggle">
    🇺🇸 EN
    <i data-language-target="chevron"></i>
  </button>
  <div data-language-target="dropdown">
    <!-- Language options -->
  </div>
</div>
```

**Targets**:
- `toggle` - The dropdown toggle button
- `dropdown` - The dropdown menu container
- `chevron` - The chevron icon for rotation animation

**Actions**:
- `toggle()` - Toggle dropdown visibility with chevron animation

### 3. Facts Controller (`facts_controller.js`)

**Purpose**: Handles loading and displaying duck facts from the API.

**HTML Usage**:
```html
<section data-controller="facts">
  <div data-facts-target="grid">
    <!-- Fact cards will be inserted here -->
  </div>
  <button data-facts-target="loadButton" 
          data-action="click->facts#loadMore">
    Load More Facts
  </button>
</section>
```

**Targets**:
- `grid` - Container for fact cards
- `loadButton` - Button to load more facts

**Actions**:
- `loadMore()` - Load and display 4 new random facts

**Features**:
- Fetches facts from API with current language
- Animated transitions when loading new facts
- Error handling with notifications
- Loading state management

### 4. Navigation Controller (`navigation_controller.js`)

**Purpose**: Handles smooth scrolling navigation between sections.

**HTML Usage**:
```html
<nav data-controller="navigation">
  <a href="#api" 
     data-navigation-target="link"
     data-action="click->navigation#smoothScroll">
    Try API
  </a>
</nav>
```

**Targets**:
- `link` - Navigation links (optional, can work with any anchor link)

**Actions**:
- `smoothScroll()` - Smooth scroll to target section with GSAP

### 5. Notification Controller (`notification_controller.js`)

**Purpose**: Displays toast notifications with animations.

**HTML Usage**:
```html
<body data-controller="notification">
  <!-- Notifications will be dynamically inserted -->
</body>
```

**Features**:
- Listens for custom `show-notification` events
- Animated slide-in/out with GSAP
- Auto-close after 5 seconds
- Manual close button
- Support for different notification types (success, error, info)

**Usage from other controllers**:
```javascript
// Dispatch notification event
const notificationEvent = new CustomEvent('show-notification', {
  detail: { message: 'Success!', type: 'success' }
});
document.dispatchEvent(notificationEvent);
```

### 6. API Tester Controller (`api_tester_controller.js`)

**Purpose**: Handles API testing functionality.

**HTML Usage**:
```html
<section data-controller="api-tester">
  <button data-api-tester-target="button" 
          data-action="click->api-tester#test">
    Try API Now
  </button>
</section>
```

**Targets**:
- `button` - The API test button

**Actions**:
- `test()` - Test API endpoint and show result notification

## Adding New Controllers

### 1. Create Controller File

Create a new file in `src/js/controllers/` following the naming convention:

```javascript
// src/js/controllers/my_feature_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['element'];
  
  connect() {
    // Controller connected to DOM
    console.log('My feature controller connected');
  }
  
  myAction() {
    // Handle user interaction
  }
  
  disconnect() {
    // Cleanup when controller disconnected
  }
}
```

### 2. Register Controller

Add the controller to `src/js/controllers/index.js`:

```javascript
export { default as MyFeatureController } from './my_feature_controller.js';
```

Update `src/js/main.js` to register it:

```javascript
import { MyFeatureController } from './controllers';

application.register('my-feature', MyFeatureController);
```

### 3. Use in HTML

Add data attributes to your HTML:

```html
<div data-controller="my-feature">
  <button data-my-feature-target="element" 
          data-action="click->my-feature#myAction">
    Click me
  </button>
</div>
```

## Best Practices

### 1. Controller Separation
- Keep controllers focused on a single responsibility
- Use custom events for communication between controllers
- Avoid direct DOM manipulation outside of the controller's scope

### 2. Data Attributes
- Use semantic names for controllers (kebab-case)
- Be specific with target names
- Use action syntax consistently: `event->controller#method`

### 3. Animation Integration
- Access animation controller methods through the application:
```javascript
const animationController = this.application.getControllerForElementAndIdentifier(
  document.querySelector('[data-controller*="animation"]'), 
  'animation'
);
```

### 4. Error Handling
- Always handle API errors gracefully
- Use notifications to inform users of success/failure
- Provide loading states for async operations

### 5. Performance
- Use `connect()` for setup and `disconnect()` for cleanup
- Avoid memory leaks by removing event listeners in `disconnect()`
- Lazy load heavy dependencies when possible

## Benefits of Stimulus Architecture

### 1. Modularity
- Each controller has a single responsibility
- Easy to test individual features
- Clear separation of concerns

### 2. Maintainability
- Declarative HTML with data attributes
- No complex JavaScript selectors
- Self-documenting code structure

### 3. Scalability
- Easy to add new features without affecting existing code
- Controllers can be developed independently
- Progressive enhancement approach

### 4. Testing
- Controllers can be tested in isolation
- Clear API contracts through targets and actions
- Easier to mock dependencies

## Migration Notes

The previous monolithic `DuckFactsApp` class (~600 lines) has been split into 6 focused controllers:

- **Before**: Single class handling all functionality
- **After**: Modular controllers with clear responsibilities
- **Result**: Improved maintainability, testability, and code organization

All existing functionality has been preserved and enhanced with better error handling and user feedback.