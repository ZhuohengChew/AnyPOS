class ChartManager {
    constructor() {
        this.chart = null;
        this.initializeChart();
    }

    initializeChart() {
        const ctx = document.getElementById('main-chart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Income',
                    data: [100, 800, 1200, 600, 800, 1300, 1800],
                    borderColor: '#4475F2',
                    backgroundColor: 'rgba(68, 117, 242, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#4475F2',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                }, {
                    label: 'Expense',
                    data: [400, 1000, 800, 300, 400, 200, 1000],
                    borderColor: '#FF7CA3',
                    backgroundColor: 'rgba(255, 124, 163, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#FF7CA3',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        bottom: 0,
                        left: 0
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
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
                        displayColors: false,
                        callbacks: {
                            title: (context) => {
                                return context[0].label;
                            },
                            label: (context) => {
                                return `${context.dataset.label}: RM${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            color: '#6F767E',
                            padding: 8
                        }
                    },
                    y: {
                        display: false,
                        min: 0,
                        max: 2000,
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }

    updateData(data) {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

        try {
            // Update the datasets while preserving other properties
            this.chart.data.labels = data.labels || this.chart.data.labels;
            this.chart.data.datasets[0].data = data.income || this.chart.data.datasets[0].data;
            this.chart.data.datasets[1].data = data.expense || this.chart.data.datasets[1].data;
            
            // Adjust y-axis scale based on new data
            const maxValue = Math.max(
                ...data.income || this.chart.data.datasets[0].data,
                ...data.expense || this.chart.data.datasets[1].data
            );
            this.chart.options.scales.y.max = Math.ceil(maxValue / 500) * 500;
            
            // Update with animation
            this.chart.update();
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }
}

// Initialize chart manager
document.addEventListener('DOMContentLoaded', () => {
    window.chartManager = new ChartManager();
});