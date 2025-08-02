// ===== ACCESSIBILITY MANAGER =====

class AccessibilityManager {
  constructor() {
    this.isVoiceEnabled = false;
    this.isElderlyMode = false;
    this.isHighContrast = false;
    this.currentFontSize = 'medium';
    this.keyboardNavigationEnabled = false;
    this.screenReaderActive = false;
    
    this.init();
  }

  // Initialize accessibility manager
  init() {
    console.log('Initializing Accessibility Manager...');
    
    this.detectScreenReader();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupGestureSupport();
    this.setupVoiceCommands();
    this.loadAccessibilityPreferences();
  }

  // Detect screen reader
  detectScreenReader() {
    // Check for common screen readers
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaders = ['nvda', 'jaws', 'voiceover', 'talkback', 'orca'];
    
    this.screenReaderActive = screenReaders.some(sr => userAgent.includes(sr));
    
    // Also check for screen reader-specific accessibility features
    if ('speechSynthesis' in window || document.documentElement.hasAttribute('aria-live')) {
      this.screenReaderActive = true;
    }
    
    if (this.screenReaderActive) {
      document.body.classList.add('screen-reader-active');
      this.enhanceForScreenReader();
    }
  }

  // Enhance for screen reader users
  enhanceForScreenReader() {
    // Add more descriptive labels
    this.addDescriptiveLabels();
    
    // Add landmark roles
    this.addLandmarkRoles();
    
    // Enhance form labels
    this.enhanceFormLabels();
    
    // Add live regions
    this.enhanceLiveRegions();
  }

  // Add descriptive labels
  addDescriptiveLabels() {
    // Add labels to unlabeled buttons
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('.nav-icon, .action-icon');
        if (icon) {
          const context = button.closest('.nav-item, .action-card');
          if (context) {
            const label = context.querySelector('.nav-label, span');
            if (label) {
              button.setAttribute('aria-label', label.textContent.trim());
            }
          }
        }
      }
    });

    // Add labels to input fields
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      const label = input.closest('.form-group')?.querySelector('label');
      if (label && !input.id) {
        const id = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        input.id = id;
        label.setAttribute('for', id);
      }
    });
  }

  // Add landmark roles
  addLandmarkRoles() {
    // Main content areas
    const dashboardMain = document.querySelector('.dashboard-main');
    if (dashboardMain) {
      dashboardMain.setAttribute('role', 'main');
      dashboardMain.setAttribute('aria-label', 'Dashboard content');
    }

    // Navigation areas
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.setAttribute('role', 'navigation');
      bottomNav.setAttribute('aria-label', 'Main navigation');
    }

    // Form areas
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('role', 'form');
      const formTitle = form.querySelector('h1, h2, h3');
      if (formTitle) {
        const id = `form-title-${Date.now()}`;
        formTitle.id = id;
        form.setAttribute('aria-labelledby', id);
      }
    });
  }

  // Enhance form labels
  enhanceFormLabels() {
    // Add required field indicators
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
      const label = document.querySelector(`label[for="${field.id}"]`) || 
                   field.closest('.form-group')?.querySelector('label');
      if (label && !label.querySelector('.required-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'required-indicator';
        indicator.textContent = ' (required)';
        indicator.setAttribute('aria-hidden', 'true');
        label.appendChild(indicator);
        
        field.setAttribute('aria-required', 'true');
      }
    });

    // Add help text associations
    const helpTexts = document.querySelectorAll('.help-text, .form-help');
    helpTexts.forEach(help => {
      const field = help.previousElementSibling;
      if (field && (field.tagName === 'INPUT' || field.tagName === 'SELECT' || field.tagName === 'TEXTAREA')) {
        const id = `help-${Date.now()}`;
        help.id = id;
        field.setAttribute('aria-describedby', id);
      }
    });
  }

  // Enhance live regions
  enhanceLiveRegions() {
    // Create status live region for notifications
    if (!document.getElementById('status-live-region')) {
      const statusRegion = document.createElement('div');
      statusRegion.id = 'status-live-region';
      statusRegion.setAttribute('aria-live', 'polite');
      statusRegion.setAttribute('aria-atomic', 'true');
      statusRegion.className = 'sr-only';
      document.body.appendChild(statusRegion);
    }

    // Create alert live region for errors
    if (!document.getElementById('alert-live-region')) {
      const alertRegion = document.createElement('div');
      alertRegion.id = 'alert-live-region';
      alertRegion.setAttribute('aria-live', 'assertive');
      alertRegion.setAttribute('aria-atomic', 'true');
      alertRegion.className = 'sr-only';
      document.body.appendChild(alertRegion);
    }
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Track keyboard usage
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.keyboardNavigationEnabled = true;
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      this.keyboardNavigationEnabled = false;
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // Handle keyboard navigation
  handleKeyboardNavigation(e) {
    const { key, ctrlKey, altKey, shiftKey } = e;

    // Global shortcuts
    if (altKey) {
      switch (key) {
        case '1':
          e.preventDefault();
          this.navigateToScreen('dashboard-screen');
          break;
        case '2':
          e.preventDefault();
          this.navigateToScreen('invoice-screen');
          break;
        case '3':
          e.preventDefault();
          this.navigateToScreen('analytics-screen');
          break;
        case '4':
          e.preventDefault();
          this.navigateToScreen('settings-screen');
          break;
        case 'h':
          e.preventDefault();
          this.showKeyboardHelp();
          break;
      }
    }

    // Screen-specific shortcuts
    if (ctrlKey) {
      switch (key) {
        case 's':
          e.preventDefault();
          if (document.getElementById('invoice-screen').classList.contains('active')) {
            this.triggerSaveAsDraft();
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (document.getElementById('invoice-screen').classList.contains('active')) {
            this.triggerPreviewInvoice();
          }
          break;
      }
    }

    // Modal and dialog handling
    if (key === 'Escape') {
      this.closeTopModal();
    }

    // Arrow key navigation for cards and lists
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      this.handleArrowNavigation(e);
    }
  }

  // Navigate to screen and announce
  navigateToScreen(screenId) {
    if (window.msmeApp) {
      window.msmeApp.showScreen(screenId);
      const screenName = this.getScreenName(screenId);
      this.announce(`Navigated to ${screenName}`);
    }
  }

  // Get screen name for announcement
  getScreenName(screenId) {
    const names = {
      'dashboard-screen': 'Dashboard',
      'invoice-screen': 'Create Invoice',
      'analytics-screen': 'Analytics',
      'settings-screen': 'Settings'
    };
    return names[screenId] || 'Screen';
  }

  // Handle arrow key navigation
  handleArrowNavigation(e) {
    const { key } = e;
    const focusedElement = document.activeElement;
    
    // Navigate between cards
    if (focusedElement.classList.contains('balance-card') || 
        focusedElement.classList.contains('action-card') ||
        focusedElement.classList.contains('transaction-item')) {
      
      const cards = Array.from(focusedElement.parentElement.children);
      const currentIndex = cards.indexOf(focusedElement);
      let newIndex = currentIndex;

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % cards.length;
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        newIndex = (currentIndex - 1 + cards.length) % cards.length;
      }

      if (newIndex !== currentIndex) {
        e.preventDefault();
        cards[newIndex].focus();
      }
    }
  }

  // Setup focus management
  setupFocusManagement() {
    // Skip links
    this.createSkipLinks();
    
    // Focus trapping for modals
    document.addEventListener('focusin', (e) => {
      this.handleFocusTrapping(e);
    });

    // Enhanced focus indicators
    this.enhanceFocusIndicators();
  }

  // Create skip links
  createSkipLinks() {
    const skipLinks = document.createElement('nav');
    skipLinks.className = 'skip-links';
    skipLinks.setAttribute('aria-label', 'Skip links');
    
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  // Handle focus trapping for modals
  handleFocusTrapping(e) {
    const activeModal = document.querySelector('.modal.active');
    if (!activeModal) return;

    const focusableElements = activeModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If focus is outside modal, bring it back
    if (!activeModal.contains(e.target)) {
      firstElement.focus();
    }
  }

  // Enhance focus indicators
  enhanceFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-enhanced *:focus {
        outline: 3px solid var(--primary-blue) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 5px var(--primary-blue) !important;
      }
      
      .high-contrast *:focus {
        outline: 4px solid var(--warning) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Setup gesture support
  setupGestureSupport() {
    // Swipe gestures for navigation
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Swipe threshold
      const threshold = 50;
      
      // Horizontal swipes for navigation
      if (Math.abs(deltaX) > threshold && Math.abs(deltaY) < threshold) {
        if (deltaX > 0) {
          // Swipe right - go back
          this.handleSwipeNavigation('back');
        } else {
          // Swipe left - go forward
          this.handleSwipeNavigation('forward');
        }
      }
    });
  }

  // Handle swipe navigation
  handleSwipeNavigation(direction) {
    const screens = ['dashboard-screen', 'invoice-screen', 'analytics-screen', 'settings-screen'];
    const currentScreen = document.querySelector('.screen.active');
    const currentIndex = screens.indexOf(currentScreen.id);
    
    let newIndex = currentIndex;
    if (direction === 'forward' && currentIndex < screens.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'back' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    
    if (newIndex !== currentIndex) {
      this.navigateToScreen(screens[newIndex]);
    }
  }

  // Setup voice commands
  setupVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      this.handleVoiceCommand(command);
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
    };
  }

  // Handle voice commands
  handleVoiceCommand(command) {
    const commands = {
      'go to dashboard': () => this.navigateToScreen('dashboard-screen'),
      'go to invoices': () => this.navigateToScreen('invoice-screen'),
      'go to analytics': () => this.navigateToScreen('analytics-screen'),
      'go to settings': () => this.navigateToScreen('settings-screen'),
      'create invoice': () => this.navigateToScreen('invoice-screen'),
      'save draft': () => this.triggerSaveAsDraft(),
      'preview invoice': () => this.triggerPreviewInvoice(),
      'help': () => this.showKeyboardHelp(),
      'read balance': () => this.readAccountBalances(),
      'read transactions': () => this.readRecentTransactions()
    };

    const action = commands[command];
    if (action) {
      action();
      this.announce(`Command executed: ${command}`);
    } else {
      this.announce('Command not recognized');
    }
  }

  // Start voice recognition
  startVoiceRecognition() {
    if (this.recognition) {
      this.recognition.start();
      this.announce('Voice commands activated');
    }
  }

  // Stop voice recognition
  stopVoiceRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.announce('Voice commands deactivated');
    }
  }

  // Trigger save as draft
  triggerSaveAsDraft() {
    if (window.invoiceManager && typeof window.saveAsDraft === 'function') {
      window.saveAsDraft();
    }
  }

  // Trigger preview invoice
  triggerPreviewInvoice() {
    if (window.invoiceManager && typeof window.previewInvoice === 'function') {
      window.previewInvoice();
    }
  }

  // Show keyboard help
  showKeyboardHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'modal active keyboard-help-modal';
    helpModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()" aria-label="Close help">&times;</button>
        </div>
        <div class="modal-body">
          <div class="shortcut-section">
            <h3>Navigation</h3>
            <ul>
              <li><kbd>Alt + 1</kbd> - Dashboard</li>
              <li><kbd>Alt + 2</kbd> - Create Invoice</li>
              <li><kbd>Alt + 3</kbd> - Analytics</li>
              <li><kbd>Alt + 4</kbd> - Settings</li>
              <li><kbd>Alt + H</kbd> - Show this help</li>
            </ul>
          </div>
          
          <div class="shortcut-section">
            <h3>Invoice Actions</h3>
            <ul>
              <li><kbd>Ctrl + S</kbd> - Save as Draft</li>
              <li><kbd>Ctrl + Enter</kbd> - Preview Invoice</li>
            </ul>
          </div>
          
          <div class="shortcut-section">
            <h3>General</h3>
            <ul>
              <li><kbd>Tab</kbd> - Navigate forward</li>
              <li><kbd>Shift + Tab</kbd> - Navigate backward</li>
              <li><kbd>Escape</kbd> - Close modal/dialog</li>
              <li><kbd>Arrow Keys</kbd> - Navigate between cards</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(helpModal);
    
    // Focus on close button
    const closeBtn = helpModal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }

    this.announce('Keyboard shortcuts help opened');
  }

  // Close top modal
  closeTopModal() {
    const modals = document.querySelectorAll('.modal.active');
    if (modals.length > 0) {
      const topModal = modals[modals.length - 1];
      topModal.remove();
      this.announce('Modal closed');
    }
  }

  // Read account balances
  readAccountBalances() {
    const accounts = DataHelper.getAccounts();
    let message = 'Account balances: ';
    
    accounts.forEach((account, index) => {
      message += `${account.bankName}: ${DataHelper.formatCurrency(account.balance)}`;
      if (index < accounts.length - 1) {
        message += ', ';
      }
    });

    this.speak(message);
  }

  // Read recent transactions
  readRecentTransactions() {
    const transactions = DataHelper.getTransactions(3);
    let message = 'Recent transactions: ';
    
    transactions.forEach((transaction, index) => {
      message += `${transaction.description}: ${DataHelper.formatCurrency(transaction.amount)}`;
      if (index < transactions.length - 1) {
        message += ', ';
      }
    });

    this.speak(message);
  }

  // Load accessibility preferences
  loadAccessibilityPreferences() {
    try {
      const prefs = JSON.parse(localStorage.getItem('accessibility-preferences') || '{}');
      
      if (prefs.voiceEnabled) {
        this.enableVoice();
      }
      // Restore elderly mode if it was previously enabled
      if (prefs.elderlyMode) {
        this.enableElderlyMode();
      }
      if (prefs.highContrast) {
        this.enableHighContrast();
      }
      if (prefs.fontSize) {
        this.setFontSize(prefs.fontSize);
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
  }

  // Save accessibility preferences
  saveAccessibilityPreferences() {
    try {
      const prefs = {
        voiceEnabled: this.isVoiceEnabled,
        elderlyMode: this.isElderlyMode,
        highContrast: this.isHighContrast,
        fontSize: this.currentFontSize
      };
      localStorage.setItem('accessibility-preferences', JSON.stringify(prefs));
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error);
    }
  }

  // Enable voice feedback
  enableVoice() {
    this.isVoiceEnabled = true;
    document.body.classList.add('voice-enabled');
    this.saveAccessibilityPreferences();
    this.speak('Voice feedback enabled');
  }

  // Disable voice feedback
  disableVoice() {
    this.isVoiceEnabled = false;
    document.body.classList.remove('voice-enabled');
    this.saveAccessibilityPreferences();
  }

  // Enable elderly mode
  enableElderlyMode() {
    this.isElderlyMode = true;
    document.body.classList.add('elderly-mode');
    this.saveAccessibilityPreferences();
    this.announce('Elderly-friendly mode enabled');
  }

  // Disable elderly mode
  disableElderlyMode() {
    this.isElderlyMode = false;
    document.body.classList.remove('elderly-mode');
    this.saveAccessibilityPreferences();
    this.announce('Elderly-friendly mode disabled');
  }

  // Enable high contrast
  enableHighContrast() {
    this.isHighContrast = true;
    document.body.classList.add('high-contrast');
    this.saveAccessibilityPreferences();
    this.announce('High contrast mode enabled');
  }

  // Disable high contrast
  disableHighContrast() {
    this.isHighContrast = false;
    document.body.classList.remove('high-contrast');
    this.saveAccessibilityPreferences();
  }

  // Set font size
  setFontSize(size) {
    // Remove existing font size classes
    document.body.classList.remove('large-text', 'extra-large-text');
    
    // Add new font size class
    if (size === 'large') {
      document.body.classList.add('large-text');
    } else if (size === 'extra-large') {
      document.body.classList.add('extra-large-text');
    }
    
    this.currentFontSize = size;
    this.saveAccessibilityPreferences();
    this.announce(`Font size changed to ${size}`);
  }

  // Announce message to screen readers
  announce(message) {
    const liveRegion = document.getElementById('status-live-region') || 
                     document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  // Announce alert to screen readers
  announceAlert(message) {
    const alertRegion = document.getElementById('alert-live-region');
    if (alertRegion) {
      alertRegion.textContent = message;
    }
  }

  // Speak message using text-to-speech
  speak(message) {
    if (!this.isVoiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Prefer a clear, natural voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Natural') || voice.name.includes('Enhanced'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  }

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Check if user prefers dark color scheme
  prefersDarkColorScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Apply system accessibility preferences
  applySystemPreferences() {
    // Apply reduced motion preference
    if (this.prefersReducedMotion()) {
      document.body.classList.add('reduce-motion');
    }

    // Apply dark mode preference if available
    if (this.prefersDarkColorScheme()) {
      document.body.classList.add('dark-mode');
    }
  }

  // Generate accessibility report
  generateAccessibilityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      screenReader: this.screenReaderActive,
      keyboardNavigation: this.keyboardNavigationEnabled,
      voiceEnabled: this.isVoiceEnabled,
      elderlyMode: this.isElderlyMode,
      highContrast: this.isHighContrast,
      fontSize: this.currentFontSize,
      reducedMotion: this.prefersReducedMotion(),
      darkMode: this.prefersDarkColorScheme()
    };

    console.log('Accessibility Report:', report);
    return report;
  }
  
  // Get elderly mode state from localStorage
  getElderlyModeFromStorage() {
    try {
      const prefs = JSON.parse(localStorage.getItem('accessibility-preferences') || '{}');
      return prefs.elderlyMode === true;
    } catch (error) {
      console.warn('Failed to read elderly mode from storage:', error);
      return false;
    }
  }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityManager = new AccessibilityManager();
  
  // Apply system preferences
  window.accessibilityManager.applySystemPreferences();
  
  // Add global accessibility enhancement class
  document.body.classList.add('accessibility-enhanced');
  
  // Check if elderly mode was previously enabled and apply it
  setTimeout(() => {
    // Check multiple sources for elderly mode state
    const isElderlyModeActive = document.body.classList.contains('elderly-mode') || 
                               window.accessibilityManager.isElderlyMode || 
                               window.accessibilityManager.getElderlyModeFromStorage();
    
    if (isElderlyModeActive) {
      console.log('Elderly mode detected on donate page load, applying...');
      // Ensure elderly mode class is applied
      if (!document.body.classList.contains('elderly-mode')) {
        document.body.classList.add('elderly-mode');
      }
      // Ensure elderly mode is enabled in the manager
      if (!window.accessibilityManager.isElderlyMode) {
        window.accessibilityManager.isElderlyMode = true;
      }
    }
  }, 100);
});

// Additional check on window load for late-loading scenarios
window.addEventListener('load', () => {
  setTimeout(() => {
    if (window.accessibilityManager) {
      const isElderlyModeActive = document.body.classList.contains('elderly-mode') || 
                                 window.accessibilityManager.isElderlyMode || 
                                 window.accessibilityManager.getElderlyModeFromStorage();
      
      if (isElderlyModeActive) {
        console.log('Elderly mode detected on donate page window load, applying...');
        // Ensure elderly mode class is applied
        if (!document.body.classList.contains('elderly-mode')) {
          document.body.classList.add('elderly-mode');
        }
        // Ensure elderly mode is enabled in the manager
        if (!window.accessibilityManager.isElderlyMode) {
          window.accessibilityManager.isElderlyMode = true;
        }
      }
    }
  }, 200);
});

// Export for potential use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
} else if (typeof window !== 'undefined') {
  window.AccessibilityManager = AccessibilityManager;
} 