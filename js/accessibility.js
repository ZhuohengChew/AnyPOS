// ===== ACCESSIBILITY MANAGER =====

class AccessibilityManager {
  constructor() {
    this.isVoiceEnabled = false;
    this.isElderlyMode = false;
    this.isHighContrast = false;
    this.currentFontSize = 'medium';
    this.keyboardNavigationEnabled = false;
    this.screenReaderActive = false;
    
    // Elderly mode configuration
    this.elderlyModeConfig = {
      // Features to show in elderly mode (only essential ones)
      enabledFeatures: [
        'pay',
        'receive', 
        'invoices',
        'tax-status',
        'transactions',
        'settings'
      ],
      
      // Features to hide in elderly mode
      hiddenFeatures: [
        'analytics',
        'analytics-graph',
        'sales-statistics',
        'donate',
        'donation',
        'lhdn-tax-detail'
      ],
      
      // Simplified navigation items
      simplifiedNav: [
        { id: 'pay', icon: '💳', label: 'Pay', url: 'pay.html' },
        { id: 'receive', icon: '💰', label: 'Receive', url: 'receive.html' },
        { id: 'invoices', icon: '📄', label: 'Invoices', url: 'invoices.html' },
        { id: 'tax-status', icon: '🏛️', label: 'Tax Status', url: 'tax-status.html' },
        { id: 'transactions', icon: '📊', label: 'Transactions', url: 'transactions.html' },
        { id: 'settings', icon: '⚙️', label: 'Settings', url: '#settings' }
      ]
    };
    
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
    
    // FIX: Load preferences after DOM is fully ready
    setTimeout(() => {
      this.loadAccessibilityPreferences();
    }, 100);
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
    // this.createSkipLinks(); // Removed as per edit hint
    
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
      
      // FIX: Properly restore elderly mode
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
    
    // Apply elderly mode simplifications
    this.applyElderlyModeSimplifications();
  }

  // Disable elderly mode
  disableElderlyMode() {
    this.isElderlyMode = false;
    document.body.classList.remove('elderly-mode');
    
    // FIX: Properly save the disabled state instead of deleting it
    this.saveAccessibilityPreferences();
    
    // Restore normal interface
    this.restoreNormalInterface();
  }

  toggleElderlyMode(enabled) {
    if (enabled) {
      this.enableElderlyMode();
    } else {
      this.disableElderlyMode();
    }
  }

  // Apply elderly mode simplifications
  applyElderlyModeSimplifications() {
    console.log('Applying elderly mode simplifications...');
    
    // Hide non-essential features
    this.hideNonEssentialFeatures();
    
    // Hide bottom navigation in elderly mode
    this.hideBottomNavigation();
    
    // Simplify dashboard
    this.simplifyDashboard();
    
    // Add elderly mode indicator
    this.addElderlyModeIndicator();
    
    // Announce the change
    this.announce('Interface simplified for easier use. Only essential features are now visible.');
  }

  // Hide non-essential features
  hideNonEssentialFeatures() {
    const { hiddenFeatures } = this.elderlyModeConfig;
    
    // Hide navigation items for non-essential features
    hiddenFeatures.forEach(feature => {
      const navItems = document.querySelectorAll(`[onclick*="${feature}"]`);
      navItems.forEach(item => {
        item.style.display = 'none';
        item.setAttribute('aria-hidden', 'true');
      });
    });
    
    // Hide action cards for non-essential features
    hiddenFeatures.forEach(feature => {
      const actionCards = document.querySelectorAll(`[onclick*="${feature}"]`);
      actionCards.forEach(card => {
        card.style.display = 'none';
        card.setAttribute('aria-hidden', 'true');
      });
    });
    
    // Hide specific sections
    const sectionsToHide = [
      '.analytics-section',
      '.donation-section',
      '.esg-section',
      '.sales-statistics-section'
    ];
    
    sectionsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Hide bottom navigation in elderly mode
  hideBottomNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = 'none';
      bottomNav.setAttribute('aria-hidden', 'true');
    }
  }

  // Show bottom navigation when elderly mode is disabled
  showBottomNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = '';
      bottomNav.removeAttribute('aria-hidden');
    }
  }

  // Simplify navigation
  simplifyNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav) return;
    
    // Clear existing navigation
    bottomNav.innerHTML = '';
    
    // Add simplified navigation items
    this.elderlyModeConfig.simplifiedNav.forEach(navItem => {
      const navButton = document.createElement('button');
      navButton.className = 'nav-item';
      navButton.setAttribute('data-feature', navItem.id);
      navButton.setAttribute('aria-label', navItem.label);
      
      navButton.innerHTML = `
        <div class="nav-icon">${navItem.icon}</div>
        <div class="nav-label">${navItem.label}</div>
      `;
      
      // Add click handler
      navButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSimplifiedNavigation(navItem);
      });
      
      bottomNav.appendChild(navButton);
    });
    
    // Add elderly mode indicator to navigation
    const elderlyIndicator = document.createElement('div');
    elderlyIndicator.className = 'elderly-mode-indicator';
    elderlyIndicator.innerHTML = '👴 Elderly Mode';
    elderlyIndicator.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-blue);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    `;
    bottomNav.appendChild(elderlyIndicator);
  }

  // Handle simplified navigation
  handleSimplifiedNavigation(navItem) {
    if (navItem.url === '#settings') {
      // Show settings screen
      if (window.msmeApp) {
        window.msmeApp.showScreen('settings-screen');
      }
    } else {
      // Navigate to external page
      window.location.href = navItem.url;
    }
    
    // Announce navigation
    this.announce(`Navigated to ${navItem.label}`);
  }

  // Simplify dashboard
  simplifyDashboard() {
    const dashboardMain = document.querySelector('.dashboard-main');
    if (!dashboardMain) return;
    
    // Clear existing content
    dashboardMain.innerHTML = '';
    
    // Create main dashboard content container
    const dashboardContent = document.createElement('div');
    dashboardContent.className = 'dashboard-content';
    dashboardContent.style.cssText = `
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 16px;
      max-width: 1400px;
      margin: 0 auto;
    `;
    
    // Create left column - Essential Actions
    const actionsSection = document.createElement('section');
    actionsSection.className = 'quick-actions-section';
    actionsSection.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    // Add actions header
    const actionsHeader = document.createElement('h2');
    actionsHeader.textContent = 'Essential Actions';
    actionsHeader.style.cssText = `
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
    `;
    actionsSection.appendChild(actionsHeader);
    
    // Add actions grid container
    const actionsGrid = document.createElement('div');
    actionsGrid.className = 'actions-grid';
    actionsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    `;
    actionsSection.appendChild(actionsGrid);
    
    // Create right column - Your Accounts
    const accountsSection = document.createElement('section');
    accountsSection.className = 'accounts-section';
    accountsSection.style.cssText = `
      display: flex;
      flex-direction: column;
    `;
    
    // Add accounts header
    const accountsHeader = document.createElement('h2');
    accountsHeader.textContent = 'Your Accounts';
    accountsHeader.style.cssText = `
      font-size: 22px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
    `;
    accountsSection.appendChild(accountsHeader);
    
    // Add accounts stack container
    const accountsStack = document.createElement('div');
    accountsStack.className = 'accounts-stack';
    accountsStack.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;
    accountsSection.appendChild(accountsStack);
    
    // Add sections to dashboard content
    dashboardContent.appendChild(actionsSection);
    dashboardContent.appendChild(accountsSection);
    
    // Add dashboard content to main
    dashboardMain.appendChild(dashboardContent);
    
    // Apply responsive grid layout
    this.applyResponsiveGridLayout();
    
    // Simplify quick actions section
    this.simplifyQuickActions();
    
    // Simplify balance section
    this.simplifyBalanceSection();
  }

  // Simplify quick actions for elderly mode
  simplifyQuickActions() {
    const actionsGrid = document.querySelector('.actions-grid');
    if (!actionsGrid) return;
    
    // Define essential actions for elderly mode
    const essentialActions = [
      { icon: '💳', label: 'Pay', url: 'pay.html', description: 'Make payments to suppliers and vendors' },
      { icon: '💰', label: 'Receive', url: 'receive.html', description: 'Receive payments from customers' },
      { icon: '📄', label: 'Invoices', url: 'invoices.html', description: 'Create and manage your invoices' },
      { icon: '📊', label: 'Statistics', url: 'analytics-graph.html', description: 'View your business performance and sales data' },
      { icon: '🏛️', label: 'Income Tax', url: 'lhdn-tax.html', description: 'Check and manage your tax obligations' },
      { icon: '💝', label: 'Donation', url: 'donate.html', description: 'Make donations and support charities' }
    ];
    
    // Clear existing actions
    actionsGrid.innerHTML = '';
    
    // Add essential actions
    essentialActions.forEach(action => {
      const actionCard = document.createElement('button');
      actionCard.className = 'action-card';
      actionCard.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        cursor: pointer;
        border: 1px solid #e5e7eb;
        transition: all 0.2s ease;
        text-decoration: none;
        color: inherit;
        width: 100%;
        min-height: 100px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      `;
      
      actionCard.innerHTML = `
        <div class="action-icon" style="
          width: 56px;
          height: 56px;
          background: #4475F2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
          flex-shrink: 0;
        ">${action.icon}</div>
        <div class="action-content" style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
          min-width: 0;
        ">
          <span class="action-label" style="
            font-size: 35px;
            font-weight: 700;
            color: #1f2937;
            text-align: left;
            margin-bottom: 6px;
            word-wrap: break-word;
            overflow-wrap: break-word;
          ">${action.label}</span>
          <span class="action-description" style="
            font-size: 18px;
            color: #6b7280;
            text-align: left;
            line-height: 1.4;
            word-wrap: break-word;
            overflow-wrap: break-word;
          ">${action.description}</span>
        </div>
      `;
      
      // Add click handler
      actionCard.addEventListener('click', () => {
        // Navigate to URL
        window.location.href = action.url;
        this.announce(`Navigating to ${action.label}`);
      });
      
      // Add hover effects
      actionCard.addEventListener('mouseenter', () => {
        actionCard.style.transform = 'translateY(-2px)';
        actionCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        actionCard.style.borderColor = '#2563eb';
      });
      
      actionCard.addEventListener('mouseleave', () => {
        actionCard.style.transform = 'translateY(0)';
        actionCard.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        actionCard.style.borderColor = '#e5e7eb';
      });
      
      actionsGrid.appendChild(actionCard);
    });
    
    // Apply responsive grid adjustments
    this.applyResponsiveActionGrid();
  }

  // Simplify balance section
  simplifyBalanceSection() {
    const accountsStack = document.querySelector('.accounts-stack');
    if (!accountsStack) return;
    
    // Clear existing cards
    accountsStack.innerHTML = '';
    
    // Create credit card styled account cards
    const accountCards = [
      {
        bank: 'Maybank',
        accountType: 'Business Account',
        balance: 'RM 15,420.50',
        accountNumber: '****1234',
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        logo: '🏦'
      },
      {
        bank: 'CIMB Bank',
        accountType: 'Savings Account',
        balance: 'RM 8,750.30',
        accountNumber: '****5678',
        color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        logo: '🏦'
      },
      {
        bank: 'Public Bank',
        accountType: 'Current Account',
        balance: 'RM 12,890.75',
        accountNumber: '****9012',
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        logo: '🏦'
      }
    ];
    
    // Add account cards
    accountCards.forEach(card => {
      const accountCard = document.createElement('div');
      accountCard.className = 'account-card';
      accountCard.style.cssText = `
        background: ${card.color};
        border-radius: 16px;
        padding: 32px 24px;
        height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: white;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      
      // Add decorative chip
      const chip = document.createElement('div');
      chip.style.cssText = `
        width: 40px;
        height: 30px;
        background: #fbbf24;
        border-radius: 6px;
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #92400e;
      `;
      chip.innerHTML = '💳';
      
      accountCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 4px 0; color: white;">${card.bank}</h3>
            <p style="font-size: 14px; margin: 0; opacity: 0.9; color: white;">${card.accountType}</p>
          </div>
          <div style="font-size: 24px;">${card.logo}</div>
        </div>
        
        <div style="margin: 20px 0;">
          <div style="font-size: 24px; font-weight: 700; color: white; margin-bottom: 8px;">${card.balance}</div>
          <div style="font-size: 14px; opacity: 0.9; color: white;">Account: ${card.accountNumber}</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 12px; opacity: 0.8; color: white;">MSME Finance</div>
          <div style="font-size: 12px; opacity: 0.8; color: white;">Visa</div>
        </div>
      `;
      
      accountCard.appendChild(chip);
      
      // Add hover effects
      accountCard.addEventListener('mouseenter', () => {
        accountCard.style.transform = 'translateY(-4px) scale(1.02)';
        accountCard.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      });
      
      accountCard.addEventListener('mouseleave', () => {
        accountCard.style.transform = 'translateY(0) scale(1)';
        accountCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      });
      
      accountsStack.appendChild(accountCard);
    });
  }

  // Add elderly mode indicator
  addElderlyModeIndicator() {
    const header = document.querySelector('.app-header');
    if (!header) return;
    
    // Check if indicator already exists
    if (document.querySelector('.elderly-mode-badge')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'elderly-mode-badge';
    indicator.innerHTML = '👴 Elderly Mode';
    indicator.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--primary-blue);
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    header.appendChild(indicator);
  }

  // Restore normal interface
  restoreNormalInterface() {
    console.log('Restoring normal interface...');
    
    // Show all hidden features
    this.showAllFeatures();
    
    // Show bottom navigation
    this.showBottomNavigation();
    
    // Restore original quick actions
    this.restoreOriginalQuickActions();
    
    // Remove elderly mode indicators
    this.removeElderlyModeIndicators();
    
    // Announce the change
    this.announce('Full interface restored. All features are now available.');
  }

  // Show all features
  showAllFeatures() {
    // Show all hidden elements
    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    hiddenElements.forEach(el => {
      el.style.display = '';
      el.removeAttribute('aria-hidden');
    });
    
    // Show all sections
    const sectionsToShow = [
      '.analytics-section',
      '.donation-section',
      '.esg-section',
      '.sales-statistics-section'
    ];
    
    sectionsToShow.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
      });
    });
  }

  // Restore original navigation
  restoreOriginalNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav) return;
    
    // Restore original navigation HTML exactly as it was
    bottomNav.innerHTML = `
      <button class="nav-item active" data-screen="dashboard-screen">
        <div class="nav-icon">🏠</div>
        <div class="nav-label" data-translate="home">Home</div>
      </button>
      
      <button class="nav-item" onclick="window.location.href='lhdn-tax.html'">
        <div class="nav-icon">🏛️</div>
        <div class="nav-label" data-translate="incomeTax">Income Tax</div>
      </button>
      
      <button class="nav-item" onclick="window.location.href='analytics-graph.html'">
        <div class="nav-icon">📊</div>
        <div class="nav-label" data-translate="analyticsGraph">Analytics</div>
      </button>
      
      <button class="nav-item" onclick="window.location.href='donate.html'">
        <div class="nav-icon">💝</div>
        <div class="nav-label" data-translate="donation">Donation</div>
      </button>
      
      <button class="nav-item" data-screen="settings-screen">
        <div class="nav-icon">⚙️</div>
        <div class="nav-label" data-translate="settings">Settings</div>
      </button>
    `;
    
    // Reattach event listeners
    if (window.msmeApp) {
      window.msmeApp.setupNavigation();
    }
  }

  // Restore original quick actions
  restoreOriginalQuickActions() {
    const quickActions = document.querySelector('.quick-actions');
    if (!quickActions) return;
    
    // Restore original quick actions HTML exactly as it was
    quickActions.innerHTML = `
      <div class="action-grid">
        <button class="action-card" onclick="window.location.href='pay.html'">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <span class="action-label" data-translate="pay">Pay</span>
        </button>
        
        <button class="action-card" onclick="window.location.href='receive.html'">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <span class="action-label" data-translate="receive">Receive</span>
        </button>
        
        <button class="action-card" onclick="window.location.href='invoices.html'">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <span class="action-label" data-translate="invoices">Invoices</span>
        </button>
        
        <button class="action-card" onclick="window.location.href='sales-statistics.html'">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          </div>
          <span class="action-label" data-translate="analytics">Analytics</span>
        </button>
        
        <button class="action-card" onclick="window.location.href='analytics-graph.html'">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
          </div>
          <span class="action-label" data-translate="analyticsGraph">Analytics Graph</span>
        </button>
      </div>
    `;
    
    // Restore original balance section header
    this.restoreOriginalBalanceSection();
  }

  // Restore original balance section
  restoreOriginalBalanceSection() {
    const balanceSection = document.querySelector('.balance-section');
    if (!balanceSection) return;
    
    // Restore original balance section header
    const sectionHeader = balanceSection.querySelector('.section-header');
    if (sectionHeader) {
      sectionHeader.innerHTML = `
        <h2 data-translate="accounts">Accounts</h2>
        <button class="view-all-btn" data-translate="viewAll">View All</button>
      `;
    }
  }

  // Remove elderly mode indicators
  removeElderlyModeIndicators() {
    const indicators = document.querySelectorAll('.elderly-mode-indicator, .elderly-mode-badge');
    indicators.forEach(indicator => indicator.remove());
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

  // Apply responsive grid layout for elderly mode
  applyResponsiveGridLayout() {
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) return;
    
    // Function to update layout based on screen size
    const updateLayout = () => {
      const width = window.innerWidth;
      
      if (width >= 768) {
        // Desktop: Side-by-side layout (60% left, 40% right)
        dashboardContent.style.gridTemplateColumns = '1.5fr 1fr';
        dashboardContent.style.gap = '32px';
        dashboardContent.style.alignItems = 'start';
      } else if (width >= 480) {
        // Tablet: Stacked layout with 2-column actions grid
        dashboardContent.style.gridTemplateColumns = '1fr';
        dashboardContent.style.gap = '24px';
      } else {
        // Mobile: Stacked layout with 1-column actions grid
        dashboardContent.style.gridTemplateColumns = '1fr';
        dashboardContent.style.gap = '20px';
      }
    };
    
    // Apply initial layout
    updateLayout();
    
    // Update layout on window resize
    window.addEventListener('resize', updateLayout);
  }

  // Apply responsive grid adjustments for action grid
  applyResponsiveActionGrid() {
    const actionsGrid = document.querySelector('.actions-grid');
    if (!actionsGrid) return;

    const updateGridLayout = () => {
      const width = window.innerWidth;

      if (width >= 768) {
        // Desktop: 2 columns
        actionsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        actionsGrid.style.gap = '24px';
      } else if (width >= 480) {
        // Tablet: 1 column
        actionsGrid.style.gridTemplateColumns = '1fr';
        actionsGrid.style.gap = '20px';
      } else {
        // Mobile: 1 column
        actionsGrid.style.gridTemplateColumns = '1fr';
        actionsGrid.style.gap = '16px';
      }
    };

    updateGridLayout(); // Apply initial layout
    window.addEventListener('resize', updateGridLayout);
  }

  // Check and apply elderly mode layout when dashboard is shown
  checkAndApplyElderlyModeLayout() {
    // Check if elderly mode is active (either via class or localStorage)
    const isElderlyModeActive = document.body.classList.contains('elderly-mode') || 
                               this.isElderlyMode || 
                               this.getElderlyModeFromStorage();
    
    if (isElderlyModeActive) {
      // If elderly mode is active, ensure the layout is applied
      const dashboardMain = document.querySelector('.dashboard-main');
      if (dashboardMain && !dashboardMain.querySelector('.dashboard-content')) {
        // Elderly mode is active but layout not applied, so apply it
        console.log('Applying elderly mode layout...');
        this.simplifyDashboard();
      }
    }
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
  
  // Check if elderly mode was previously enabled and apply layout
  setTimeout(() => {
    // Check multiple sources for elderly mode state
    const isElderlyModeActive = document.body.classList.contains('elderly-mode') || 
                               window.accessibilityManager.isElderlyMode || 
                               window.accessibilityManager.getElderlyModeFromStorage();
    
    if (isElderlyModeActive) {
      console.log('Elderly mode detected on page load, applying layout...');
      // Ensure elderly mode class is applied
      if (!document.body.classList.contains('elderly-mode')) {
        document.body.classList.add('elderly-mode');
      }
      // Apply elderly mode layout
      window.accessibilityManager.checkAndApplyElderlyModeLayout();
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
        console.log('Elderly mode detected on window load, applying layout...');
        // Ensure elderly mode class is applied
        if (!document.body.classList.contains('elderly-mode')) {
          document.body.classList.add('elderly-mode');
        }
        // Apply elderly mode layout
        window.accessibilityManager.checkAndApplyElderlyModeLayout();
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