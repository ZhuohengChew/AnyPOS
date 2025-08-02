// ===== MAIN APPLICATION CONTROLLER =====

class MSMEApp {
  constructor() {
    this.currentScreen = 'loading-screen';
    this.currentUser = null;
    this.currentLanguage = 'en';
    this.isAuthenticated = false;
    this.onboardingStep = 1;
    this.translations = {};
    
    // Initialize the app
    this.init();
  }

  // Initialize the application
  init() {
    console.log('Initializing MSME Finance Platform...');
    
    // Load saved data from localStorage
    this.loadFromStorage();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup translations
    this.setupTranslations();
    
    // Start loading sequence
    this.simulateLoading();
    
    // Setup accessibility features
    this.setupAccessibility();
    
    // Setup navigation
    this.setupNavigation();
    
    // Load and apply settings after accessibility manager is ready
    setTimeout(() => {
      this.loadSettings();
    }, 100);
  }

  // Simulate loading screen
  simulateLoading() {
    setTimeout(() => {
      // Check if user has completed onboarding
      if (this.currentUser && this.currentUser.onboardingCompleted) {
        this.showScreen('dashboard-screen');
      } else {
        this.showScreen('language-screen');
      }
    }, 2000);
  }

  // Setup event listeners
  setupEventListeners() {
    // Language selection
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const language = e.currentTarget.dataset.lang;
        this.setLanguage(language);
        this.showScreen('user-type-screen');
      });
    });

    // User type selection
    document.querySelectorAll('.user-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userType = e.currentTarget.dataset.type;
        this.setUserType(userType);
        this.showScreen('login-screen');
      });
    });

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Skip authentication
    const skipAuthBtn = document.getElementById('skip-auth');
    if (skipAuthBtn) {
      skipAuthBtn.addEventListener('click', () => {
        this.skipAuthentication();
      });
    }

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const screen = e.currentTarget.dataset.screen;
        if (screen) {
          this.showScreen(screen);
          this.updateActiveNavItem(e.currentTarget);
        }
      });
      // Voice feedback on focus
      item.addEventListener('focus', (e) => {
        if (this.currentUser?.accessibilitySettings?.voiceFeedback) {
          // Try to get the label text
          const label = item.querySelector('.nav-label');
          if (label) {
            this.speakText(label.textContent.trim());
          }
        }
      });
    });

    // Settings toggles
    document.querySelectorAll('.settings-section input[type="checkbox"]').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        this.handleSettingChange(e.target.id, e.target.checked);
      });
      // Voice feedback on focus
      toggle.addEventListener('focus', (e) => {
        if (this.currentUser?.accessibilitySettings?.voiceFeedback) {
          // Find the label text for this toggle
          const settingItem = toggle.closest('.setting-item');
          if (settingItem) {
            const labelSpan = settingItem.querySelector('span');
            if (labelSpan) {
              this.speakText(labelSpan.textContent.trim());
            }
          }
        }
      });
    });

    // Font size selector
    const fontSizeSelect = document.getElementById('font-size-select');
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', (e) => {
        this.changeFontSize(e.target.value);
      });
      // Voice feedback on focus
      fontSizeSelect.addEventListener('focus', (e) => {
        if (this.currentUser?.accessibilitySettings?.voiceFeedback) {
          this.speakText('Font Size');
        }
      });
    }

    // Language selector in settings
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
      // Voice feedback on focus
      languageSelect.addEventListener('focus', (e) => {
        if (this.currentUser?.accessibilitySettings?.voiceFeedback) {
          this.speakText('Language');
        }
      });
    }

    // Password toggle
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', this.togglePasswordVisibility);
    }

    // Notification button
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', this.showNotifications);
    }

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.showScreen('settings-screen');
      });
    }

    // ESG modal
    window.showEsgFeatures = () => this.showEsgModal();
    window.closeModal = (modalId) => this.closeModal(modalId);

    // Global functions for onboarding
    window.nextOnboardingStep = () => this.nextOnboardingStep();
    window.prevOnboardingStep = () => this.prevOnboardingStep();
    window.completeOnboarding = () => this.completeOnboarding();

    // Global function for screen navigation
    window.showScreen = (screenId) => this.showScreen(screenId);

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
  }

  // Setup translations
  setupTranslations() {
    this.translations = {
      en: {
        userTypeTitle: 'Choose Your Account Type',
        userTypeSubtitle: 'Select the option that best describes you',
        personalUser: 'Personal User',
        personalUserDesc: 'Manage your personal finances',
        businessUser: 'Business User',
        businessUserDesc: 'Manage your MSME business',
        demoNotice: '🔄 This is a prototype. All data is simulated.',
        welcomeBack: 'Welcome Back',
        loginSubtitle: 'Sign in to your account',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        skipAuth: 'Skip Authentication (Demo)',
        demoCredentials: 'Demo credentials: demo@msme.my / demo123',
        goodMorning: 'Good Morning',
        accounts: 'Accounts',
        viewAll: 'View All',
        quickActions: 'Quick Actions',
        createInvoice: 'Create Invoice',
        viewReports: 'View Reports',
        customers: 'Customers',
        esgFeatures: 'ESG Features',
        recentTransactions: 'Recent Transactions',
        cashFlowSummary: 'Cash Flow Summary',
        home: 'Home',
        invoices: 'Invoices',
        analytics: 'Analytics',
        settings: 'Settings',
        pay: 'Pay',
        receive: 'Receive',
        businessInfo: 'Business Information',
        businessName: 'Business Name',
        businessType: 'Business Type',
        businessAddress: 'Business Address',
        bankSetup: 'Bank Setup',
        bankSetupDesc: 'Connect your business bank accounts',
        setupComplete: 'Setup Complete!',
        setupCompleteDesc: 'Your MSME financial platform is ready to use',
        summary: 'Summary',
        businessSetup: 'Business Setup',
        bankConnections: 'Bank Connections',
        profileReady: 'Profile Ready',
        customerInfo: 'Customer Information',
        customerName: 'Customer Name',
        customerEmail: 'Customer Email',
        customerAddress: 'Customer Address',
        invoiceDetails: 'Invoice Details',
        invoiceNumber: 'Invoice Number',
        invoiceDate: 'Invoice Date',
        dueDate: 'Due Date',
        lineItems: 'Line Items',
        subtotal: 'Subtotal:',
        sst: 'SST (6%):',
        total: 'Total:',
        incomeTax: 'Income Tax',
        donation: 'Donation',
        saveAsDraft: 'Save as Draft',
        previewAndSend: 'Preview & Send',
        addAccount: 'Add Account',
        addNewAccount: 'Add New Account',
        selectBank: 'Select Bank',
        chooseBank: 'Choose a bank...',
        accountNumber: 'Account Number',
        accountType: 'Account Type',
        chooseType: 'Choose account type...',
        initialBalance: 'Initial Balance (RM)',
        setAsDefault: 'Set as default account',
        cancel: 'Cancel'
      },
      my: {
        userTypeTitle: 'Pilih Jenis Akaun Anda',
        userTypeSubtitle: 'Pilih pilihan yang paling sesuai dengan anda',
        personalUser: 'Pengguna Peribadi',
        personalUserDesc: 'Urus kewangan peribadi anda',
        businessUser: 'Pengguna Perniagaan',
        businessUserDesc: 'Urus perniagaan MSME anda',
        demoNotice: '🔄 Ini adalah prototaip. Semua data disimulasikan.',
        welcomeBack: 'Selamat Kembali',
        loginSubtitle: 'Log masuk ke akaun anda',
        email: 'E-mel',
        password: 'Kata Laluan',
        signIn: 'Log Masuk',
        skipAuth: 'Langkau Pengesahan (Demo)',
        demoCredentials: 'Kelayakan demo: demo@msme.my / demo123',
        goodMorning: 'Selamat Pagi',
        accounts: 'Akaun',
        viewAll: 'Lihat Semua',
        quickActions: 'Tindakan Pantas',
        createInvoice: 'Cipta Invois',
        viewReports: 'Lihat Laporan',
        customers: 'Pelanggan',
        esgFeatures: 'Ciri ESG',
        recentTransactions: 'Transaksi Terkini',
        cashFlowSummary: 'Ringkasan Aliran Tunai',
        home: 'Utama',
        invoices: 'Invois',
        analytics: 'Analitik',
        settings: 'Tetapan',
        pay: 'Bayar',
        receive: 'Terima',
        businessInfo: 'Maklumat Perniagaan',
        businessName: 'Nama Perniagaan',
        businessType: 'Jenis Perniagaan',
        businessAddress: 'Alamat Perniagaan',
        bankSetup: 'Persediaan Bank',
        bankSetupDesc: 'Sambungkan akaun bank perniagaan anda',
        setupComplete: 'Persediaan Selesai!',
        setupCompleteDesc: 'Platform kewangan MSME anda sudah sedia untuk digunakan',
        summary: 'Ringkasan',
        businessSetup: 'Persediaan Perniagaan',
        bankConnections: 'Sambungan Bank',
        profileReady: 'Profil Sedia',
        customerInfo: 'Maklumat Pelanggan',
        customerName: 'Nama Pelanggan',
        customerEmail: 'E-mel Pelanggan',
        customerAddress: 'Alamat Pelanggan',
        invoiceDetails: 'Butiran Invois',
        invoiceNumber: 'Nombor Invois',
        invoiceDate: 'Tarikh Invois',
        dueDate: 'Tarikh Akhir',
        lineItems: 'Item Barisan',
        subtotal: 'Subjumlah:',
        sst: 'SST (6%):',
        total: 'Jumlah:',
        incomeTax: 'Cukai Pendapatan',
        donation: 'Derma',
        saveAsDraft: 'Simpan Sebagai Draf',
        previewAndSend: 'Tengok & Hantar',
        addAccount: 'Tambah Akaun',
        addNewAccount: 'Tambah Akaun Baru',
        selectBank: 'Pilih Bank',
        chooseBank: 'Pilih bank...',
        accountNumber: 'Nombor Akaun',
        accountType: 'Jenis Akaun',
        chooseType: 'Pilih jenis akaun...',
        initialBalance: 'Baki Awal (RM)',
        setAsDefault: 'Tetapkan sebagai akaun lalai',
        cancel: 'Batal'
      }
    };
    
    // Apply current language
    this.applyTranslations();
  }

  // Set language
  setLanguage(language) {
    this.currentLanguage = language;
    this.saveToStorage();
    this.applyTranslations();
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = language;
    }
  }

  // Toggle between English and Malay
  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'my' : 'en';
    this.setLanguage(newLanguage);
    
    // Show notification of language change
    const languageName = newLanguage === 'my' ? 'Bahasa Malaysia' : 'English';
    if (this.currentUser?.accessibilitySettings?.voiceFeedback) {
      this.speakText(`Language changed to ${languageName}`);
    }
  }

  // Apply translations to the UI
  applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    const translations = this.translations[this.currentLanguage] || this.translations.en;
    
    elements.forEach(element => {
      const key = element.dataset.translate;
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
  }

  // Set user type
  setUserType(type) {
    if (!this.currentUser) {
      this.currentUser = { ...DataHelper.getUser() };
    }
    this.currentUser.type = type;
    this.saveToStorage();
  }

  // Handle login
  handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate authentication
    this.simulateAuthentication(email, password);
  }

  // Simulate authentication
  simulateAuthentication(email, password) {
    // Show loading state
    const loginBtn = document.querySelector('#login-form .btn-primary');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    setTimeout(() => {
      // Reset button
      loginBtn.textContent = originalText;
      loginBtn.disabled = false;

      // Check credentials (demo)
      if (email === 'demo@msme.my' && password === 'demo123') {
        this.isAuthenticated = true;
        this.currentUser = { ...DataHelper.getUser() };
        this.checkOnboardingStatus();
      } else {
        this.showError('Invalid credentials. Use demo@msme.my / demo123');
      }
    }, 1500);
  }

  // Skip authentication (for demo)
  skipAuthentication() {
    this.isAuthenticated = true;
    this.currentUser = { ...DataHelper.getUser() };
    this.checkOnboardingStatus();
  }

  // Check onboarding status
  checkOnboardingStatus() {
    if (this.currentUser.onboardingCompleted) {
      this.showScreen('dashboard-screen');
    } else {
      this.showScreen('onboarding-screen');
      this.startOnboarding();
    }
    this.saveToStorage();
  }

  // Start onboarding process
  startOnboarding() {
    this.onboardingStep = 1;
    this.updateOnboardingProgress();
    this.showOnboardingStep(1);
  }

  // Next onboarding step
  nextOnboardingStep() {
    if (this.onboardingStep < 3) {
      this.onboardingStep++;
      this.updateOnboardingProgress();
      this.showOnboardingStep(this.onboardingStep);
    }
  }

  // Previous onboarding step
  prevOnboardingStep() {
    if (this.onboardingStep > 1) {
      this.onboardingStep--;
      this.updateOnboardingProgress();
      this.showOnboardingStep(this.onboardingStep);
    }
  }

  // Show onboarding step
  showOnboardingStep(step) {
    // Hide all steps
    document.querySelectorAll('.onboarding-step').forEach(stepEl => {
      stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`onboarding-step-${step}`);
    if (currentStepEl) {
      currentStepEl.classList.add('active');
    }
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepIndicator, index) => {
      stepIndicator.classList.remove('active', 'completed');
      if (index + 1 < step) {
        stepIndicator.classList.add('completed');
      } else if (index + 1 === step) {
        stepIndicator.classList.add('active');
      }
    });
  }

  // Update onboarding progress
  updateOnboardingProgress() {
    const progressFill = document.getElementById('onboarding-progress');
    if (progressFill) {
      const progress = (this.onboardingStep / 3) * 100;
      progressFill.style.width = `${progress}%`;
    }
  }

  // Complete onboarding
  completeOnboarding() {
    this.currentUser.onboardingCompleted = true;
    this.saveToStorage();
    this.showScreen('dashboard-screen');
    
    // Initialize dashboard
    if (window.dashboardManager) {
      window.dashboardManager.loadDashboard();
    }
  }

  // Show screen
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.currentScreen = screenId;
      
      // Apply fade-in animation
      targetScreen.classList.add('animate-fade-in');
      setTimeout(() => {
        targetScreen.classList.remove('animate-fade-in');
      }, 300);
      
      // Screen-specific initialization
      this.initializeScreen(screenId);
    }
  }

  // Initialize screen-specific functionality
  initializeScreen(screenId) {
    switch (screenId) {
      case 'dashboard-screen':
        if (window.dashboardManager) {
          window.dashboardManager.loadDashboard();
        }
        this.updateGreeting();
        // Check and apply elderly mode layout if needed
        if (window.accessibilityManager) {
          window.accessibilityManager.checkAndApplyElderlyModeLayout();
        }
        break;
      case 'invoice-screen':
        if (window.invoiceManager) {
          window.invoiceManager.initializeInvoiceForm();
        }
        break;
      case 'analytics-screen':
        if (window.analyticsManager) {
          window.analyticsManager.loadAnalytics();
        }
        break;
      case 'settings-screen':
        this.loadSettings();
        break;
    }
  }

  // Update greeting based on time
  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    
    if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon';
    } else if (hour >= 17) {
      greeting = 'Good Evening';
    }
    
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) {
      greetingEl.textContent = greeting;
    }
    
    const businessNameEl = document.getElementById('business-name-display');
    if (businessNameEl && this.currentUser) {
      businessNameEl.textContent = this.currentUser.name;
    }
  }

  // Update active navigation item
  updateActiveNavItem(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    activeItem.classList.add('active');
  }

  // Handle setting changes
  handleSettingChange(settingId, value) {
    switch (settingId) {
      case 'elderly-mode-toggle':
        this.toggleElderlyMode(value);
        break;
      case 'high-contrast-toggle':
        this.toggleHighContrast(value);
        break;
      case 'voice-feedback-toggle':
        this.toggleVoiceFeedback(value);
        break;
      case 'donation-roundup-toggle':
      case 'carbon-tracking-toggle':
      case 'invoice-reminders-toggle':
      case 'payment-alerts-toggle':
        // Update settings in storage
        this.updateUserSettings(settingId, value);
        break;
    }
  }

  // Toggle elderly mode
  toggleElderlyMode(enabled) {
    if (enabled) {
      // Enable elderly mode directly
      if (window.accessibilityManager) {
        window.accessibilityManager.enableElderlyMode();
      } else {
        // Fallback if accessibility manager is not available
        document.body.classList.add('elderly-mode');
      }
      this.updateUserSettings('elderlyMode', enabled);
    } else {
      // Redirect to confirmation page when trying to disable elderly mode
      window.location.href = 'elderly-mode-confirmation.html';
    }
  }

  // Toggle high contrast
  toggleHighContrast(enabled) {
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    this.updateUserSettings('highContrast', enabled);
  }

  // Toggle voice feedback
  toggleVoiceFeedback(enabled) {
    this.updateUserSettings('voiceFeedback', enabled);
    
    if (enabled) {
      this.speakText('Voice feedback enabled');
    }
  }

  // Change font size
  changeFontSize(size) {
    // Remove existing font size classes
    document.body.classList.remove('large-text', 'extra-large-text');
    
    // Add new font size class
    if (size === 'large') {
      document.body.classList.add('large-text');
    } else if (size === 'extra-large') {
      document.body.classList.add('extra-large-text');
    }
    
    this.updateUserSettings('fontSize', size);
  }

  // Update user settings
  updateUserSettings(key, value) {
    if (!this.currentUser) return;
    
    if (!this.currentUser.accessibilitySettings) {
      this.currentUser.accessibilitySettings = {};
    }
    
    this.currentUser.accessibilitySettings[key] = value;
    this.saveToStorage();
  }

  // Load settings
  loadSettings() {
    if (!this.currentUser || !this.currentUser.accessibilitySettings) return;
    
    const settings = this.currentUser.accessibilitySettings;
    
    // Apply settings to UI
    Object.keys(settings).forEach(key => {
      const element = document.getElementById(`${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-toggle`);
      if (element && typeof settings[key] === 'boolean') {
        element.checked = settings[key];
      }
    });
    
    // Apply font size
    if (settings.fontSize) {
      const fontSizeSelect = document.getElementById('font-size-select');
      if (fontSizeSelect) {
        fontSizeSelect.value = settings.fontSize;
      }
      this.changeFontSize(settings.fontSize);
    }
    
    // Apply accessibility modes
    // Don't automatically restore elderly mode - only enable when explicitly requested
    // if (settings.elderlyMode) {
    //   this.toggleElderlyMode(true);
    // }
    if (settings.highContrast) {
      this.toggleHighContrast(true);
    }
    
    // Ensure elderly mode toggle state is synchronized with accessibility manager
    if (window.accessibilityManager) {
      const elderlyModeToggle = document.getElementById('elderly-mode-toggle');
      if (elderlyModeToggle) {
        elderlyModeToggle.checked = window.accessibilityManager.isElderlyMode;
      }
    }
  }

  // Setup accessibility features
  setupAccessibility() {
    // Add skip links
    // this.addSkipLinks(); // Removed as per edit hint
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Setup ARIA live regions
    this.setupLiveRegions();
    
    // Apply saved accessibility settings
    this.loadSettings();
  }

  // Add skip links for accessibility
  // addSkipLinks() { // Removed as per edit hint
  //   const skipLinks = document.createElement('div');
  //   skipLinks.className = 'skip-links';
  //   skipLinks.innerHTML = `
  //     <a href="#main-content" class="skip-link">Skip to main content</a>
  //     <a href="#navigation" class="skip-link">Skip to navigation</a>
  //   `;
  //   document.body.insertBefore(skipLinks, document.body.firstChild);
  // }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Add keyboard navigation class when using keyboard
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav-active');
      }
    });
    
    document.addEventListener('mousedown', () => {
      // Remove keyboard navigation class when using mouse
      document.body.classList.remove('keyboard-nav-active');
    });
  }

  // Setup ARIA live regions
  setupLiveRegions() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-live-region';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  // Announce to screen readers
  announce(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  // Text-to-speech (if enabled)
  speakText(text) {
    if (!this.currentUser?.accessibilitySettings?.voiceFeedback) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  // Setup navigation
  setupNavigation() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.screen) {
        this.showScreen(e.state.screen);
      }
    });
    
    // Set initial state
    history.replaceState({ screen: this.currentScreen }, '', window.location.href);
  }

  // Handle keyboard navigation
  handleKeyNavigation(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        this.closeModal(activeModal.id);
      }
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey && e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      const screens = ['dashboard-screen', 'invoice-screen', 'analytics-screen', 'settings-screen'];
      const screenIndex = parseInt(e.key) - 1;
      if (screens[screenIndex]) {
        this.showScreen(screens[screenIndex]);
      }
    }
  }

  // Show ESG modal
  showEsgModal() {
    const modal = document.getElementById('esg-modal');
    if (modal) {
      modal.classList.add('active');
      
      // Focus on close button for accessibility
      const closeBtn = modal.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.focus();
      }
    }
  }

  // Close modal
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // Show notifications
  showNotifications() {
    const notifications = DataHelper.getNotifications();
    this.announce(`You have ${notifications.length} notifications`);
    
    // For demo, just show a simple alert
    const unreadCount = DataHelper.getUnreadNotifications().length;
    alert(`You have ${unreadCount} unread notifications`);
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.textContent = '🙈';
      toggleBtn.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.type = 'password';
      toggleBtn.textContent = '👁️';
      toggleBtn.setAttribute('aria-label', 'Show password');
    }
  }

  // Show error message
  showError(message) {
    // Create error element
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    
    // Insert after login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.appendChild(errorEl);
      
      // Remove after 5 seconds
      setTimeout(() => {
        errorEl.remove();
      }, 5000);
    }
    
    // Announce to screen readers
    this.announce(`Error: ${message}`);
  }

  // Save data to localStorage
  saveToStorage() {
    try {
      const data = {
        currentUser: this.currentUser,
        currentLanguage: this.currentLanguage,
        isAuthenticated: this.isAuthenticated,
        onboardingStep: this.onboardingStep
      };
      localStorage.setItem('msme-app-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  // Load data from localStorage
  loadFromStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('msme-app-data') || '{}');
      
      if (data.currentUser) {
        this.currentUser = data.currentUser;
      }
      if (data.currentLanguage) {
        this.currentLanguage = data.currentLanguage;
      }
      if (data.isAuthenticated) {
        this.isAuthenticated = data.isAuthenticated;
      }
      if (data.onboardingStep) {
        this.onboardingStep = data.onboardingStep;
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.msmeApp = new MSMEApp();
  window.app = window.msmeApp; // Alias for easier access

  // Check if this is a reload after elderly mode disable
  const urlParams = new URLSearchParams(window.location.search);
  const isReload = urlParams.get('reload');
  
  if (isReload === 'true') {
    // Clear the reload parameter from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Force reload the page to ensure all changes take effect
    window.location.reload();
    return;
  }

  // Function to update elderly mode toggle state
  function updateElderlyModeToggleState() {
    const elderlyModeToggle = document.getElementById('elderly-mode-toggle');
    if (elderlyModeToggle && window.accessibilityManager) {
      // Set initial state from accessibility manager
      elderlyModeToggle.checked = window.accessibilityManager.isElderlyMode;
    }
  }

  // Update toggle state immediately
  updateElderlyModeToggleState();
  
  // Also update when settings screen is shown
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
      // Update toggle state when settings screen is accessed
      setTimeout(updateElderlyModeToggleState, 100);
    });
  }
}); 