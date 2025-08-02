// ===== VOICE FEEDBACK MANAGER =====

(function() {
  // Helper to check if voice feedback is enabled
  function isVoiceEnabled() {
    return window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback;
  }

  // Helper to speak text
  function speak(text) {
    if (isVoiceEnabled() && typeof window.msmeApp.speakText === 'function') {
      window.msmeApp.speakText(text);
    }
  }

  // Attach voice feedback to elements
  function attachVoiceFeedback() {
    // Helper to add feedback to a node
    function addFeedback(node, label) {
      node.removeEventListener('focus', node._voiceFeedbackHandler || (() => {}));
      node._voiceFeedbackHandler = function() { speak(label || node.textContent.trim()); };
      node.addEventListener('focus', node._voiceFeedbackHandler);
    }

    // Buttons and actions
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-add-item, .action-btn, .view-btn, .setting-action, .category-btn, .step-actions button, .form-actions button, .registration-step button, .help-btn, .close-btn, .back-btn').forEach(btn => {
      addFeedback(btn);
    });

    // Navigation and dashboard
    document.querySelectorAll('.nav-item, .action-card, .metric-card, .view-all-btn, .balance-card').forEach(item => {
      let label = item.querySelector('.nav-label, .action-label, h3, h4, span')?.textContent || item.textContent;
      addFeedback(item, label);
    });

    // Cards and summary
    document.querySelectorAll('.summary-card, .invoice-item, .invoice-card, .bank-card, .user-type-card, .toggle-card, .account-card, .recipient-card').forEach(card => {
      let label = card.querySelector('h3, h4, span, .card-value, .card-info h3')?.textContent || card.textContent;
      addFeedback(card, label);
    });

    // Settings toggles and selects
    document.querySelectorAll('.setting-item input[type="checkbox"], .setting-item select').forEach(input => {
      let label = input.closest('.setting-item')?.querySelector('span')?.textContent;
      addFeedback(input, label);
    });

    // Search and filter
    document.querySelectorAll('.search-btn, .search-bar input, .search-results-list .search-result-item').forEach(el => {
      addFeedback(el);
    });

    // Demo and category
    document.querySelectorAll('.demo-section button, .category-buttons button').forEach(btn => {
      addFeedback(btn);
    });

    // Progress and steps
    document.querySelectorAll('.step-number, .step-label, .progress-bar, .progress-fill').forEach(el => {
      addFeedback(el);
    });

    // Modal context (repeat for modal children)
    document.querySelectorAll('.modal .btn-primary, .modal .btn-secondary, .modal .btn-tertiary, .modal .close-btn, .modal .help-btn, .modal .back-btn, .modal .form-actions button, .modal .step-actions button, .modal .category-btn, .modal .setting-action, .modal .toggle-card, .modal .user-type-card, .modal .bank-card, .modal .account-card, .modal .recipient-card, .modal .action-card, .modal .nav-item, .modal .metric-card, .modal .view-all-btn, .modal .balance-card, .modal .setting-item input[type="checkbox"], .modal .setting-item select, .modal .search-btn, .modal .search-bar input, .modal .search-results-list .search-result-item, .modal .demo-section button, .modal .category-buttons button, .modal .step-number, .modal .step-label, .modal .progress-bar, .modal .progress-fill').forEach(el => {
      addFeedback(el);
    });
  }

  // Attach on DOMContentLoaded and after navigation/screen changes
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(attachVoiceFeedback, 500);
    // Also re-attach after navigation or dynamic content changes
    const observer = new MutationObserver(() => {
      setTimeout(attachVoiceFeedback, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})(); 