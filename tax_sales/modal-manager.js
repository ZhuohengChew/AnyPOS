class ModalManager {
    constructor() {
        this.modal = document.getElementById('transactionModal');
        this.openBtn = document.querySelector('.view-all-btn');
        this.closeBtn = document.querySelector('.modal-close');
        this.filterBtns = document.querySelectorAll('.modal-filters .filter-btn');
        this.transactions = document.querySelectorAll('.modal-transactions .transaction-item');
        this.categoryChart = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        // Initialize event listeners
        this.openBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.closeModal();
        });

        // Initialize filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });

        // Initialize pie chart
        this.initializePieChart();
    }

    openModal() {
        this.modal.style.display = 'flex';
        // Force reflow
        this.modal.offsetHeight;
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;

        // Update chart if needed
        if (this.categoryChart) {
            this.categoryChart.resize();
        }

        // Focus trap
        this.closeBtn.focus();
    }

    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.isOpen = false;
        
        // Remove display after transition
        const handleTransitionEnd = () => {
            if (!this.isOpen) {
                this.modal.style.display = 'none';
            }
            this.modal.removeEventListener('transitionend', handleTransitionEnd);
        };
        
        this.modal.addEventListener('transitionend', handleTransitionEnd);
    }

    handleFilter(clickedBtn) {
        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');

        // Get selected filter
        const filter = clickedBtn.classList.contains('all') ? 'all' : 
                      clickedBtn.classList.contains('income') ? 'income' : 'expense';

        // Filter transactions with animation
        this.transactions.forEach(transaction => {
            if (filter === 'all' || transaction.classList.contains(filter)) {
                transaction.style.display = 'flex';
                transaction.style.opacity = '0';
                transaction.style.transform = 'translateY(10px)';
                
                // Stagger the animations
                setTimeout(() => {
                    transaction.style.opacity = '1';
                    transaction.style.transform = 'translateY(0)';
                }, 50);
            } else {
                transaction.style.display = 'none';
            }
        });
    }

    initializePieChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Salary', 'Food & Drink', 'E-Wallet', 'Internet', 'Shopping'],
                datasets: [{
                    data: [40, 20, 15, 5, 20],
                    backgroundColor: [
                        '#4475F2',  // Salary
                        '#FF7CA3',  // Food & Drink
                        '#7C5CFC',  // E-Wallet
                        '#34C759',  // Internet
                        '#FFB258'   // Shopping
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#FFFFFF',
                        titleColor: '#1A1D1F',
                        titleFont: {
                            size: 14,
                            weight: '600',
                            family: 'Inter'
                        },
                        bodyColor: '#6F767E',
                        bodyFont: {
                            size: 12,
                            family: 'Inter'
                        },
                        padding: 12,
                        borderColor: '#E8E8E8',
                        borderWidth: 1,
                        displayColors: true,
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
}); 