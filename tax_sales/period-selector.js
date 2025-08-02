class PeriodSelector {
    constructor() {
        this.button = document.getElementById('periodSelectorBtn');
        this.dropdown = document.getElementById('periodDropdown');
        this.options = document.querySelectorAll('.period-option');
        this.currentPeriod = 'this_week';
        
        this.init();
    }

    init() {
        // Toggle dropdown
        this.button.addEventListener('click', () => this.toggleDropdown());

        // Handle option selection
        this.options.forEach(option => {
            option.addEventListener('click', (e) => this.handleSelection(e));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.button.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        const isExpanded = this.button.getAttribute('aria-expanded') === 'true';
        this.button.setAttribute('aria-expanded', !isExpanded);
        this.dropdown.classList.toggle('show');
    }

    closeDropdown() {
        this.button.setAttribute('aria-expanded', 'false');
        this.dropdown.classList.remove('show');
    }

    handleSelection(e) {
        const selectedOption = e.target;
        const period = selectedOption.dataset.value;
        const periodText = selectedOption.textContent;

        // Update button text
        this.button.childNodes[0].textContent = periodText;
        
        // Update current period
        this.currentPeriod = period;

        // Close dropdown
        this.closeDropdown();

        // Update chart data
        this.updateChartData(period);
    }

    async updateChartData(period) {
        try {
            // Get data for selected period
            const data = await this.fetchDataForPeriod(period);
            
            // Update chart
            if (window.chartManager) {
                window.chartManager.updateData({
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    income: data.income,
                    expense: data.expense
                });
            }
        } catch (error) {
            console.error('Error updating chart data:', error);
        }
    }

    async fetchDataForPeriod(period) {
        // Example data structure - replace with actual API call
        const mockData = {
            today: {
                income: [800, 1200, 1500, 1300, 1700, 1900, 2100],
                expense: [500, 800, 1000, 900, 1100, 1300, 1500]
            },
            this_week: {
                income: [1000, 1500, 1800, 1600, 2000, 2200, 2400],
                expense: [700, 1000, 1200, 1100, 1300, 1500, 1700]
            },
            this_month: {
                income: [1200, 1700, 2000, 1800, 2200, 2400, 2600],
                expense: [900, 1200, 1400, 1300, 1500, 1700, 1900]
            },
            last_month: {
                income: [1100, 1600, 1900, 1700, 2100, 2300, 2500],
                expense: [800, 1100, 1300, 1200, 1400, 1600, 1800]
            },
            this_year: {
                income: [1300, 1800, 2100, 1900, 2300, 2500, 2700],
                expense: [1000, 1300, 1500, 1400, 1600, 1800, 2000]
            }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockData[period] || mockData.this_week; // Default to this_week if period not found
    }
}

// Initialize period selector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.periodSelector = new PeriodSelector();
}); 