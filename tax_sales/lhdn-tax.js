// Tax Rate Constants
const TAX_TYPES = {
    individualIncome: {
        rates: [
            { min: 0, max: 5000, rate: 0 },
            { min: 5001, max: 20000, rate: 0.01 },
            { min: 20001, max: 35000, rate: 0.03 },
            { min: 35001, max: 50000, rate: 0.08 },
            { min: 50001, max: 70000, rate: 0.14 },
            { min: 70001, max: 100000, rate: 0.21 },
            { min: 100001, max: 400000, rate: 0.24 },
            { min: 400001, max: 600000, rate: 0.245 },
            { min: 600001, max: 2000000, rate: 0.25 },
            { min: 2000001, max: Infinity, rate: 0.30 }
        ]
    },
    businessIncome: {
        rates: [
            { min: 0, max: 600000, rate: 0.17 },
            { min: 600001, max: Infinity, rate: 0.24 }
        ]
    },
    sst: {
        rate: 0.06,
        threshold: 500000
    }
};

class LHDNTaxCalculator {
    constructor() {
        this.initializeEventListeners();
        this.initializeFormTabs();
    }

    // Initialize Event Listeners
    initializeEventListeners() {
        // Tax input listeners for real-time calculation
        document.querySelectorAll('.tax-input').forEach(input => {
            input.addEventListener('input', () => this.calculateTax());
        });

        // Form tab listeners
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target));
        });
    }

    // Initialize Form Tabs
    initializeFormTabs() {
        document.querySelectorAll('.form-content').forEach(content => {
            content.style.display = content.classList.contains('active') ? 'block' : 'none';
        });
    }

    // Switch Between Form Tabs
    switchTab(selectedTab) {
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        selectedTab.classList.add('active');

        const selectedForm = selectedTab.getAttribute('data-form');
        document.querySelectorAll('.form-content').forEach(content => {
            content.style.display = content.id === `${selectedForm}-form` ? 'block' : 'none';
        });
    }

    // Calculate Individual Income Tax
    calculateIncomeTax(income, deductions) {
        const taxableIncome = Math.max(0, income - deductions);
        let tax = 0;
        
        for (const bracket of TAX_TYPES.individualIncome.rates) {
            if (taxableIncome > bracket.min) {
                const taxableInBracket = Math.min(
                    taxableIncome - bracket.min,
                    bracket.max - bracket.min
                );
                tax += taxableInBracket * bracket.rate;
            }
        }
        
        return tax;
    }

    // Calculate Business Tax
    calculateBusinessTax(businessIncome) {
        if (businessIncome <= TAX_TYPES.businessIncome.rates[0].max) {
            return businessIncome * TAX_TYPES.businessIncome.rates[0].rate;
        }
        return (TAX_TYPES.businessIncome.rates[0].max * TAX_TYPES.businessIncome.rates[0].rate) +
               ((businessIncome - TAX_TYPES.businessIncome.rates[0].max) * TAX_TYPES.businessIncome.rates[1].rate);
    }

    // Calculate SST
    calculateSST(sales) {
        return sales >= TAX_TYPES.sst.threshold ? sales * TAX_TYPES.sst.rate : 0;
    }

    // Format Currency
    formatCurrency(amount) {
        return `RM ${amount.toFixed(2)}`;
    }

    // Calculate All Taxes
    calculateTax() {
        try {
            // Get income values
            const employmentIncome = parseFloat(document.getElementById('employment-income')?.value || 0);
            const businessIncome = parseFloat(document.getElementById('business-income')?.value || 0);
            const rentalIncome = parseFloat(document.getElementById('rental-income')?.value || 0);
            const totalSales = parseFloat(document.getElementById('total-sales')?.value || 0);

            // Get deductions
            const personalRelief = parseFloat(document.getElementById('personal-relief')?.value || 0);
            const epfContribution = parseFloat(document.getElementById('epf-contribution')?.value || 0);
            const totalDeductions = personalRelief + epfContribution;

            // Calculate total income
            const totalIncome = employmentIncome + businessIncome + rentalIncome;

            // Generate tax summary
            const taxSummary = this.generateTaxSummary(
                totalIncome,
                totalDeductions,
                businessIncome,
                totalSales
            );

            // Update UI with calculated taxes
            this.updateTaxDisplay(taxSummary);

        } catch (error) {
            console.error('Error calculating taxes:', error);
            this.showNotification('Error calculating taxes. Please check your inputs.', 'error');
        }
    }

    // Generate Tax Summary
    generateTaxSummary(income, deductions, businessIncome, sales) {
        const incomeTax = this.calculateIncomeTax(income, deductions);
        const businessTax = this.calculateBusinessTax(businessIncome);
        const sst = this.calculateSST(sales);

        return {
            incomeTax,
            businessTax,
            sst,
            totalTax: incomeTax + businessTax + sst
        };
    }

    // Update Tax Display
    updateTaxDisplay(taxSummary) {
        document.getElementById('income-tax-amount').textContent = this.formatCurrency(taxSummary.incomeTax);
        document.getElementById('business-tax-amount').textContent = this.formatCurrency(taxSummary.businessTax);
        document.getElementById('sst-amount').textContent = this.formatCurrency(taxSummary.sst);
    }

    // Auto-fill from Business Data
    autoFillTaxData() {
        const autoFillData = {
            personalInfo: {
                icNumber: "850123-05-1234",
                fullName: "Ahmad bin Abdullah",
                address: "No. 15, Jalan Usahawan 2, Subang Jaya",
                postcode: "47500",
                state: "Selangor",
                phoneNumber: "+60123456789",
                bankAccount: "5644-1234-5678",
                bankName: "Maybank"
            },
            businessInfo: {
                businessName: "Ahmad Food Truck Sdn Bhd",
                registrationNumber: "123456-A",
                businessAddress: "No. 15, Jalan Usahawan 2, Subang Jaya",
                businessType: "Food & Beverage",
                sstNumber: "A01-1234-56789012"
            },
            financialData: {
                totalSales: 450000,
                businessExpenses: 280000,
                employeeWages: 120000,
                rentExpenses: 36000,
                utilitiesExpenses: 12000,
                marketingExpenses: 8000,
                insuranceExpenses: 4000
            }
        };

        try {
            // Fill Personal Information
            document.getElementById('ic-number').value = autoFillData.personalInfo.icNumber;
            document.getElementById('full-name').value = autoFillData.personalInfo.fullName;
            document.getElementById('address').value = autoFillData.personalInfo.address;
            document.getElementById('postcode').value = autoFillData.personalInfo.postcode;
            document.getElementById('state').value = autoFillData.personalInfo.state;
            document.getElementById('phone-number').value = autoFillData.personalInfo.phoneNumber;
            document.getElementById('bank-account').value = autoFillData.personalInfo.bankAccount;
            document.getElementById('bank-name').value = autoFillData.personalInfo.bankName;

            // Fill Business Information
            document.getElementById('business-name').value = autoFillData.businessInfo.businessName;
            document.getElementById('registration-number').value = autoFillData.businessInfo.registrationNumber;
            document.getElementById('business-address').value = autoFillData.businessInfo.businessAddress;
            document.getElementById('business-type').value = autoFillData.businessInfo.businessType;
            document.getElementById('sst-number').value = autoFillData.businessInfo.sstNumber;

            // Fill Financial Data
            document.getElementById('total-sales').value = autoFillData.financialData.totalSales;
            document.getElementById('business-expenses').value = autoFillData.financialData.businessExpenses;
            document.getElementById('employee-wages').value = autoFillData.financialData.employeeWages;
            document.getElementById('rent-expenses').value = autoFillData.financialData.rentExpenses;
            document.getElementById('utilities-expenses').value = autoFillData.financialData.utilitiesExpenses;
            document.getElementById('marketing-expenses').value = autoFillData.financialData.marketingExpenses;
            document.getElementById('insurance-expenses').value = autoFillData.financialData.insuranceExpenses;

            // Auto-fill related tax form fields
            document.getElementById('business-income').value = autoFillData.financialData.totalSales;
            document.getElementById('operating-expenses').value = autoFillData.financialData.businessExpenses;
            document.getElementById('salary-expenses').value = autoFillData.financialData.employeeWages;

            // Trigger tax calculation
            this.calculateTax();

            // Show success message
            this.showNotification('Data auto-filled successfully', 'success');
        } catch (error) {
            console.error('Error auto-filling data:', error);
            this.showNotification('Error auto-filling data. Please try again.', 'error');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // Implementation for showing notifications to be added
    }

    // Export Tax Report
    exportTaxReport() {
        // Implementation for exporting tax report in LHDN format
        console.log('Exporting tax report...');
    }
}

// Initialize Tax Calculator
document.addEventListener('DOMContentLoaded', () => {
    window.taxCalculator = new LHDNTaxCalculator();
});

// Global Functions
function autoFillTaxData() {
    window.taxCalculator.autoFillTaxData();
}

function calculateTax() {
    window.taxCalculator.calculateTax();
}

function submitToMyInvoice() {
    // Check if form has been auto-filled (check if key fields are populated)
    const icNumber = document.getElementById('ic-number')?.value;
    const businessName = document.getElementById('business-name')?.value;
    const totalSales = document.getElementById('total-sales')?.value;
    const businessIncome = document.getElementById('business-income')?.value;
    
    // Validate if essential data is filled
    if (!icNumber || !businessName || !totalSales || !businessIncome) {
        // Show warning message
        alert('⚠️ Please Auto-Fill Data First!\n\nYou must click "Auto-Fill from Business Data" before submitting to MyInvoice.\n\nThis ensures all required tax information is properly populated.');
        
        // Highlight the auto-fill button
        const autoFillBtn = document.querySelector('[onclick="autoFillTaxData()"]');
        if (autoFillBtn) {
            autoFillBtn.style.animation = 'pulse 2s infinite';
            autoFillBtn.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.5)';
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
                autoFillBtn.style.animation = '';
                autoFillBtn.style.boxShadow = '';
            }, 5000);
        }
        
        return; // Prevent submission
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-success');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission process
    setTimeout(() => {
        // Redirect to success page
        window.location.href = 'myinvoice-success.html';
    }, 2000);
}

function showTaxHelp() {
    // Implementation for showing tax help modal
    console.log('Showing tax help...');
}

function checkTaxStatus() {
    window.location.href = 'tax-status.html';
} 