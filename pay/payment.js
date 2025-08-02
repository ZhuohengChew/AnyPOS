// ===== PAYMENT FLOW CONTROLLER =====

// State Management
const paymentState = {
    currentScreen: 'recipients-screen',
    selectedRecipient: null,
    selectedAccount: null,
    paymentAmount: 0,
    pin: '',
    category: null,
    recipients: [], // Store all recipients (frequent + saved)
    securityStatus: null // Store security verification results
};

// Security Verification System
const securitySystem = {
    // Risk factors for system detection
    riskFactors: {
        unusualHours: {
            start: 23, // 11 PM
            end: 6,    // 6 AM
            weight: 0.3
        },
        newPayer: {
            threshold: 1, // First transaction
            weight: 0.4
        },
        highValue: {
            threshold: 1000, // RM 1000
            weight: 0.5
        },
        newDevice: {
            weight: 0.3
        },
        userReports: {
            threshold: 3, // 3 or more reports
            weight: 0.8
        }
    },

    // Check if current time is unusual for payments
    checkUnusualHours() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= this.riskFactors.unusualHours.start || hour <= this.riskFactors.unusualHours.end;
    },

    // Check if this is a new payer
    checkNewPayer(recipient) {
        return recipient.frequency <= this.riskFactors.newPayer.threshold;
    },

    // Check if payment amount is high value
    checkHighValue(amount) {
        return amount >= this.riskFactors.highValue.threshold;
    },

    // Check if this is a new device (simulated)
    checkNewDevice() {
        // In real implementation, this would check device fingerprint
        // For demo, we'll simulate 20% chance of new device
        return Math.random() < 0.2;
    },

    // Check user reports for this recipient
    checkUserReports(recipientId) {
        const reports = JSON.parse(localStorage.getItem('merchantReports') || '[]');
        const recipientReports = reports.filter(report => report.merchantId === recipientId);
        return recipientReports.length >= this.riskFactors.userReports.threshold;
    },

    // Calculate overall risk score
    calculateRiskScore(recipient, amount) {
        let riskScore = 0;
        let riskFactors = [];

        // Check unusual hours
        if (this.checkUnusualHours()) {
            riskScore += this.riskFactors.unusualHours.weight;
            riskFactors.push('Unusual payment hours (11 PM - 6 AM)');
        }

        // Check new payer
        if (this.checkNewPayer(recipient)) {
            riskScore += this.riskFactors.newPayer.weight;
            riskFactors.push('New or unverified recipient');
        }

        // Check high value
        if (this.checkHighValue(amount)) {
            riskScore += this.riskFactors.highValue.weight;
            riskFactors.push('High-value payment');
        }

        // Check new device
        if (this.checkNewDevice()) {
            riskScore += this.riskFactors.newDevice.weight;
            riskFactors.push('New device detected');
        }

        // Check user reports
        if (this.checkUserReports(recipient.id)) {
            riskScore += this.riskFactors.userReports.weight;
            riskFactors.push('Multiple user reports received');
        }

        return {
            score: Math.min(riskScore, 1), // Cap at 1.0
            factors: riskFactors,
            level: this.getRiskLevel(riskScore)
        };
    },

    // Determine risk level based on score
    getRiskLevel(score) {
        if (score >= 0.7) return 'high';
        if (score >= 0.4) return 'medium';
        return 'low';
    },

    // Verify recipient with external sources
    async verifyRecipient(recipient) {
        // Simulate external verification
        const verificationResults = {
            rmpStatus: await this.checkRMPStatus(recipient),
            bankVerification: await this.verifyBankAccount(recipient),
            businessRegistration: await this.verifyBusinessRegistration(recipient),
            timestamp: new Date().toISOString()
        };

        return verificationResults;
    },

    // Check RMP status (simulated)
    async checkRMPStatus(recipient) {
        // Simulate API call to RMP database
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, simulate different scenarios
        const scenarios = [
            { status: 'clean', confidence: 0.95 },
            { status: 'suspicious', confidence: 0.85 },
            { status: 'reported', confidence: 0.90 }
        ];
        
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    },

    // Verify bank account (simulated)
    async verifyBankAccount(recipient) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate bank verification
        return {
            verified: Math.random() > 0.1, // 90% success rate
            accountType: 'Savings',
            accountStatus: 'Active'
        };
    },

    // Verify business registration (simulated)
    async verifyBusinessRegistration(recipient) {
        if (recipient.type !== 'business') {
            return { verified: true, type: 'individual' };
        }

        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
            verified: Math.random() > 0.15, // 85% success rate
            registrationNumber: recipient.businessRegistration || 'N/A',
            businessType: 'Private Limited'
        };
    }
};

// Load recipients from localStorage
function loadRecipientsFromStorage() {
    const savedRecipients = localStorage.getItem('savedRecipients');
    if (savedRecipients) {
        return JSON.parse(savedRecipients);
    }
    return [];
}

// Save recipients to localStorage
function saveRecipientsToStorage() {
    localStorage.setItem('savedRecipients', JSON.stringify(paymentState.recipients));
}

// Screen Navigation
function goToScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    paymentState.currentScreen = screenId;
}

// ===== SCREEN 1: RECIPIENTS =====

// Initialize Recipients
function initializeRecipients() {
    // Initialize search with debounce
    const searchInput = document.getElementById('recipient-search');
    searchInput.addEventListener('input', debounce(handleRecipientSearch, 300));

    // Load initial recipients from storage and mock data
    const savedRecipients = loadRecipientsFromStorage();
    const frequentRecipients = getFrequentRecipients();
    
    // Combine saved and frequent recipients, removing duplicates by ID
    const allRecipients = [...savedRecipients];
    frequentRecipients.forEach(frequent => {
        if (!allRecipients.some(saved => saved.id === frequent.id)) {
            allRecipients.push(frequent);
        }
    });
    
    paymentState.recipients = allRecipients;
    
    // Render the recipients list
    renderRecipientsList();
}

// New function to handle rendering of recipients list
function renderRecipientsList() {
    const recipientsGrid = document.querySelector('.recipients-grid');
    
    // Create Add New button
    const addNewButton = document.createElement('button');
    addNewButton.className = 'recipient-card add-new';
    addNewButton.onclick = () => showAddRecipientModal();
    addNewButton.innerHTML = `
        <div class="recipient-icon">+</div>
        <h3>Add New Recipient</h3>
        <p>Create new payment</p>
    `;
    
    // Clear and rebuild the grid
    recipientsGrid.innerHTML = '';
    recipientsGrid.appendChild(addNewButton);
    
    // Add all recipients
    paymentState.recipients.forEach(recipient => {
        const card = createRecipientCard(recipient);
        recipientsGrid.appendChild(card);
    });
}

function createRecipientCard(recipient) {
    const card = document.createElement('button');
    card.className = 'recipient-card';
    card.setAttribute('data-recipient-id', recipient.id);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-recipient';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking delete
        deleteRecipient(recipient.id);
    };
    
    card.innerHTML = `
        <div class="recipient-icon">${recipient.icon || recipient.name[0]}</div>
        <h3>${recipient.name}</h3>
        <p>${recipient.lastTransaction ? `Last: RM ${recipient.lastTransaction.toFixed(2)}` : 'New Recipient'}</p>
    `;
    
    // Add delete button to top-right corner
    card.appendChild(deleteBtn);
    
    // Add click handler for payment
    card.addEventListener('click', () => selectRecipient(recipient));
    
    return card;
}

function deleteRecipient(recipientId) {
    if (confirm('Are you sure you want to delete this recipient?')) {
        // Remove from state
        paymentState.recipients = paymentState.recipients.filter(r => r.id !== recipientId);
        
        // Save to localStorage if using it
        if (typeof saveRecipientsToStorage === 'function') {
            saveRecipientsToStorage();
        }
        
        // Re-render the recipients list
        renderRecipientsList();
    }
}

function getFrequentRecipients() {
    // Get recipients from mock data and sort by frequency
    const recipients = mockData.transactions.reduce((acc, txn) => {
        if (txn.type === 'expense') {
            const recipient = acc.find(r => r.name === txn.description.split(' - ')[1]);
            if (recipient) {
                recipient.frequency++;
                recipient.lastTransaction = txn.amount;
            } else {
                acc.push({
                    id: `recipient_${acc.length + 1}`,
                    name: txn.description.split(' - ')[1] || txn.description,
                    frequency: 1,
                    lastTransaction: txn.amount,
                    type: 'business', // Assume business for existing transactions
                    bankName: 'Maybank', // Default for mock data
                    accountNumber: '****' + Math.floor(1000 + Math.random() * 9000)
                });
            }
        }
        return acc;
    }, []);
    
    return recipients.sort((a, b) => b.frequency - a.frequency).slice(0, 5);
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleRecipientSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const searchResults = document.querySelector('.search-results');
    const searchResultsList = document.querySelector('.search-results-list');
    
    if (searchTerm.length < 2) {
        searchResults.style.display = 'none';
        renderRecipientsList(); // Show all recipients
        return;
    }

    // Search through all recipients
    const results = searchRecipients(searchTerm);
    
    if (results.length > 0) {
        searchResults.style.display = 'block';
        searchResultsList.innerHTML = results.map(recipient => `
            <div class="search-result-item" onclick="selectRecipient(${JSON.stringify(recipient).replace(/"/g, '&quot;')})">
                <div class="search-result-icon">${recipient.icon || recipient.name[0]}</div>
                <div class="search-result-info">
                    <h4>${recipient.name}</h4>
                    <p>${recipient.bankName} - ${recipient.accountNumber}</p>
                </div>
            </div>
        `).join('');
    } else {
        searchResults.style.display = 'block';
        searchResultsList.innerHTML = `
            <div class="search-result-item" onclick="showAddRecipientModal('${searchTerm}')">
                <div class="search-result-icon">+</div>
                <div class="search-result-info">
                    <h4>Add "${searchTerm}" as new recipient</h4>
                    <p>Click to add new recipient</p>
                </div>
            </div>
        `;
    }
}

function searchRecipients(searchTerm) {
    return paymentState.recipients.filter(recipient => 
        recipient.name.toLowerCase().includes(searchTerm) ||
        recipient.accountNumber.includes(searchTerm)
    );
}

// ===== NEW RECIPIENT MODAL =====

function showAddRecipientModal(searchTerm = '') {
    const modal = document.getElementById('add-recipient-modal');
    modal.classList.add('active');
    
    // Pre-fill name if coming from search
    if (searchTerm) {
        document.getElementById('recipient-name').value = searchTerm;
    }
}

function closeAddRecipientModal() {
    const modal = document.getElementById('add-recipient-modal');
    modal.classList.remove('active');
    document.getElementById('add-recipient-form').reset();
}

function toggleBusinessFields() {
    const recipientType = document.getElementById('recipient-type').value;
    const businessFields = document.querySelectorAll('.business-field');
    
    businessFields.forEach(field => {
        field.style.display = recipientType === 'business' ? 'block' : 'none';
        field.querySelector('input')?.removeAttribute('required');
        if (recipientType === 'business') {
            field.querySelector('input')?.setAttribute('required', 'required');
        }
    });
}

function handleAddRecipient(event) {
    event.preventDefault();
    
    const newRecipient = {
        id: `recipient_${Date.now()}`,
        type: document.getElementById('recipient-type').value,
        name: document.getElementById('recipient-name').value,
        businessRegistration: document.getElementById('business-registration').value,
        bankName: document.getElementById('bank-name').options[document.getElementById('bank-name').selectedIndex].text,
        accountNumber: document.getElementById('account-number').value,
        reference: document.getElementById('reference').value,
        icon: document.getElementById('recipient-name').value[0],
        frequency: 0,
        lastTransaction: null,
        dateAdded: new Date().toISOString() // Add timestamp for sorting
    };
    
    // Add to state at the beginning of the array
    paymentState.recipients.unshift(newRecipient);
    
    // Save to localStorage
    saveRecipientsToStorage();
    
    // Re-render the recipients list
    renderRecipientsList();
    
    // Close modal and proceed with payment
    closeAddRecipientModal();
    selectRecipient(newRecipient);
}

function selectRecipient(recipient) {
    paymentState.selectedRecipient = recipient;
    goToScreen('account-screen');
    initializeAccounts();
}

// ===== SCREEN 2: ACCOUNT SELECTION =====

function initializeAccounts() {
    const accountsList = document.querySelector('.accounts-list');
    accountsList.innerHTML = ''; // Clear existing accounts
    
    mockData.accounts.forEach(account => {
        const card = createAccountCard(account);
        accountsList.appendChild(card);
    });
}

function createAccountCard(account) {
    const card = document.createElement('div');
    card.className = 'account-card';
    card.innerHTML = `
        <div class="bank-logo">${account.bankCode[0]}</div>
        <div class="account-info">
            <h3>${account.bankName}</h3>
            <p>${account.accountNumber}</p>
        </div>
        <div class="account-balance">
            <strong>RM ${account.balance.toFixed(2)}</strong>
            <span>${account.accountType}</span>
        </div>
    `;
    card.addEventListener('click', () => selectAccount(account));
    return card;
}

function selectAccount(account) {
    paymentState.selectedAccount = account;
    goToScreen('amount-screen');
    initializeAmountScreen();
}

// Amount Screen Initialization and Handlers
function initializeAmountScreen() {
    // Update recipient and account info
    document.getElementById('amount-recipient-name').textContent = paymentState.selectedRecipient.name;
    document.getElementById('amount-account-name').textContent = 
        `${paymentState.selectedAccount.bankName} (${paymentState.selectedAccount.accountNumber})`;

    // Initialize amount input
    const amountInput = document.getElementById('payment-amount');
    const confirmButton = document.getElementById('confirm-amount-btn');
    
    // Set initial amount if it's a frequent recipient
    if (paymentState.selectedRecipient.lastTransaction) {
        amountInput.value = paymentState.selectedRecipient.lastTransaction.toFixed(2);
        validateAmount(amountInput.value);
    }

    // Add input event listeners
    amountInput.addEventListener('input', (e) => {
        validateAmount(e.target.value);
    });

    // Initialize quick amount buttons
    const quickAmounts = document.querySelectorAll('.quick-amount');
    quickAmounts.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            amountInput.value = amount;
            validateAmount(amount);
            
            // Update button states
            quickAmounts.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Add confirm button handler
    confirmButton.addEventListener('click', () => {
        paymentState.paymentAmount = parseFloat(amountInput.value);
        
        // Go to security verification screen for all payments
        goToScreen('security-verification-screen');
        initializeSecurityVerification();
    });
}

function validateAmount(value) {
    const confirmButton = document.getElementById('confirm-amount-btn');
    const amount = parseFloat(value);
    
    // Validate amount
    if (!isNaN(amount) && amount > 0 && amount <= paymentState.selectedAccount.balance) {
        confirmButton.disabled = false;
    } else {
        confirmButton.disabled = true;
    }
}

// ===== SCREEN 4: SECURITY VERIFICATION =====

async function initializeSecurityVerification() {
    // Show loading state
    const container = document.querySelector('#security-verification-screen .container');
    container.innerHTML = `
        <div class="security-loading">
            <div class="loading-spinner"></div>
            <h3>Verifying Recipient Security...</h3>
            <p>Checking multiple security databases</p>
        </div>
    `;

    try {
        // Perform security checks
        const riskAssessment = securitySystem.calculateRiskScore(paymentState.selectedRecipient, paymentState.paymentAmount);
        const verificationResults = await securitySystem.verifyRecipient(paymentState.selectedRecipient);
        
        // Store security status
        paymentState.securityStatus = {
            risk: riskAssessment,
            verification: verificationResults
        };

        // Render security verification screen
        renderSecurityVerification();
    } catch (error) {
        console.error('Security verification failed:', error);
        // Fallback to basic verification
        renderSecurityVerification();
    }
}

function renderSecurityVerification() {
    const container = document.querySelector('#security-verification-screen .container');
    const { risk, verification } = paymentState.securityStatus;
    
    container.innerHTML = `
        <div class="security-verification">
            <div class="recipient-security-info">
                <div class="recipient-avatar">
                    <span class="recipient-icon">${paymentState.selectedRecipient.icon || paymentState.selectedRecipient.name[0]}</span>
                </div>
                <h3>${paymentState.selectedRecipient.name}</h3>
                <p>${paymentState.selectedRecipient.bankName} • ${paymentState.selectedRecipient.accountNumber}</p>
                <div class="amount-display">
                    <span>Payment Amount:</span>
                    <strong>RM ${paymentState.paymentAmount.toFixed(2)}</strong>
                </div>
            </div>

            <div class="security-status">
                <div class="status-indicator ${risk.level}">
                    <div class="status-icon">
                        ${getStatusIcon(risk.level)}
                    </div>
                    <div class="status-content">
                        <h4>${getStatusTitle(risk.level)}</h4>
                        <p>${getStatusDescription(risk.level)}</p>
                    </div>
                </div>
            </div>

            ${risk.factors.length > 0 ? `
                <div class="risk-factors">
                    <h4>Risk Factors Detected:</h4>
                    <ul>
                        ${risk.factors.map(factor => `<li>⚠️ ${factor}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="verification-results">
                <h4>Verification Results:</h4>
                <div class="verification-grid">
                    <div class="verification-item ${verification.rmpStatus.status}">
                        <div class="verification-icon">👮</div>
                        <div class="verification-content">
                            <h5>RMP Status</h5>
                            <p>${getRMPStatusText(verification.rmpStatus)}</p>
                        </div>
                    </div>
                    <div class="verification-item ${verification.bankVerification.verified ? 'verified' : 'unverified'}">
                        <div class="verification-icon">🏦</div>
                        <div class="verification-content">
                            <h5>Bank Account</h5>
                            <p>${verification.bankVerification.verified ? 'Verified' : 'Unverified'}</p>
                        </div>
                    </div>
                    <div class="verification-item ${verification.businessRegistration.verified ? 'verified' : 'unverified'}">
                        <div class="verification-icon">🏢</div>
                        <div class="verification-content">
                            <h5>Business Registration</h5>
                            <p>${verification.businessRegistration.verified ? 'Verified' : 'Unverified'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="security-actions">
                ${risk.level === 'high' ? `
                    <div class="high-risk-warning">
                        <div class="warning-icon">🚨</div>
                        <div class="warning-content">
                            <h4>High Risk Transaction</h4>
                            <p>This transaction has been flagged as high risk. We recommend:</p>
                            <ul>
                                <li>Double-check the recipient details</li>
                                <li>Verify the payment purpose</li>
                                <li>Consider reporting if suspicious</li>
                            </ul>
                        </div>
                    </div>
                ` : ''}
                
                <div class="action-buttons">
                    <button class="btn-primary ${risk.level === 'high' ? 'high-risk' : ''}" id="proceed-payment-btn" onclick="handleProceedPayment()">
                        <span class="btn-icon">✅</span>
                        Proceed with Payment ${risk.level === 'high' ? '(Requires Confirmation)' : ''}
                    </button>
                    <button class="btn-secondary" id="check-rmp-btn" onclick="openRMPWebsite()">
                        <span class="btn-icon">🔍</span>
                        Check RMP Database
                    </button>
                    <button class="btn-secondary" id="security-tips-btn" onclick="showSecurityTips()">
                        <span class="btn-icon">💡</span>
                        Security Tips
                    </button>
                    <button class="btn-warning" id="report-merchant-btn" onclick="handleReportMerchant()">
                        <span class="btn-icon">⚠️</span>
                        Report as Suspicious
                    </button>
                </div>
            </div>
        </div>
    `;

    // Debug: Check if button was created
    const proceedBtn = document.getElementById('proceed-payment-btn');
    console.log('Proceed button found:', proceedBtn);
    if (!proceedBtn) {
        console.error('Proceed button not found!');
    }
}

function getStatusIcon(level) {
    const icons = {
        low: '✅',
        medium: '⚠️',
        high: '🚨'
    };
    return icons[level] || '❓';
}

function getStatusTitle(level) {
    const titles = {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk'
    };
    return titles[level] || 'Unknown Risk';
}

function getStatusDescription(level) {
    const descriptions = {
        low: 'This transaction appears to be safe based on our security checks.',
        medium: 'This transaction has some risk factors. Please review carefully.',
        high: 'This transaction has multiple risk factors. Proceed with extreme caution.'
    };
    return descriptions[level] || 'Risk level could not be determined.';
}

function getRMPStatusText(rmpStatus) {
    const statusTexts = {
        clean: 'No reports found',
        suspicious: 'Some suspicious activity reported',
        reported: 'Multiple reports received'
    };
    return statusTexts[rmpStatus.status] || 'Status unknown';
}

function openRMPWebsite() {
    // Open RMP website in new tab
    window.open('https://semakmule.rmp.gov.my/', '_blank');
    
    // Show confirmation message
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🔗</span>
            <span>RMP website opened in new tab</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showSecurityTips() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Security Tips</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="security-tips">
                    <div class="tip-item">
                        <div class="tip-icon">🔒</div>
                        <div class="tip-content">
                            <h4>Verify Recipient Details</h4>
                            <p>Always double-check the recipient's name, account number, and bank details before proceeding.</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">⏰</div>
                        <div class="tip-content">
                            <h4>Be Cautious of Unusual Hours</h4>
                            <p>Be extra careful with payments made during late night hours (11 PM - 6 AM).</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">💰</div>
                        <div class="tip-content">
                            <h4>High-Value Transactions</h4>
                            <p>For large amounts, consider breaking them into smaller payments or using secure payment methods.</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">🏢</div>
                        <div class="tip-content">
                            <h4>Business Verification</h4>
                            <p>For business payments, verify the business registration number and check their official website.</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">📞</div>
                        <div class="tip-content">
                            <h4>Contact Verification</h4>
                            <p>If unsure, contact the recipient directly through verified channels to confirm payment details.</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <div class="tip-icon">🚨</div>
                        <div class="tip-content">
                            <h4>Report Suspicious Activity</h4>
                            <p>If you encounter suspicious merchants or transactions, report them immediately to help protect others.</p>
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">Got it</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleProceedPayment() {
    console.log('=== handleProceedPayment called ===');
    console.log('Security status:', paymentState.securityStatus);
    console.log('Selected recipient:', paymentState.selectedRecipient);
    console.log('Payment amount:', paymentState.paymentAmount);
    
    // Check if this is a high-risk transaction
    if (paymentState.securityStatus && paymentState.securityStatus.risk.level === 'high') {
        console.log('High risk transaction detected');
        // Show confirmation dialog for high-risk transactions
        if (!confirm('This transaction has been flagged as HIGH RISK. Are you sure you want to proceed?')) {
            console.log('User cancelled high-risk transaction');
            return;
        }
        console.log('User confirmed high-risk transaction');
    }
    
    console.log('Proceeding with payment...');
    console.log('Recipient frequency:', paymentState.selectedRecipient.frequency);
    
    // If it's an existing recipient, go to bank screen
    if (paymentState.selectedRecipient.frequency > 0) {
        console.log('Going to bank screen for existing recipient');
        goToScreen('bank-screen');
        initializeBankInterface();
    } else {
        console.log('Going to QR screen for new recipient');
        // For new recipients, continue with QR flow
        goToScreen('qr-screen');
        initializeQRScanner();
    }
}

function handleReportMerchant() {
    showReportModal();
}

// ===== REPORT MERCHANT FUNCTIONALITY =====

function showReportModal() {
    const modal = document.getElementById('report-merchant-modal');
    if (!modal) {
        console.error('Report modal not found!');
        return;
    }
    modal.classList.add('active');
    
    // Initialize file upload functionality
    initializeFileUpload();
    
    // Add a "Back to Security Screen" button to the modal header
    const modalHeader = modal.querySelector('.modal-header');
    const backButton = document.createElement('button');
    backButton.className = 'back-to-security-btn';
    backButton.innerHTML = '← Back to Security Screen';
    backButton.onclick = () => {
        closeReportModal();
        // Return to security verification screen
        goToScreen('security-verification-screen');
    };
    
    // Insert the back button before the close button
    const closeBtn = modalHeader.querySelector('.close-btn');
    modalHeader.insertBefore(backButton, closeBtn);
}

function closeReportModal() {
    const modal = document.getElementById('report-merchant-modal');
    modal.classList.remove('active');
    document.getElementById('report-merchant-form').reset();
    
    // Clear file preview
    document.getElementById('file-preview').innerHTML = '';
    
    // Remove the back button if it exists
    const backButton = modal.querySelector('.back-to-security-btn');
    if (backButton) {
        backButton.remove();
    }
}

function initializeFileUpload() {
    const fileInput = document.getElementById('report-evidence');
    const filePreview = document.getElementById('file-preview');
    
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        filePreview.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            const previewItem = createFilePreviewItem(file, index);
            filePreview.appendChild(previewItem);
        });
    });
}

function createFilePreviewItem(file, index) {
    const item = document.createElement('div');
    item.className = 'file-preview-item';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = () => removeFile(index);
    
    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        item.appendChild(img);
    } else {
        const fileIcon = document.createElement('div');
        fileIcon.innerHTML = '📄';
        fileIcon.style.fontSize = '2rem';
        fileIcon.style.textAlign = 'center';
        item.appendChild(fileIcon);
    }
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
    
    item.appendChild(fileName);
    item.appendChild(removeBtn);
    
    return item;
}

function removeFile(index) {
    const fileInput = document.getElementById('report-evidence');
    const dt = new DataTransfer();
    const files = fileInput.files;
    
    for (let i = 0; i < files.length; i++) {
        if (i !== index) {
            dt.items.add(files[i]);
        }
    }
    
    fileInput.files = dt.files;
    
    // Re-render file preview
    const filePreview = document.getElementById('file-preview');
    filePreview.innerHTML = '';
    
    Array.from(fileInput.files).forEach((file, idx) => {
        const previewItem = createFilePreviewItem(file, idx);
        filePreview.appendChild(previewItem);
    });
}

function submitReportForm(event) {
    event.preventDefault();
    
    const reportData = {
        merchantId: paymentState.selectedRecipient.id,
        merchantName: paymentState.selectedRecipient.name,
        reason: document.getElementById('report-reason').value,
        description: document.getElementById('report-description').value,
        contact: document.getElementById('report-contact').value,
        evidence: document.getElementById('report-evidence').files,
        timestamp: new Date().toISOString(),
        userId: 'user_' + Date.now(), // In real app, this would be the actual user ID
        // Include security context
        securityContext: {
            riskLevel: paymentState.securityStatus?.risk?.level || 'unknown',
            riskFactors: paymentState.securityStatus?.risk?.factors || [],
            verificationResults: paymentState.securityStatus?.verification || {},
            paymentAmount: paymentState.paymentAmount,
            recipientType: paymentState.selectedRecipient.type
        }
    };
    
    // Simulate report submission
    submitReport(reportData);
}

function submitReport(reportData) {
    // Show loading state
    const submitBtn = document.querySelector('#report-merchant-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store report in localStorage for demo purposes
        const reports = JSON.parse(localStorage.getItem('merchantReports') || '[]');
        reports.push(reportData);
        localStorage.setItem('merchantReports', JSON.stringify(reports));
        
        // Show success message
        showReportSuccess();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showReportSuccess() {
    const modal = document.getElementById('report-merchant-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="report-success">
            <div class="report-success-icon">✅</div>
            <h2>Report Submitted Successfully</h2>
            <p>Thank you for reporting this suspicious merchant. Our security team will review your report and take appropriate action if necessary.</p>
            <p>Your report has been logged and will be investigated within 24-48 hours.</p>
            <div class="report-actions">
                <button class="btn-secondary" onclick="closeReportModal()">Close</button>
                <button class="btn-primary" onclick="proceedAfterReport()">Proceed with Payment</button>
            </div>
        </div>
    `;
}

function proceedAfterReport() {
    // Close the report modal
    closeReportModal();
    
    // Show a warning that the user is proceeding despite reporting
    const warningModal = document.createElement('div');
    warningModal.className = 'modal active';
    warningModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>⚠️ Proceed with Caution</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-content">
                    <div class="warning-icon">🚨</div>
                    <h3>You've reported this merchant as suspicious</h3>
                    <p>You're about to proceed with a payment to a merchant you've just reported. Please consider:</p>
                    <ul>
                        <li>Double-check all payment details</li>
                        <li>Verify the recipient through other channels</li>
                        <li>Consider if this payment is really necessary</li>
                        <li>You can cancel at any time</li>
                    </ul>
                    <p><strong>Are you sure you want to proceed?</strong></p>
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel Payment</button>
                    <button class="btn-warning" onclick="confirmProceedAfterReport()">Yes, Proceed Anyway</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(warningModal);
}

function confirmProceedAfterReport() {
    // Close the warning modal
    document.querySelector('.modal.active').remove();
    
    // Proceed with the payment flow
    handleProceedPayment();
}

// ===== SCREEN 3: QR SCANNER =====

function initializeQRScanner() {
    const video = document.getElementById('qr-video');
    const scanBtn = document.getElementById('scan-qr');
    const manualBtn = document.getElementById('manual-entry');
    
    // Simulate camera initialization
    video.poster = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3C/svg%3E';
    
    scanBtn.addEventListener('click', simulateQRScan);
    manualBtn.addEventListener('click', showManualEntry);
}

function simulateQRScan() {
    // Use the custom amount instead of random
    goToScreen('bank-screen');
    initializeBankInterface();
}

function showManualEntry() {
    // Implementation for manual entry form
    // This would be implemented based on specific requirements
    alert('Manual entry feature coming soon');
}

// ===== SCREEN 4: BANK INTERFACE =====

function initializeBankInterface() {
    updatePaymentDetails();
    initializePinPad();
    initializeBiometric();
}

function updatePaymentDetails() {
    document.getElementById('bank-recipient-name').textContent = paymentState.selectedRecipient.name;
    document.getElementById('bank-payment-amount').textContent = `RM ${paymentState.paymentAmount.toFixed(2)}`;
    document.getElementById('bank-source-account').textContent = `${paymentState.selectedAccount.bankName} (${paymentState.selectedAccount.accountNumber})`;
}

function initializePinPad() {
    const pinPad = document.querySelector('.pin-pad');
    pinPad.innerHTML = '';
    
    // Create number keys
    for (let i = 1; i <= 9; i++) {
        const key = createPinKey(i.toString());
        pinPad.appendChild(key);
    }
    
    // Create special keys
    pinPad.appendChild(createPinKey('⌫', 'backspace')); // Backspace
    pinPad.appendChild(createPinKey('0'));
    pinPad.appendChild(createPinKey('✓', 'confirm')); // Confirm
}

function createPinKey(value, action = 'number') {
    const key = document.createElement('button');
    key.className = 'pin-key';
    key.textContent = value;
    key.addEventListener('click', () => handlePinInput(value, action));
    return key;
}

function handlePinInput(value, action) {
    const dots = document.querySelectorAll('.pin-dot');
    
    switch (action) {
        case 'number':
            if (paymentState.pin.length < 6) {
                paymentState.pin += value;
                dots[paymentState.pin.length - 1].classList.add('filled');
                if (paymentState.pin.length === 6) {
                    setTimeout(validatePin, 500);
                }
            }
            break;
            
        case 'backspace':
            if (paymentState.pin.length > 0) {
                paymentState.pin = paymentState.pin.slice(0, -1);
                dots[paymentState.pin.length].classList.remove('filled');
            }
            break;
            
        case 'confirm':
            if (paymentState.pin.length === 6) {
                validatePin();
            }
            break;
    }
}

function initializeBiometric() {
    const biometricBtn = document.getElementById('use-biometric');
    biometricBtn.addEventListener('click', showBiometricPrompt);
}

function showBiometricPrompt() {
    // Hide PIN pad and show biometric screen
    document.querySelector('.pin-entry').style.display = 'none';
    document.querySelector('.security-section').innerHTML = `
        <div class="biometric-prompt">
            <h3>Touch Fingerprint Sensor</h3>
            <button class="fingerprint-button" id="fingerprint-sensor">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                    <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <div class="fingerprint-ripple"></div>
            </button>
            <p>Place your finger on the sensor</p>
        </div>
    `;

    // Add click handler for fingerprint sensor
    const sensor = document.getElementById('fingerprint-sensor');
    sensor.addEventListener('click', handleBiometricAuth);
}

function handleBiometricAuth() {
    const sensor = document.getElementById('fingerprint-sensor');
    sensor.classList.add('authenticating');
    
    // Simulate authentication process
    setTimeout(() => {
        sensor.classList.add('authenticated');
        
        // Process payment after short delay
        setTimeout(() => {
            processPayment();
        }, 500);
    }, 1000);
}

function validatePin() {
    // Simulate PIN validation (demo always succeeds)
    processPayment();
}

// ===== SCREEN 5: CONFIRMATION =====

function processPayment() {
    // Simulate payment processing
    setTimeout(() => {
        // Set category based on recipient's business type
        const category = getBusinessCategory(paymentState.selectedRecipient.type);
        
        const transaction = {
            id: `txn_${Date.now()}`,
            type: 'expense',
            amount: paymentState.paymentAmount,
            description: `Payment to ${paymentState.selectedRecipient.name}`,
            date: new Date().toISOString(),
            status: 'completed',
            accountId: paymentState.selectedAccount.id,
            category: category,
            reference: `TXN${new Date().toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random() * 1000)}`
        };
        
        mockData.transactions.unshift(transaction);
        goToScreen('confirmation-screen');
        initializeConfirmation(transaction);
    }, 1000);
}

// Helper function to determine category based on business type
function getBusinessCategory(type) {
    const categoryMap = {
        'retail': 'Shopping',
        'food': 'Food & Beverage',
        'transport': 'Transport',
        'services': 'Services',
        'utilities': 'Utilities',
        'education': 'Education',
        'healthcare': 'Healthcare',
        'individual': 'Transfer',
        'business': 'Business'
    };
    return categoryMap[type] || 'Other';
}

function initializeConfirmation(transaction) {
    // Update confirmation screen content
    const confirmationContent = document.querySelector('.confirmation-content');
    confirmationContent.innerHTML = `
        <div class="success-animation">
            <div class="success-icon">✓</div>
        </div>
        <h2>Payment Successful!</h2>
        <div class="transaction-details">
            <div class="detail-row">
                <span>Amount</span>
                <strong id="confirm-amount">RM ${transaction.amount.toFixed(2)}</strong>
            </div>
            <div class="detail-row">
                <span>To</span>
                <strong id="confirm-recipient">${paymentState.selectedRecipient.name}</strong>
            </div>
            <div class="detail-row">
                <span>Reference</span>
                <strong id="confirm-reference">${transaction.reference}</strong>
            </div>
            <div class="detail-row">
                <span>Date</span>
                <strong id="confirm-date">${new Date(transaction.date).toLocaleString()}</strong>
            </div>
            <div class="detail-row">
                <span>Category</span>
                <strong>${transaction.category}</strong>
            </div>
        </div>
        <div class="confirmation-actions">
            <button class="btn-primary" onclick="goToDashboard()">Done</button>
        </div>
    `;
}

function goToDashboard() {
    // Use history.back() to preserve elderly mode state
    if (document.referrer && document.referrer.includes('index.html')) {
        history.back();
    } else {
        // Fallback to direct navigation
        window.location.href = 'index.html';
    }
}

// Initialize payment flow when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeRecipients();
    
    // Make sure handleProceedPayment is globally accessible
    window.handleProceedPayment = handleProceedPayment;
    console.log('handleProceedPayment function made globally accessible');
    
    // Ensure elderly mode is properly restored
    if (window.accessibilityManager) {
        // Check if elderly mode should be active
        const prefs = JSON.parse(localStorage.getItem('accessibility-preferences') || '{}');
        if (prefs.elderlyMode && !window.accessibilityManager.isElderlyMode) {
            window.accessibilityManager.enableElderlyMode();
        }
    }
}); 