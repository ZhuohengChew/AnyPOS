class TransactionFilter {
    constructor() {
        this.incomeBtn = document.querySelector('.filter-btn.income');
        this.expenseBtn = document.querySelector('.filter-btn.expense');
        this.transactions = document.querySelectorAll('.transaction-item');
        
        this.init();
    }

    init() {
        // Set initial state - show income transactions
        this.filterTransactions('income');
        
        // Add click event listeners to filter buttons
        this.incomeBtn.addEventListener('click', () => {
            this.setActiveButton(this.incomeBtn);
            this.filterTransactions('income');
        });
        
        this.expenseBtn.addEventListener('click', () => {
            this.setActiveButton(this.expenseBtn);
            this.filterTransactions('expense');
        });
    }

    setActiveButton(activeButton) {
        // Remove active class from all buttons
        this.incomeBtn.classList.remove('active');
        this.expenseBtn.classList.remove('active');
        
        // Add active class to clicked button
        activeButton.classList.add('active');
    }

    filterTransactions(type) {
        this.transactions.forEach(transaction => {
            if (transaction.classList.contains(type)) {
                transaction.style.display = 'flex';
                // Add fade-in animation
                transaction.style.opacity = '0';
                setTimeout(() => {
                    transaction.style.opacity = '1';
                }, 50);
            } else {
                transaction.style.display = 'none';
            }
        });
    }
}

// Initialize transaction filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.transactionFilter = new TransactionFilter();
}); 