// Microloans Feature JavaScript

// Mock user data for auto-fill functionality
const userData = {
    name: "John Smith",
    accountNumber: "ACC-789456123",
    email: "john.smith@business.com",
    phone: "+60 12-345 6789",
    businessName: "Smith Trading Sdn Bhd",
    businessReg: "BR-2024-001234",
    businessType: "Retail Trading",
    monthlyRevenue: "8500",
    yearsInOperation: "3"
};

// Loan options data
const loanOptions = {
    quickCash: {
        name: "Quick Cash Loan",
        minAmount: 500,
        maxAmount: 2000,
        interestRate: 8.0,
        minPeriod: 3,
        maxPeriod: 12,
        description: "Fast approval for urgent business needs",
        eligibility: "Minimum 6 months business operation, consistent monthly revenue"
    },
    businessGrowth: {
        name: "Business Growth Loan",
        minAmount: 2000,
        maxAmount: 15000,
        interestRate: 6.5,
        minPeriod: 12,
        maxPeriod: 36,
        description: "Support for business expansion and growth initiatives",
        eligibility: "Minimum 1 year business operation, growing revenue trend"
    },
    inventoryFinancing: {
        name: "Inventory Financing",
        minAmount: 1000,
        maxAmount: 25000,
        interestRate: 5.5,
        minPeriod: 6,
        maxPeriod: 24,
        description: "Financing for inventory and stock purchases",
        eligibility: "Retail or trading business, good inventory management"
    },
    equipmentLoan: {
        name: "Equipment Purchase Loan",
        minAmount: 3000,
        maxAmount: 50000,
        interestRate: 7.0,
        minPeriod: 12,
        maxPeriod: 48,
        description: "Financing for business equipment and machinery",
        eligibility: "Equipment-based business, stable cash flow"
    },
    emergencyFund: {
        name: "Emergency Fund",
        minAmount: 200,
        maxAmount: 1500,
        interestRate: 9.0,
        minPeriod: 1,
        maxPeriod: 6,
        description: "Quick access to emergency business funds",
        eligibility: "Any registered business, immediate approval"
    }
};

// Auto-fill form function
function autoFillForm() {
    // Personal Information
    document.getElementById('fullName').value = userData.name;
    document.getElementById('accountNumber').value = userData.accountNumber;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('businessReg').value = userData.businessReg;

    // Business Information
    document.getElementById('businessName').value = userData.businessName;
    document.getElementById('businessType').value = userData.businessType;
    document.getElementById('monthlyRevenue').value = userData.monthlyRevenue;
    document.getElementById('yearsInOperation').value = userData.yearsInOperation;

    // Check for selected microloan from analytics page
    const selectedMicroloanData = localStorage.getItem('selectedMicroloan');
    if (selectedMicroloanData) {
        try {
            const microloan = JSON.parse(selectedMicroloanData);
            
            // Auto-fill loan type
            document.getElementById('loanType').value = microloan.type;
            
            // Auto-fill loan purpose based on loan type
            const loanPurposeSelect = document.getElementById('loanPurpose');
            if (loanPurposeSelect) {
                if (microloan.type.includes('Business Expansion')) {
                    loanPurposeSelect.value = 'Business Expansion';
                } else if (microloan.type.includes('Equipment')) {
                    loanPurposeSelect.value = 'Equipment Purchase';
                } else if (microloan.type.includes('Working Capital')) {
                    loanPurposeSelect.value = 'Working Capital';
                } else if (microloan.type.includes('Technology')) {
                    loanPurposeSelect.value = 'Marketing & Advertising';
                } else {
                    // Default fallback
                    loanPurposeSelect.value = 'Business Expansion';
                }
            }
            
            // Parse loan amount and set slider
            const amountValue = parseInt(microloan.amount.replace(/[^\d]/g, ''));
            if (amountValue) {
                document.getElementById('loanAmount').value = amountValue;
                document.getElementById('loanAmount').min = Math.max(2000, amountValue * 0.4); // 40% of selected amount as minimum
                document.getElementById('loanAmount').max = amountValue * 1.5; // 150% of selected amount as maximum
                
                // Update amount display
                updateAmountDisplay(amountValue);
                
                // Update range display labels
                updateRangeDisplay(Math.max(2000, amountValue * 0.4), amountValue * 1.5);
            }
            
            // Parse repayment period and populate options
            const periodMatch = microloan.term.match(/(\d+)/);
            if (periodMatch) {
                const selectedPeriod = parseInt(periodMatch[1]);
                const minPeriod = Math.max(6, selectedPeriod - 6); // 6 months before selected period
                const maxPeriod = selectedPeriod + 12; // 12 months after selected period
                
                updateRepaymentPeriods(minPeriod, maxPeriod);
                
                // Set the selected period as default
                setTimeout(() => {
                    const repaymentSelect = document.getElementById('repaymentPeriod');
                    if (repaymentSelect) {
                        repaymentSelect.value = selectedPeriod;
                        calculateLoan(); // Calculate loan details with the selected period
                    }
                }, 100);
            }
            
            // Clear the localStorage to avoid conflicts
            localStorage.removeItem('selectedMicroloan');
            
        } catch (error) {
            console.error('Error parsing microloan data:', error);
        }
    } else {
        // Fallback to original logic for sessionStorage
        const selectedLoan = sessionStorage.getItem('selectedLoan');
        if (selectedLoan && loanOptions[selectedLoan]) {
            const loan = loanOptions[selectedLoan];
            document.getElementById('loanType').value = loan.name;
            document.getElementById('loanAmount').value = loan.minAmount;
            document.getElementById('loanAmount').min = loan.minAmount;
            document.getElementById('loanAmount').max = loan.maxAmount;
            
            // Update amount display
            updateAmountDisplay(loan.minAmount);
            
            // Update range display labels
            updateRangeDisplay(loan.minAmount, loan.maxAmount);
            
            // Update repayment period options
            updateRepaymentPeriods(loan.minPeriod, loan.maxPeriod);
        }
    }
}

// Update amount display
function updateAmountDisplay(amount) {
    const display = document.getElementById('amountDisplay');
    if (display) {
        display.textContent = `RM ${parseInt(amount).toLocaleString()}`;
    }
}

// Update range display labels
function updateRangeDisplay(minAmount, maxAmount) {
    const minDisplay = document.getElementById('minAmount');
    const maxDisplay = document.getElementById('maxAmount');
    
    if (minDisplay) {
        minDisplay.textContent = `RM ${parseInt(minAmount).toLocaleString()}`;
    }
    if (maxDisplay) {
        maxDisplay.textContent = `RM ${parseInt(maxAmount).toLocaleString()}`;
    }
}

// Update repayment period options
function updateRepaymentPeriods(minPeriod, maxPeriod) {
    const select = document.getElementById('repaymentPeriod');
    if (select) {
        select.innerHTML = '';
        for (let i = minPeriod; i <= maxPeriod; i += 3) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} months`;
            select.appendChild(option);
        }
    }
}

// Calculate loan details
function calculateLoan() {
    const amount = parseInt(document.getElementById('loanAmount').value);
    const period = parseInt(document.getElementById('repaymentPeriod').value);
    
    if (!amount || !period) return;
    
    // Try to get interest rate from the loan type field
    const loanType = document.getElementById('loanType').value;
    let interestRate = 8.5; // Default interest rate
    
    // Extract interest rate from loan type if it matches our microloan types
    if (loanType.includes('Business Expansion')) {
        interestRate = 8.5;
    } else if (loanType.includes('Equipment')) {
        interestRate = 7.2;
    } else if (loanType.includes('Working Capital')) {
        interestRate = 9.0;
    } else if (loanType.includes('Technology')) {
        interestRate = 8.0;
    }
    
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = period;
    
    // Calculate monthly payment using loan amortization formula
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    const totalAmount = monthlyPayment * totalPayments;
    const totalInterest = totalAmount - amount;
    
    // Update display
    const monthlyPaymentEl = document.getElementById('monthlyPayment');
    const totalAmountEl = document.getElementById('totalAmount');
    const totalInterestEl = document.getElementById('totalInterest');
    
    if (monthlyPaymentEl) {
        monthlyPaymentEl.textContent = `RM ${monthlyPayment.toFixed(2)}`;
    }
    if (totalAmountEl) {
        totalAmountEl.textContent = `RM ${totalAmount.toFixed(2)}`;
    }
    if (totalInterestEl) {
        totalInterestEl.textContent = `RM ${totalInterest.toFixed(2)}`;
    }
}

// Form validation
function validateForm() {
    const requiredFields = [
        'fullName', 'email', 'phone', 'businessName', 
        'loanAmount', 'loanPurpose', 'repaymentPeriod'
    ];
    
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            isValid = false;
            errors.push(`${field.previousElementSibling.textContent} is required`);
            field.classList.add('error');
        } else if (field) {
            field.classList.remove('error');
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    if (email && email.value && !isValidEmail(email.value)) {
        isValid = false;
        errors.push('Please enter a valid email address');
        email.classList.add('error');
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && phone.value && !isValidPhone(phone.value)) {
        isValid = false;
        errors.push('Please enter a valid phone number');
        phone.classList.add('error');
    }
    
    // Terms and conditions
    const termsCheckbox = document.getElementById('termsConditions');
    if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false;
        errors.push('Please accept the terms and conditions');
    }
    
    return { isValid, errors };
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Submit form
function submitApplication() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showError(validation.errors.join('\n'));
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate application reference
        const refNumber = generateReferenceNumber();
        
        // Store application data
        const applicationData = {
            referenceNumber: refNumber,
            timestamp: new Date().toISOString(),
            loanDetails: getFormData(),
            status: 'submitted'
        };
        
        sessionStorage.setItem('applicationData', JSON.stringify(applicationData));
        
        // Redirect to success page
        window.location.href = 'microloan-success.html';
    }, 2000);
}

// Get form data
function getFormData() {
    const formData = {};
    const form = document.getElementById('applicationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });
    
    return formData;
}

// Generate reference number
function generateReferenceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ML-2024-${timestamp}${random}`;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize page
function initializePage() {
    // Auto-fill form when page loads
    if (document.getElementById('applicationForm')) {
        autoFillForm();
        
        // Add event listeners
        const amountSlider = document.getElementById('loanAmount');
        if (amountSlider) {
            amountSlider.addEventListener('input', function() {
                updateAmountDisplay(this.value);
                calculateLoan();
            });
        }
        
        const repaymentSelect = document.getElementById('repaymentPeriod');
        if (repaymentSelect) {
            repaymentSelect.addEventListener('change', calculateLoan);
        }
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitApplication);
        }
        
        // Calculate loan details after a short delay to ensure all fields are populated
        setTimeout(() => {
            calculateLoan();
        }, 200);
    }
    
    // Initialize loan options page
    if (document.getElementById('loanOptionsGrid')) {
        initializeLoanOptions();
    }
}

// Initialize loan options
function initializeLoanOptions() {
    const grid = document.getElementById('loanOptionsGrid');
    if (!grid) return;
    
    Object.keys(loanOptions).forEach(key => {
        const loan = loanOptions[key];
        const card = createLoanCard(loan, key);
        grid.appendChild(card);
    });
}

// Create loan card
function createLoanCard(loan, key) {
    const card = document.createElement('div');
    card.className = 'microloan-card';
    card.innerHTML = `
        <div class="loan-header">
            <div class="loan-main">
                <h4>${loan.name}</h4>
                <span class="loan-badge">Recommended</span>
            </div>
            <div class="loan-amount">
                RM ${loan.minAmount.toLocaleString()} - RM ${loan.maxAmount.toLocaleString()}
            </div>
        </div>
        <div class="loan-details">
            <div class="loan-detail-grid">
                <div class="loan-detail-item">
                    <span class="detail-label">APR:</span>
                    <span class="detail-value interest-rate">${loan.interestRate}%</span>
                </div>
                <div class="loan-detail-item">
                    <span class="detail-label">Period:</span>
                    <span class="detail-value">${loan.minPeriod}-${loan.maxPeriod} months</span>
                </div>
                <div class="loan-detail-item">
                    <span class="detail-label">Eligibility:</span>
                    <span class="detail-value">${loan.eligibility}</span>
                </div>
            </div>
        </div>
        <div class="loan-actions">
            <button onclick="selectLoan('${key}')">Apply Now</button>
            <button class="secondary" onclick="viewLoanDetails('${key}')">Learn More</button>
        </div>
    `;
    return card;
}

// Select loan option
function selectLoan(loanKey) {
    sessionStorage.setItem('selectedLoan', loanKey);
    window.location.href = 'microloan-application.html';
}

// View loan details
function viewLoanDetails(loanKey) {
    const loan = loanOptions[loanKey];
    alert(`${loan.name}\n\n${loan.description}\n\nEligibility: ${loan.eligibility}`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 