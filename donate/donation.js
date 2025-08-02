// ===== DONATION MANAGER =====

class DonationManager {
    constructor() {
        this.currentScreen = 'categories-screen';
        this.selectedCategory = null;
        this.selectedNGO = null;
        this.donationAmount = 0;
        this.selectedAccount = null;
        this.selectedPaymentMethod = null;
        this.pin = '';
        this.ngos = {
            orphanage: [
                {
                    id: 'org_001',
                    name: 'Hope Children\'s Home',
                    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGRkMxMDciLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SENIPC90ZXh0Pjwvc3ZnPg==',
                    mission: 'Providing loving homes for orphaned children',
                    taxId: 'LHDN-123456',
                    category: 'orphanage'
                },
                {
                    id: 'org_002',
                    name: 'Rumah Kasih',
                    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGNDQzMzYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+Uks8L3RleHQ+PC9zdmc+',
                    mission: 'Supporting children in need with education and care',
                    taxId: 'LHDN-234567',
                    category: 'orphanage'
                }
            ],
            elderly: [
                {
                    id: 'org_003',
                    name: 'Senior Care Malaysia',
                    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0Q0FGNTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+U0NNPC90ZXh0Pjwvc3ZnPg==',
                    mission: 'Ensuring dignity and care for our elderly',
                    taxId: 'LHDN-345678',
                    category: 'elderly'
                }
            ],
            animals: [
                {
                    id: 'org_004',
                    name: 'SPCA Malaysia',
                    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyMTk2RjMiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+U1BDQTwvdGV4dD48L3N2Zz4=',
                    mission: 'Protecting and caring for abandoned animals',
                    taxId: 'LHDN-456789',
                    category: 'animals'
                }
            ],
            environment: [
                {
                    id: 'org_005',
                    name: 'Green Earth MY',
                    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM4QkMzNEEiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+R0VNPC90ZXh0Pjwvc3ZnPg==',
                    mission: 'Preserving Malaysia\'s natural environment',
                    taxId: 'LHDN-567890',
                    category: 'environment'
                }
            ],
            education: [
                {
                    id: 'org_006',
                    name: 'Education For All',
                    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM5QzI3QjAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+RUZBPC90ZXh0Pjwvc3ZnPg==',
                    mission: 'Making quality education accessible to everyone',
                    taxId: 'LHDN-678901',
                    category: 'education'
                }
            ]
        };
        
        // Initialize
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBankAccounts();
        
        // Check if returning from Maybank payment
        this.checkMaybankReturn();
    }

    checkMaybankReturn() {
        const maybankSuccess = localStorage.getItem('maybank_payment_success');
        const maybankCancelled = localStorage.getItem('maybank_payment_cancelled');
        
        if (maybankSuccess || maybankCancelled) {
            // We're returning from Maybank payment
            this.processDonation();
        }
    }

    setupEventListeners() {
        // Biometric button
        const biometricBtn = document.getElementById('use-biometric');
        if (biometricBtn) {
            biometricBtn.addEventListener('click', () => this.handleBiometricAuth());
        }

        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-category');
                if (category) {
                    this.selectCategory(category);
                }
            });
        });
    }

    generatePinPad() {
        const pinPad = document.querySelector('.pin-pad');
        if (!pinPad) return;

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'backspace', 0, 'confirm'];
        pinPad.innerHTML = numbers.map(num => {
            if (num === 'backspace') {
                return `<button class="pin-btn special" onclick="handlePinInput('', 'backspace')">⌫</button>`;
            } else if (num === 'confirm') {
                return `<button class="pin-btn special" onclick="handlePinInput('', 'confirm')">✓</button>`;
            } else {
                return `<button class="pin-btn" onclick="handlePinInput(${num}, 'number')">${num}</button>`;
            }
        }).join('');
    }

    loadBankAccounts() {
        const accounts = [
            {
                id: 'acc_001',
                bank: 'Maybank',
                name: 'Business Account',
                number: '1234 5678 9012',
                balance: 15420.50,
                color: '#FFC107'
            },
            {
                id: 'acc_002',
                bank: 'CIMB',
                name: 'Current Account',
                number: '2345 6789 0123',
                balance: 8930.20,
                color: '#F44336'
            },
            {
                id: 'acc_003',
                bank: 'Public Bank',
                name: 'Savings Account',
                number: '3456 7890 1234',
                balance: 2456.75,
                color: '#4CAF50'
            }
        ];

        const container = document.getElementById('bank-accounts');
        if (container) {
            container.innerHTML = accounts.map(acc => `
                <div class="bank-account-card" onclick="donationManager.selectAccount('${acc.id}')">
                    <div class="bank-logo" style="background-color: ${acc.color}">
                        ${acc.bank[0]}
                    </div>
                    <div class="bank-details">
                        <h3>${acc.bank}</h3>
                        <p>${acc.name}</p>
                        <p class="account-number">${acc.number}</p>
                    </div>
                    <div class="account-balance">
                        RM ${acc.balance.toFixed(2)}
                    </div>
                </div>
            `).join('');
        }
    }

    selectCategory(category) {
        this.selectedCategory = category;
        console.log('Selected Category:', category);
        this.renderNGOList(category);
        goToScreen('ngo-screen');
    }

    renderNGOList(category) {
        const container = document.getElementById('ngo-list');
        if (!container) return;

        const ngos = this.ngos[category] || [];
        container.innerHTML = ngos.map(ngo => `
            <div class="ngo-card" onclick="donationManager.selectNGO('${ngo.id}')">
                <img src="${ngo.logo}" alt="${ngo.name} logo" class="ngo-logo">
                <div class="ngo-info">
                    <h3>${ngo.name}</h3>
                    <p>${ngo.mission}</p>
                    <small class="tax-id">Tax ID: ${ngo.taxId}</small>
                </div>
            </div>
        `).join('');
    }

    filterNGOs(searchTerm) {
        const container = document.getElementById('ngo-list');
        if (!container || !this.selectedCategory) return;

        const ngos = this.ngos[this.selectedCategory];
        const filtered = ngos.filter(ngo => 
            ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ngo.mission.toLowerCase().includes(searchTerm.toLowerCase())
        );

        container.innerHTML = filtered.map(ngo => `
            <div class="ngo-card" onclick="selectNGO('${ngo.id}')">
                <img src="${ngo.logo}" alt="${ngo.name} logo" class="ngo-logo">
                <div class="ngo-info">
                    <h3>${ngo.name}</h3>
                    <p>${ngo.mission}</p>
                    <small class="tax-id">Tax ID: ${ngo.taxId}</small>
                </div>
            </div>
        `).join('');
    }

    selectNGO(ngoId) {
        const category = this.selectedCategory;
        this.selectedNGO = this.ngos[category].find(ngo => ngo.id === ngoId);
        
        if (this.selectedNGO) {
            console.log('Selected NGO:', this.selectedNGO);
            
            // Update NGO info in amount screen
            const selectedNgoLogo = document.getElementById('selected-ngo-logo');
            const selectedNgoName = document.getElementById('selected-ngo-name');
            
            if (selectedNgoLogo) {
                selectedNgoLogo.src = this.selectedNGO.logo;
                selectedNgoLogo.alt = `${this.selectedNGO.name} logo`;
            }
            if (selectedNgoName) {
                selectedNgoName.textContent = this.selectedNGO.name;
            }
        }
        
        // Go to amount screen
        goToScreen('amount-screen');
    }

    setAmount(amount) {
        this.donationAmount = amount;
        document.getElementById('custom-amount').value = amount;
        this.updateAmountDisplay();
    }

    updateAmount(value) {
        this.donationAmount = parseFloat(value) || 0;
        this.updateAmountDisplay();
        // Hide error message when amount is entered
        document.getElementById('amount-error').style.display = 'none';
    }

    updateAmountDisplay() {
        const buttons = document.querySelectorAll('.amount-btn');
        buttons.forEach(btn => {
            const amount = parseInt(btn.textContent.replace('RM ', ''));
            if (amount === this.donationAmount) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
        // Hide error message when amount is selected
        document.getElementById('amount-error').style.display = 'none';
    }

    validateDonationAmount() {
        if (this.donationAmount <= 0) {
            document.getElementById('amount-error').style.display = 'block';
            return false;
        }
        document.getElementById('amount-error').style.display = 'none';
        return true;
    }

    updateDonationSummary() {
        const summaryNgo = document.getElementById('summary-ngo');
        const summaryAmount = document.getElementById('summary-amount');
        
        if (summaryNgo && this.selectedNGO) {
            summaryNgo.textContent = this.selectedNGO.name;
        }
        if (summaryAmount && this.donationAmount) {
            summaryAmount.textContent = `RM ${this.donationAmount.toFixed(2)}`;
        }
    }

    selectPaymentMethod(method) {
        console.log('Selected payment method:', method);
        
        if (method === 'maybank') {
            // Redirect to Maybank payment interface
            this.redirectToMaybank();
        } else {
            // For other payment methods, go to PIN screen
            this.selectedPaymentMethod = method;
            goToScreen('pin-screen');
        }
    }

    redirectToMaybank() {
        // Store transaction data for Maybank interface
        const transactionData = {
            amount: this.donationAmount,
            recipient: this.selectedNGO.name,
            account: 'Maybank Business Account (1234 5678 9012)',
            type: 'donation'
        };
        
        localStorage.setItem('maybank_transaction_data', JSON.stringify(transactionData));
        localStorage.setItem('donation_return_url', 'donate.html');
        
        // Redirect to Maybank payment interface
        window.location.href = 'maybank-payment.html';
    }

    selectAccount(accountId) {
        const accounts = document.querySelectorAll('.bank-account-card');
        accounts.forEach(acc => acc.classList.remove('selected'));
        
        const selectedCard = document.querySelector(`.bank-account-card[onclick*="${accountId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            this.selectedAccount = accountId;
            
            // Get bank account details
            const bankName = selectedCard.querySelector('.bank-details h3').textContent;
            const accountNumber = selectedCard.querySelector('.account-number').textContent;

            // Update the confirmation screen details
            const recipientNameEl = document.getElementById('recipient-name');
            const paymentAmountEl = document.getElementById('payment-amount');
            const sourceAccountEl = document.getElementById('source-account');

            if (recipientNameEl && this.selectedNGO) {
                recipientNameEl.textContent = this.selectedNGO.name;
            }
            if (paymentAmountEl && this.donationAmount) {
                paymentAmountEl.textContent = `RM ${this.donationAmount.toFixed(2)}`;
            }
            if (sourceAccountEl && bankName) {
                sourceAccountEl.textContent = `${bankName} (${accountNumber})`;
            }

            // Log current state for debugging
            console.log('Current State:', {
                ngo: this.selectedNGO,
                amount: this.donationAmount,
                account: this.selectedAccount,
                bankName,
                accountNumber
            });
            
            // Reset PIN state
            this.pin = '';
            document.querySelectorAll('.pin-dot').forEach(dot => dot.classList.remove('filled'));
            
            // Go to bank screen
            goToScreen('bank-screen');
        }
    }

    initializePinPad() {
        const pinPad = document.querySelector('.pin-pad');
        if (!pinPad) return;

        // Reset PIN
        this.pin = '';
        document.querySelectorAll('.pin-dot').forEach(dot => dot.classList.remove('filled'));

        // Generate PIN pad buttons
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'backspace', 0, 'confirm'];
        pinPad.innerHTML = numbers.map(num => {
            if (num === 'backspace') {
                return `<button class="pin-btn special" onclick="donationManager.handlePinInput('', 'backspace')">⌫</button>`;
            } else if (num === 'confirm') {
                return `<button class="pin-btn special" onclick="donationManager.handlePinInput('', 'confirm')">✓</button>`;
            } else {
                return `<button class="pin-btn" onclick="donationManager.handlePinInput(${num}, 'number')">${num}</button>`;
            }
        }).join('');
    }

    updateConfirmationDetails() {
        document.getElementById('confirm-ngo').textContent = this.selectedNGO.name;
        document.getElementById('confirm-amount').textContent = `RM ${this.donationAmount.toFixed(2)}`;
        document.getElementById('confirm-account').textContent = 
            `${this.selectedAccount} (**** ${this.selectedAccount.slice(-4)})`;
        document.getElementById('confirm-tax-id').textContent = this.selectedNGO.taxId;
    }

    handlePinInput(value, action) {
        const dots = document.querySelectorAll('.pin-dot');
        
        switch (action) {
            case 'number':
                if (this.pin.length < 6) {
                    this.pin += value;
                    dots[this.pin.length - 1].classList.add('filled');
                    
                    if (this.pin.length === 6) {
                        setTimeout(() => this.validatePin(), 500);
                    }
                }
                break;
                
            case 'backspace':
                if (this.pin.length > 0) {
                    this.pin = this.pin.slice(0, -1);
                    dots[this.pin.length].classList.remove('filled');
                }
                break;
                
            case 'confirm':
                if (this.pin.length === 6) {
                    this.validatePin();
                }
                break;
        }
    }

    handleBiometricAuth() {
        const sensor = document.getElementById('use-biometric');
        sensor.classList.add('authenticating');
        
        // Simulate authentication process
        setTimeout(() => {
            sensor.classList.add('authenticated');
            setTimeout(() => this.processDonation(), 500);
        }, 1000);
    }

    validatePin() {
        // Simulate PIN validation (demo always succeeds)
        this.processDonation();
    }

    processDonation() {
        // Check if we're returning from Maybank payment
        const maybankSuccess = localStorage.getItem('maybank_payment_success');
        const maybankCancelled = localStorage.getItem('maybank_payment_cancelled');
        
        if (maybankSuccess) {
            // Payment was successful via Maybank
            const successData = JSON.parse(maybankSuccess);
            this.handleMaybankSuccess(successData);
            return;
        } else if (maybankCancelled) {
            // Payment was cancelled via Maybank
            localStorage.removeItem('maybank_payment_cancelled');
            localStorage.removeItem('maybank_payment_success');
            // Stay on current screen or go back to bank selection
            goToScreen('bank-selection-screen');
            return;
        }
        
        // Regular donation processing for non-Maybank payments
        setTimeout(() => {
            const now = new Date();
            const formattedDate = now.toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });

            const transaction = {
                id: `don_${Date.now()}`,
                type: 'donation',
                amount: this.donationAmount,
                ngo: this.selectedNGO,
                account: this.selectedPaymentMethod || 'Unknown',
                date: now.toISOString(),
                status: 'completed',
                reference: `DON${now.toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random() * 1000)}`
            };
            
            // Save to donations history
            this.saveTransaction(transaction);

            // Save to invoice system
            this.saveToInvoiceSystem(transaction);
            
            // Store data for success page
            localStorage.setItem('donation_success_data', JSON.stringify({
                amount: this.donationAmount,
                ngo: this.selectedNGO.name,
                date: formattedDate
            }));
            
            // Navigate to success page
            window.location.href = 'donation-success.html';
        }, 1500);
    }

    handleMaybankSuccess(successData) {
        // Clear Maybank data
        localStorage.removeItem('maybank_payment_success');
        localStorage.removeItem('maybank_payment_cancelled');
        localStorage.removeItem('maybank_transaction_data');
        
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        const transaction = {
            id: successData.transactionId || `don_${Date.now()}`,
            type: 'donation',
            amount: successData.amount,
            ngo: { name: successData.recipient },
            account: 'Maybank',
            date: now.toISOString(),
            status: 'completed',
            reference: successData.transactionId || `DON${now.toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random() * 1000)}`
        };
        
        // Save to donations history
        this.saveTransaction(transaction);

        // Save to invoice system
        this.saveToInvoiceSystem(transaction);
        
        // Store data for success page
        localStorage.setItem('donation_success_data', JSON.stringify({
            amount: successData.amount,
            ngo: successData.recipient,
            date: formattedDate
        }));
        
        // Navigate to success page
        window.location.href = 'donation-success.html';
    }

    setupHeartInteraction() {
        const heartIcon = document.querySelector('.success-icon');
        if (heartIcon) {
            heartIcon.addEventListener('click', () => {
                // Add extra beat animation
                heartIcon.style.animation = 'none';
                heartIcon.offsetHeight; // Trigger reflow
                heartIcon.style.animation = 'heartBeat 0.6s ease-in-out';
                
                // Change heart color randomly
                const hearts = ['❤️', '💖', '💝', '💗', '💓', '💕'];
                heartIcon.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            });
        }
    }

    saveTransaction(transaction) {
        try {
            let donations = JSON.parse(localStorage.getItem('msme-donations') || '[]');
            donations.unshift(transaction);
            localStorage.setItem('msme-donations', JSON.stringify(donations));
        } catch (error) {
            console.warn('Failed to save donation:', error);
        }
    }

    saveToInvoiceSystem(transaction) {
        try {
            // Get existing invoices
            let invoices = JSON.parse(localStorage.getItem('msme-invoices') || '[]');
            
            // Create invoice record
            const invoice = {
                id: transaction.reference,
                customerName: transaction.ngo.name,
                customerEmail: '',
                amount: transaction.amount,
                date: transaction.date.split('T')[0],
                dueDate: transaction.date.split('T')[0], // Same as date for donations
                status: 'completed',
                type: 'donation',
                items: [{
                    description: `Donation to ${transaction.ngo.name}`,
                    quantity: 1,
                    price: transaction.amount
                }]
            };
            
            // Add to invoices
            invoices.unshift(invoice);
            localStorage.setItem('msme-invoices', JSON.stringify(invoices));
        } catch (error) {
            console.warn('Failed to save donation to invoice system:', error);
        }
    }

    viewInvoice() {
        // Generate and show tax-deductible invoice
        // Implementation similar to invoice.js
        alert('Tax receipt will be downloaded');
    }

    shareImpact() {
        const shareText = `I just donated RM ${this.donationAmount.toFixed(2)} to ${this.selectedNGO.name} to support ${this.selectedNGO.mission.toLowerCase()}! Join me in making a difference! #MSMECares`;
        
        if (navigator.share) {
            navigator.share({
                title: 'I Made a Difference!',
                text: shareText,
                url: window.location.origin
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Share text copied to clipboard!');
            });
        }
    }
}

// Initialize donation manager
const donationManager = new DonationManager();

// Global functions
function selectCategory(category) {
    donationManager.selectCategory(category);
}

function selectNGO(ngoId) {
    donationManager.selectNGO(ngoId);
}

function setAmount(amount) {
    donationManager.setAmount(amount);
}

function updateAmount(value) {
    donationManager.updateAmount(value);
}

function selectAccount(accountId) {
    donationManager.selectAccount(accountId);
}

function handlePinInput(value, action) {
    donationManager.handlePinInput(value, action);
}

function handleBiometricAuth() {
    donationManager.handleBiometricAuth();
}

function viewInvoice() {
    donationManager.viewInvoice();
}

function shareImpact() {
    donationManager.shareImpact();
}

function goToScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
}

function goToDashboard() {
    window.location.href = 'index.html';
}

function filterNGOs(searchTerm) {
    donationManager.filterNGOs(searchTerm);
} 

function validateAndProceed() {
    if (donationManager.validateDonationAmount()) {
        // Update summary information
        donationManager.updateDonationSummary();
        goToScreen('bank-selection-screen');
    }
}

function selectPaymentMethod(method) {
    donationManager.selectPaymentMethod(method);
} 