// ===== INVOICE PAYMENT FLOW CONTROLLER =====

// State Management
const paymentState = {
    currentScreen: 'invoice-details-screen',
    currentInvoiceData: null,
    selectedAccount: null,
    paymentAmount: 0,
    pin: '',
    securityStatus: null
};

// Initialize the payment flow
document.addEventListener('DOMContentLoaded', function() {
    loadInvoiceData();
    loadAccounts();
    setupEventListeners();
});

// Load invoice data from localStorage
function loadInvoiceData() {
    const invoiceDataString = localStorage.getItem('pay_invoice_data');
    if (!invoiceDataString) {
        alert('No invoice data found. Please go back and try again.');
        return;
    }

    try {
        paymentState.currentInvoiceData = JSON.parse(invoiceDataString);
        paymentState.paymentAmount = paymentState.currentInvoiceData.amount;
        displayInvoiceDetails();
    } catch (error) {
        console.error('Error loading invoice data:', error);
        alert('Error loading invoice data. Please go back and try again.');
    }
}

// Display invoice details
function displayInvoiceDetails() {
    if (!paymentState.currentInvoiceData) return;

    document.getElementById('invoice-id').textContent = paymentState.currentInvoiceData.invoiceId;
    document.getElementById('invoice-customer').textContent = paymentState.currentInvoiceData.customerName;
    document.getElementById('invoice-amount').textContent = `RM ${paymentState.currentInvoiceData.amount.toFixed(2)}`;
    document.getElementById('invoice-description').textContent = paymentState.currentInvoiceData.description;

    const amount = paymentState.currentInvoiceData.amount;
    const fee = 0.00;
    const total = amount + fee;

    document.getElementById('summary-amount').textContent = `RM ${amount.toFixed(2)}`;
    document.getElementById('summary-fee').textContent = `RM ${fee.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `RM ${total.toFixed(2)}`;
}

// Load user accounts
function loadAccounts() {
    const accounts = [
        {
            id: 'account-1',
            name: 'Maybank Business Account',
            number: '1234-5678-9012',
            balance: 15420.50,
            type: 'business',
            bankName: 'Maybank'
        },
        {
            id: 'account-2',
            name: 'CIMB Savings Account',
            number: '9876-5432-1098',
            balance: 8750.25,
            type: 'savings',
            bankName: 'CIMB Bank'
        },
        {
            id: 'account-3',
            name: 'Public Bank Current Account',
            number: '4567-8901-2345',
            balance: 22300.75,
            type: 'current',
            bankName: 'Public Bank'
        }
    ];

    const accountsList = document.querySelector('.accounts-list');
    if (accountsList) {
        accountsList.innerHTML = accounts.map(account => `
            <div class="account-card" onclick="selectAccount('${account.id}')">
                <div class="account-info">
                    <h3>${account.name}</h3>
                    <p class="account-number">${account.number}</p>
                    <p class="account-balance">Balance: RM ${account.balance.toFixed(2)}</p>
                </div>
                <div class="account-type">${account.type}</div>
            </div>
        `).join('');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add any additional event listeners here
}

// Navigate between screens
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    if (screenId === 'security-verification-screen') {
        initializeSecurityVerification();
    } else if (screenId === 'bank-screen') {
        initializeBankInterface();
    }
}

// Select account for payment
function selectAccount(accountId) {
    const accounts = [
        {
            id: 'account-1',
            name: 'Maybank Business Account',
            number: '1234-5678-9012',
            balance: 15420.50,
            type: 'business',
            bankName: 'Maybank'
        },
        {
            id: 'account-2',
            name: 'CIMB Savings Account',
            number: '9876-5432-1098',
            balance: 8750.25,
            type: 'savings',
            bankName: 'CIMB Bank'
        },
        {
            id: 'account-3',
            name: 'Public Bank Current Account',
            number: '4567-8901-2345',
            balance: 22300.75,
            type: 'current',
            bankName: 'Public Bank'
        }
    ];

    paymentState.selectedAccount = accounts.find(acc => acc.id === accountId);
    
    document.querySelectorAll('.account-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectAccount('${accountId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    goToScreen('security-verification-screen');
}

// Initialize security verification
async function initializeSecurityVerification() {
    if (!paymentState.currentInvoiceData || !paymentState.selectedAccount) {
        return;
    }

    // Simulate security verification
    const riskAssessment = {
        level: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
        factors: ['New or unverified recipient']
    };

    const verification = {
        rmpStatus: { status: Math.random() > 0.7 ? 'clear' : 'flagged' },
        bankVerification: { verified: Math.random() > 0.2 },
        businessRegistration: { verified: Math.random() > 0.3 }
    };

    paymentState.securityStatus = { risk: riskAssessment, verification: verification };
    renderSecurityVerification();
}

// Render security verification screen
function renderSecurityVerification() {
    const container = document.querySelector('#security-verification-screen .container');
    const { risk, verification } = paymentState.securityStatus;
    
    container.innerHTML = `
        <div class="security-verification">
            <div class="recipient-security-info">
                <div class="recipient-avatar">
                    <span class="recipient-icon">${paymentState.currentInvoiceData.customerName[0]}</span>
                </div>
                <h3>${paymentState.currentInvoiceData.customerName}</h3>
                <p>Invoice Payment • ${paymentState.currentInvoiceData.invoiceId}</p>
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
                <div class="action-buttons">
                    <button class="btn-primary" id="proceed-payment-btn" onclick="handleProceedPayment()">
                        <span class="btn-icon">✅</span>
                        Proceed with Payment
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
}

// Helper functions
function getStatusIcon(level) {
    const icons = { low: '✅', medium: '⚠️', high: '🚨' };
    return icons[level] || '❓';
}

function getStatusTitle(level) {
    const titles = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };
    return titles[level] || 'Unknown Risk';
}

function getStatusDescription(level) {
    const descriptions = {
        low: 'This transaction appears to be safe to proceed.',
        medium: 'This transaction has some risk factors. Please review carefully.',
        high: 'This transaction has been flagged as high risk. Please proceed with caution.'
    };
    return descriptions[level] || 'Risk level unknown.';
}

function getRMPStatusText(rmpStatus) {
    return rmpStatus.status === 'clear' ? 'No issues found' : 'Multiple reports received';
}

// Handle proceed payment
function handleProceedPayment() {
    goToScreen('bank-screen');
}

// Open RMP website
function openRMPWebsite() {
    window.open('https://semakmule.rmp.gov.my/', '_blank');
}

// Show security tips
function showSecurityTips() {
    document.getElementById('security-tips-modal').classList.add('active');
}

// Close security tips modal
function closeSecurityTipsModal() {
    document.getElementById('security-tips-modal').classList.remove('active');
}

// Handle report merchant
function handleReportMerchant() {
    document.getElementById('report-modal').classList.add('active');
}

// Close report modal
function closeReportModal() {
    document.getElementById('report-modal').classList.remove('active');
}

// Submit report form
function submitReportForm(event) {
    event.preventDefault();
    
    const reportData = {
        merchantId: paymentState.currentInvoiceData.customerName,
        reason: document.getElementById('report-reason').value,
        description: document.getElementById('report-description').value,
        contact: document.getElementById('report-contact').value,
        timestamp: new Date().toISOString()
    };

    const reports = JSON.parse(localStorage.getItem('merchantReports') || '[]');
    reports.push(reportData);
    localStorage.setItem('merchantReports', JSON.stringify(reports));

    closeReportModal();
    alert('Report submitted successfully. Thank you for helping keep our community safe.');
}



// Initialize bank interface
function initializeBankInterface() {
    updatePaymentDetails();
    initializePinPad();
    initializeBiometric();
}

// Update payment details
function updatePaymentDetails() {
    document.getElementById('bank-recipient-name').textContent = paymentState.currentInvoiceData.customerName;
    document.getElementById('bank-payment-amount').textContent = `RM ${paymentState.paymentAmount.toFixed(2)}`;
    document.getElementById('bank-source-account').textContent = `${paymentState.selectedAccount.bankName} (****${paymentState.selectedAccount.number.slice(-4)})`;
}

// Initialize PIN pad
function initializePinPad() {
    const pinPad = document.querySelector('.pin-pad');
    pinPad.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const key = createPinKey(i.toString());
        pinPad.appendChild(key);
    }
    
    pinPad.appendChild(createPinKey('⌫', 'backspace'));
    pinPad.appendChild(createPinKey('0'));
    pinPad.appendChild(createPinKey('✓', 'confirm'));
}

// Create PIN key
function createPinKey(value, action = 'number') {
    const key = document.createElement('button');
    key.className = 'pin-key';
    key.textContent = value;
    key.addEventListener('click', () => handlePinInput(value, action));
    return key;
}

// Handle PIN input
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

// Initialize biometric
function initializeBiometric() {
    const biometricBtn = document.getElementById('use-biometric');
    biometricBtn.addEventListener('click', showBiometricPrompt);
}

// Show biometric prompt
function showBiometricPrompt() {
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

    const sensor = document.getElementById('fingerprint-sensor');
    sensor.addEventListener('click', handleBiometricAuth);
}

// Handle biometric authentication
function handleBiometricAuth() {
    const sensor = document.getElementById('fingerprint-sensor');
    sensor.classList.add('authenticating');
    
    setTimeout(() => {
        sensor.classList.add('authenticated');
        setTimeout(() => {
            processPayment();
        }, 1000);
    }, 2000);
}

// Validate PIN
function validatePin() {
    if (paymentState.pin.length === 6) {
        processPayment();
    }
}

// Process payment
function processPayment() {
    updateInvoiceStatus();
    showPaymentConfirmation();
}

// Update invoice status
function updateInvoiceStatus() {
    if (!paymentState.currentInvoiceData) return;

    console.log('Updating invoice status for:', paymentState.currentInvoiceData.invoiceId);

    // Method 1: Update localStorage directly
    const invoicesString = localStorage.getItem('msme_invoices');
    if (invoicesString) {
        try {
            const invoices = JSON.parse(invoicesString);
            const invoiceIndex = invoices.findIndex(inv => inv.id === paymentState.currentInvoiceData.invoiceId);
            if (invoiceIndex !== -1) {
                invoices[invoiceIndex].status = 'paid';
                localStorage.setItem('msme_invoices', JSON.stringify(invoices));
                console.log(`✅ Invoice ${paymentState.currentInvoiceData.invoiceId} status updated to paid in localStorage`);
                
                // Also update the invoice controller if it exists
                if (window.invoiceController && window.invoiceController.invoices) {
                    const controllerIndex = window.invoiceController.invoices.findIndex(inv => inv.id === paymentState.currentInvoiceData.invoiceId);
                    if (controllerIndex !== -1) {
                        window.invoiceController.invoices[controllerIndex].status = 'paid';
                        window.invoiceController.saveToStorage();
                        console.log(`✅ Invoice ${paymentState.currentInvoiceData.invoiceId} status updated in invoice controller`);
                    }
                }
                return;
            }
        } catch (error) {
            console.error('Error updating invoice status in localStorage:', error);
        }
    }

    // Method 2: Try to update the main invoice controller if it exists
    if (window.invoiceController && window.invoiceController.invoices) {
        const invoiceIndex = window.invoiceController.invoices.findIndex(inv => inv.id === paymentState.currentInvoiceData.invoiceId);
        if (invoiceIndex !== -1) {
            window.invoiceController.invoices[invoiceIndex].status = 'paid';
            window.invoiceController.saveToStorage(); // Save the updated data
            console.log(`✅ Invoice ${paymentState.currentInvoiceData.invoiceId} status updated in invoice controller`);
            return;
        }
    }

    console.log('❌ Invoice not found in any storage location');
}

// Show payment confirmation
function showPaymentConfirmation() {
    const transactionId = 'TXN' + Date.now();
    const currentDate = new Date().toLocaleDateString('en-MY');
    
    document.getElementById('confirm-amount').textContent = `RM ${paymentState.paymentAmount.toFixed(2)}`;
    document.getElementById('confirm-invoice').textContent = paymentState.currentInvoiceData.invoiceId;
    document.getElementById('confirm-transaction-id').textContent = transactionId;
    document.getElementById('confirm-date').textContent = currentDate;
    
    goToScreen('confirmation-screen');
}

// Download receipt
function downloadReceipt() {
    const receiptData = {
        invoiceId: paymentState.currentInvoiceData.invoiceId,
        amount: paymentState.paymentAmount,
        customerName: paymentState.currentInvoiceData.customerName,
        transactionId: 'TXN' + Date.now(),
        date: new Date().toLocaleDateString('en-MY'),
        time: new Date().toLocaleTimeString('en-MY')
    };
    
    const receiptContent = `
        INVOICE PAYMENT RECEIPT
        =======================
        
        Invoice ID: ${receiptData.invoiceId}
        Customer: ${receiptData.customerName}
        Amount Paid: RM ${receiptData.amount.toFixed(2)}
        Transaction ID: ${receiptData.transactionId}
        Date: ${receiptData.date}
        Time: ${receiptData.time}
        
        Status: PAID
        =======================
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${receiptData.invoiceId}_${receiptData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Go back to invoices page
function goToInvoices() {
    // Set a flag to indicate that payment was completed
    localStorage.setItem('payment_completed', 'true');
    
    // Store the invoice ID that was paid
    if (paymentState.currentInvoiceData && paymentState.currentInvoiceData.invoiceId) {
        localStorage.setItem('paid_invoice_id', paymentState.currentInvoiceData.invoiceId);
    }
    
    localStorage.removeItem('pay_invoice_data');
    window.location.href = 'invoices.html';
} 