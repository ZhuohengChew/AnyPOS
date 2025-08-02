// Maybank Payment Interface JavaScript

class MaybankPayment {
    constructor() {
        this.pin = '';
        this.currentMethod = 'pin';
        this.transactionData = null;
        this.maxPinLength = 6;
        
        this.init();
    }

    init() {
        this.loadTransactionData();
        this.setupEventListeners();
        this.updateTransactionDetails();
        this.generateTransactionReference();
    }

    loadTransactionData() {
        // Get transaction data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const storedData = localStorage.getItem('maybank_transaction_data');
        
        if (storedData) {
            this.transactionData = JSON.parse(storedData);
        } else if (urlParams.get('amount') && urlParams.get('recipient')) {
            this.transactionData = {
                amount: parseFloat(urlParams.get('amount')),
                recipient: urlParams.get('recipient'),
                account: urlParams.get('account') || 'Maybank Business Account',
                type: 'donation'
            };
        } else {
            // Fallback data for demo
            this.transactionData = {
                amount: 50.00,
                recipient: 'SPCA Malaysia',
                account: 'Maybank Business Account (1234 5678 9012)',
                type: 'donation'
            };
        }
    }

    setupEventListeners() {
        // Method selection
        document.getElementById('pin-method').addEventListener('click', () => {
            this.switchToPin();
        });

        document.getElementById('biometric-method').addEventListener('click', () => {
            this.switchToBiometric();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });

        // Focus management
        document.addEventListener('focusin', (e) => {
            this.handleFocusChange(e);
        });
    }

    updateTransactionDetails() {
        if (!this.transactionData) return;

        const recipientEl = document.getElementById('recipient-name');
        const amountEl = document.getElementById('payment-amount');
        const accountEl = document.getElementById('source-account');
        const dateEl = document.getElementById('transaction-date');

        if (recipientEl) {
            recipientEl.textContent = this.transactionData.recipient;
        }
        if (amountEl) {
            amountEl.textContent = `RM ${this.transactionData.amount.toFixed(2)}`;
        }
        if (accountEl) {
            accountEl.textContent = this.transactionData.account;
        }
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleString('en-MY', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    generateTransactionReference() {
        const now = new Date();
        const timestamp = now.getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const reference = `MB${timestamp}${random}`;
        
        const refEl = document.getElementById('transaction-ref');
        if (refEl) {
            refEl.textContent = reference;
        }
        
        return reference;
    }

    handlePinInput(value) {
        const dots = document.querySelectorAll('.pin-dot');
        
        if (value === 'backspace') {
            if (this.pin.length > 0) {
                this.pin = this.pin.slice(0, -1);
                dots[this.pin.length].classList.remove('filled');
            }
        } else if (value === 'confirm') {
            if (this.pin.length === this.maxPinLength) {
                this.validatePin();
            }
        } else if (typeof value === 'number' && this.pin.length < this.maxPinLength) {
            this.pin += value;
            dots[this.pin.length - 1].classList.add('filled');
            
            // Auto-submit when PIN is complete
            if (this.pin.length === this.maxPinLength) {
                setTimeout(() => this.validatePin(), 500);
            }
        }
        
        // Update instruction text
        this.updatePinInstruction();
    }

    updatePinInstruction() {
        const instructionEl = document.querySelector('.pin-instruction');
        if (instructionEl) {
            if (this.pin.length === 0) {
                instructionEl.textContent = 'Enter your 6-digit PIN';
            } else if (this.pin.length < this.maxPinLength) {
                instructionEl.textContent = `${this.maxPinLength - this.pin.length} digits remaining`;
            } else {
                instructionEl.textContent = 'PIN complete - processing...';
            }
        }
    }

    handleKeyboardInput(e) {
        // Allow number keys (0-9)
        if (e.key >= '0' && e.key <= '9') {
            this.handlePinInput(parseInt(e.key));
        }
        // Allow backspace
        else if (e.key === 'Backspace') {
            this.handlePinInput('backspace');
        }
        // Allow Enter for confirmation
        else if (e.key === 'Enter') {
            this.handlePinInput('confirm');
        }
        // Allow Escape to cancel
        else if (e.key === 'Escape') {
            this.cancelPayment();
        }
    }

    handleFocusChange(e) {
        // Ensure focus is managed properly for accessibility
        if (e.target.classList.contains('pin-btn')) {
            e.target.setAttribute('aria-label', `PIN digit ${e.target.textContent}`);
        }
    }

    switchToPin() {
        this.currentMethod = 'pin';
        document.getElementById('pin-method').classList.add('active');
        document.getElementById('biometric-method').classList.remove('active');
        document.getElementById('pin-section').style.display = 'block';
        document.getElementById('biometric-section').style.display = 'none';
        
        // Reset PIN
        this.pin = '';
        document.querySelectorAll('.pin-dot').forEach(dot => dot.classList.remove('filled'));
        this.updatePinInstruction();
        
        // Focus on first PIN button for accessibility
        const firstPinBtn = document.querySelector('.pin-btn');
        if (firstPinBtn) {
            firstPinBtn.focus();
        }
    }

    switchToBiometric() {
        this.currentMethod = 'biometric';
        document.getElementById('biometric-method').classList.add('active');
        document.getElementById('pin-method').classList.remove('active');
        document.getElementById('biometric-section').style.display = 'block';
        document.getElementById('pin-section').style.display = 'none';
        
        // Simulate biometric authentication
        this.simulateBiometricAuth();
    }

    simulateBiometricAuth() {
        const fingerprintIcon = document.querySelector('.fingerprint-icon');
        const instruction = document.querySelector('.biometric-display h3');
        
        if (fingerprintIcon && instruction) {
            instruction.textContent = 'Processing fingerprint...';
            fingerprintIcon.style.animation = 'pulse 0.5s infinite';
            
            setTimeout(() => {
                instruction.textContent = 'Authentication successful!';
                fingerprintIcon.textContent = '✅';
                fingerprintIcon.style.animation = 'none';
                
                setTimeout(() => {
                    this.processPayment();
                }, 1000);
            }, 2000);
        }
    }

    validatePin() {
        // Simulate PIN validation (demo always succeeds)
        // In real implementation, this would validate against Maybank's API
        
        // Show processing state
        const instructionEl = document.querySelector('.pin-instruction');
        if (instructionEl) {
            instructionEl.textContent = 'Validating PIN...';
        }
        
        setTimeout(() => {
            this.processPayment();
        }, 1000);
    }

    processPayment() {
        // Show processing overlay
        const processingOverlay = document.getElementById('processing-overlay');
        if (processingOverlay) {
            processingOverlay.style.display = 'flex';
        }
        
        // Simulate payment processing
        setTimeout(() => {
            // Hide processing overlay
            if (processingOverlay) {
                processingOverlay.style.display = 'none';
            }
            
            // Show success overlay
            const successOverlay = document.getElementById('success-overlay');
            if (successOverlay) {
                successOverlay.style.display = 'flex';
            }
            
            // Store success data for return to app
            this.storeSuccessData();
            
        }, 3000);
    }

    storeSuccessData() {
        const successData = {
            status: 'success',
            transactionId: this.generateTransactionReference(),
            amount: this.transactionData.amount,
            recipient: this.transactionData.recipient,
            timestamp: new Date().toISOString(),
            method: this.currentMethod
        };
        
        localStorage.setItem('maybank_payment_success', JSON.stringify(successData));
    }

    cancelPayment() {
        // Store cancellation data
        const cancelData = {
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            reason: 'user_cancelled'
        };
        
        localStorage.setItem('maybank_payment_cancelled', JSON.stringify(cancelData));
        
        // Return to app
        this.returnToApp();
    }

    returnToApp() {
        // Check if we're in an iframe or standalone
        if (window.parent !== window) {
            // In iframe - send message to parent
            window.parent.postMessage({
                type: 'maybank_payment_complete',
                data: localStorage.getItem('maybank_payment_success') || 
                      localStorage.getItem('maybank_payment_cancelled')
            }, '*');
        } else {
            // Standalone - redirect back to donation page
            const returnUrl = localStorage.getItem('donation_return_url') || 'donate.html';
            window.location.href = returnUrl;
        }
    }

    showHelp() {
        // Show help modal or redirect to help page
        const helpText = `
            Need help with your payment?
            
            • Ensure you're using the correct PIN
            • Make sure your device is secure
            • Contact Maybank support if you need assistance
            
            For immediate help, call Maybank at 1-300-88-6688
        `;
        
        alert(helpText);
    }

    // Public methods for external access
    static getInstance() {
        if (!MaybankPayment.instance) {
            MaybankPayment.instance = new MaybankPayment();
        }
        return MaybankPayment.instance;
    }
}

// Initialize Maybank Payment
const maybankPayment = MaybankPayment.getInstance();

// Global functions for HTML onclick handlers
function handlePinInput(value) {
    maybankPayment.handlePinInput(value);
}

function switchToPin() {
    maybankPayment.switchToPin();
}

function switchToBiometric() {
    maybankPayment.switchToBiometric();
}

function cancelPayment() {
    maybankPayment.cancelPayment();
}

function showHelp() {
    maybankPayment.showHelp();
}

function returnToApp() {
    maybankPayment.returnToApp();
}

// Handle messages from parent window (if in iframe)
window.addEventListener('message', (event) => {
    if (event.data.type === 'init_maybank_payment') {
        // Initialize with data from parent
        if (event.data.transactionData) {
            localStorage.setItem('maybank_transaction_data', JSON.stringify(event.data.transactionData));
            maybankPayment.loadTransactionData();
            maybankPayment.updateTransactionDetails();
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause any ongoing processes
        console.log('Maybank payment page hidden');
    } else {
        // Page is visible again
        console.log('Maybank payment page visible');
    }
});

// Handle beforeunload event
window.addEventListener('beforeunload', (event) => {
    // Warn user if they try to leave during payment
    if (maybankPayment.pin.length > 0 && maybankPayment.pin.length < maybankPayment.maxPinLength) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your payment may be cancelled.';
        return event.returnValue;
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaybankPayment;
} 