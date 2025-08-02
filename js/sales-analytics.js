// Sales Analytics JavaScript

// Mock data for analytics
const mockData = {
    // Transaction data for quantity analytics - expanded with more realistic data
    transactions: [
        { id: 'TXN-2025-001234', date: '2025-07-31', product: 'Laptop Accessories', quantity: 15, unitPrice: 45.00, total: 675.00 },
        { id: 'TXN-2025-001235', date: '2025-07-31', product: 'Mobile Phones', quantity: 8, unitPrice: 1200.00, total: 9600.00 },
        { id: 'TXN-2025-001236', date: '2025-07-30', product: 'Office Supplies', quantity: 25, unitPrice: 12.50, total: 312.50 },
        { id: 'TXN-2025-001237', date: '2025-07-30', product: 'Electronic Gadgets', quantity: 45, unitPrice: 89.00, total: 4005.00 },
        { id: 'TXN-2025-001238', date: '2025-07-29', product: 'Computer Parts', quantity: 12, unitPrice: 150.00, total: 1800.00 },
        { id: 'TXN-2025-001239', date: '2025-07-29', product: 'Printing Supplies', quantity: 30, unitPrice: 25.00, total: 750.00 },
        { id: 'TXN-2025-001240', date: '2025-07-28', product: 'Network Equipment', quantity: 5, unitPrice: 300.00, total: 1500.00 },
        { id: 'TXN-2025-001241', date: '2025-07-28', product: 'Software Licenses', quantity: 20, unitPrice: 75.00, total: 1500.00 },
        { id: 'TXN-2025-001242', date: '2025-07-27', product: 'Security Cameras', quantity: 10, unitPrice: 200.00, total: 2000.00 },
        { id: 'TXN-2025-001243', date: '2025-07-27', product: 'Data Storage', quantity: 18, unitPrice: 120.00, total: 2160.00 },
        { id: 'TXN-2025-001244', date: '2025-07-26', product: 'Wireless Devices', quantity: 22, unitPrice: 85.00, total: 1870.00 },
        { id: 'TXN-2025-001245', date: '2025-07-26', product: 'Audio Equipment', quantity: 15, unitPrice: 180.00, total: 2700.00 },
        { id: 'TXN-2025-001246', date: '2025-07-25', product: 'Gaming Accessories', quantity: 35, unitPrice: 65.00, total: 2275.00 },
        { id: 'TXN-2025-001247', date: '2025-07-25', product: 'Cables & Adapters', quantity: 50, unitPrice: 15.00, total: 750.00 },
        { id: 'TXN-2025-001248', date: '2025-07-24', product: 'Power Supplies', quantity: 12, unitPrice: 95.00, total: 1140.00 },
        { id: 'TXN-2025-001249', date: '2025-07-24', product: 'Monitors', quantity: 8, unitPrice: 350.00, total: 2800.00 },
        { id: 'TXN-2025-001250', date: '2025-07-23', product: 'Keyboards', quantity: 25, unitPrice: 45.00, total: 1125.00 },
        { id: 'TXN-2025-001251', date: '2025-07-23', product: 'Mouse Devices', quantity: 40, unitPrice: 25.00, total: 1000.00 },
        { id: 'TXN-2025-001252', date: '2025-07-22', product: 'USB Drives', quantity: 60, unitPrice: 35.00, total: 2100.00 },
        { id: 'TXN-2025-001253', date: '2025-07-22', product: 'Webcams', quantity: 15, unitPrice: 120.00, total: 1800.00 },
        { id: 'TXN-2025-001254', date: '2025-07-21', product: 'Microphones', quantity: 12, unitPrice: 85.00, total: 1020.00 },
        { id: 'TXN-2025-001255', date: '2025-07-21', product: 'Speakers', quantity: 18, unitPrice: 150.00, total: 2700.00 },
        { id: 'TXN-2025-001256', date: '2025-07-20', product: 'Tablets', quantity: 6, unitPrice: 800.00, total: 4800.00 },
        { id: 'TXN-2025-001257', date: '2025-07-20', product: 'Smart Watches', quantity: 10, unitPrice: 250.00, total: 2500.00 },
        { id: 'TXN-2025-001258', date: '2025-07-19', product: 'Bluetooth Headphones', quantity: 28, unitPrice: 95.00, total: 2660.00 },
        { id: 'TXN-2025-001259', date: '2025-07-19', product: 'Wireless Chargers', quantity: 35, unitPrice: 45.00, total: 1575.00 },
        { id: 'TXN-2025-001260', date: '2025-07-18', product: 'Phone Cases', quantity: 45, unitPrice: 25.00, total: 1125.00 },
        { id: 'TXN-2025-001261', date: '2025-07-18', product: 'Screen Protectors', quantity: 55, unitPrice: 15.00, total: 825.00 },
        { id: 'TXN-2025-001262', date: '2025-07-17', product: 'Laptop Stands', quantity: 20, unitPrice: 75.00, total: 1500.00 },
        { id: 'TXN-2025-001263', date: '2025-07-17', product: 'Desk Organizers', quantity: 30, unitPrice: 35.00, total: 1050.00 },
        { id: 'TXN-2025-001264', date: '2025-07-16', product: 'LED Strips', quantity: 25, unitPrice: 55.00, total: 1375.00 },
        { id: 'TXN-2025-001265', date: '2025-07-16', product: 'Gaming Mice', quantity: 15, unitPrice: 120.00, total: 1800.00 },
        { id: 'TXN-2025-001266', date: '2025-07-15', product: 'Mechanical Keyboards', quantity: 12, unitPrice: 200.00, total: 2400.00 },
        { id: 'TXN-2025-001267', date: '2025-07-15', product: 'Gaming Headsets', quantity: 18, unitPrice: 180.00, total: 3240.00 },
        { id: 'TXN-2025-001268', date: '2025-07-14', product: 'Graphics Cards', quantity: 5, unitPrice: 800.00, total: 4000.00 },
        { id: 'TXN-2025-001269', date: '2025-07-14', product: 'RAM Modules', quantity: 22, unitPrice: 120.00, total: 2640.00 },
        { id: 'TXN-2025-001270', date: '2025-07-13', product: 'SSD Drives', quantity: 15, unitPrice: 250.00, total: 3750.00 },
        { id: 'TXN-2025-001271', date: '2025-07-13', product: 'External HDDs', quantity: 12, unitPrice: 180.00, total: 2160.00 },
        { id: 'TXN-2025-001272', date: '2025-07-12', product: 'Network Switches', quantity: 8, unitPrice: 400.00, total: 3200.00 },
        { id: 'TXN-2025-001273', date: '2025-07-12', product: 'WiFi Routers', quantity: 10, unitPrice: 150.00, total: 1500.00 },
        { id: 'TXN-2025-001274', date: '2025-07-11', product: 'IP Cameras', quantity: 15, unitPrice: 220.00, total: 3300.00 },
        { id: 'TXN-2025-001275', date: '2025-07-11', product: 'DVR Systems', quantity: 6, unitPrice: 500.00, total: 3000.00 },
        { id: 'TXN-2025-001276', date: '2025-07-10', product: 'Biometric Scanners', quantity: 8, unitPrice: 350.00, total: 2800.00 },
        { id: 'TXN-2025-001277', date: '2025-07-10', product: 'Access Control Systems', quantity: 4, unitPrice: 800.00, total: 3200.00 },
        { id: 'TXN-2025-001278', date: '2025-07-09', product: 'Barcode Scanners', quantity: 12, unitPrice: 180.00, total: 2160.00 },
        { id: 'TXN-2025-001279', date: '2025-07-09', product: 'Receipt Printers', quantity: 8, unitPrice: 250.00, total: 2000.00 },
        { id: 'TXN-2025-001280', date: '2025-07-08', product: 'POS Terminals', quantity: 6, unitPrice: 600.00, total: 3600.00 },
        { id: 'TXN-2025-001281', date: '2025-07-08', product: 'Card Readers', quantity: 15, unitPrice: 120.00, total: 1800.00 },
        { id: 'TXN-2025-001282', date: '2025-07-07', product: 'Digital Signage', quantity: 4, unitPrice: 1200.00, total: 4800.00 },
        { id: 'TXN-2025-001283', date: '2025-07-07', product: 'Interactive Displays', quantity: 3, unitPrice: 1500.00, total: 4500.00 },
        { id: 'TXN-2025-001284', date: '2025-07-06', product: 'Projectors', quantity: 5, unitPrice: 800.00, total: 4000.00 },
        { id: 'TXN-2025-001285', date: '2025-07-06', product: 'Projection Screens', quantity: 8, unitPrice: 200.00, total: 1600.00 },
        { id: 'TXN-2025-001286', date: '2025-07-05', product: 'Conference Systems', quantity: 6, unitPrice: 400.00, total: 2400.00 },
        { id: 'TXN-2025-001287', date: '2025-07-05', product: 'Video Conferencing Kits', quantity: 4, unitPrice: 600.00, total: 2400.00 },
        { id: 'TXN-2025-001288', date: '2025-07-04', product: 'Whiteboard Systems', quantity: 3, unitPrice: 1000.00, total: 3000.00 },
        { id: 'TXN-2025-001289', date: '2025-07-04', product: 'Document Cameras', quantity: 10, unitPrice: 180.00, total: 1800.00 },
        { id: 'TXN-2025-001290', date: '2025-07-03', product: '3D Printers', quantity: 2, unitPrice: 2000.00, total: 4000.00 },
        { id: 'TXN-2025-001291', date: '2025-07-03', product: 'Laser Cutters', quantity: 1, unitPrice: 5000.00, total: 5000.00 },
        { id: 'TXN-2025-001292', date: '2025-07-02', product: 'CNC Machines', quantity: 1, unitPrice: 8000.00, total: 8000.00 },
        { id: 'TXN-2025-001293', date: '2025-07-02', product: 'Industrial Sensors', quantity: 20, unitPrice: 150.00, total: 3000.00 },
        { id: 'TXN-2025-001294', date: '2025-07-01', product: 'PLC Controllers', quantity: 8, unitPrice: 800.00, total: 6400.00 },
        { id: 'TXN-2025-001295', date: '2025-07-01', product: 'HMI Displays', quantity: 6, unitPrice: 600.00, total: 3600.00 }
    ],

    // Daily sales data for charts
    dailySales: [
        { date: '2025-07-01', sales: 1250.00, transactions: 15, quantity: 89 },
        { date: '2025-07-02', sales: 1890.00, transactions: 22, quantity: 134 },
        { date: '2025-07-03', sales: 2100.00, transactions: 28, quantity: 156 },
        { date: '2025-07-04', sales: 1750.00, transactions: 20, quantity: 98 },
        { date: '2025-07-05', sales: 2300.00, transactions: 25, quantity: 167 },
        { date: '2025-07-06', sales: 1950.00, transactions: 23, quantity: 145 },
        { date: '2025-07-07', sales: 2800.00, transactions: 32, quantity: 189 },
        { date: '2025-07-08', sales: 2200.00, transactions: 26, quantity: 167 },
        { date: '2025-07-09', sales: 2400.00, transactions: 29, quantity: 178 },
        { date: '2025-07-10', sales: 1900.00, transactions: 21, quantity: 123 },
        { date: '2025-07-11', sales: 2600.00, transactions: 30, quantity: 189 },
        { date: '2025-07-12', sales: 2100.00, transactions: 24, quantity: 156 },
        { date: '2025-07-13', sales: 2900.00, transactions: 35, quantity: 201 },
        { date: '2025-07-14', sales: 2250.00, transactions: 27, quantity: 167 },
        { date: '2025-07-15', sales: 2500.00, transactions: 31, quantity: 178 },
        { date: '2025-07-16', sales: 2000.00, transactions: 23, quantity: 145 },
        { date: '2025-07-17', sales: 2700.00, transactions: 33, quantity: 189 },
        { date: '2025-07-18', sales: 2150.00, transactions: 25, quantity: 156 },
        { date: '2025-07-19', sales: 2400.00, transactions: 29, quantity: 178 },
        { date: '2025-07-20', sales: 1900.00, transactions: 21, quantity: 123 },
        { date: '2025-07-21', sales: 2800.00, transactions: 34, quantity: 201 },
        { date: '2025-07-22', sales: 2200.00, transactions: 26, quantity: 167 },
        { date: '2025-07-23', sales: 2500.00, transactions: 30, quantity: 178 },
        { date: '2025-07-24', sales: 2000.00, transactions: 22, quantity: 145 },
        { date: '2025-07-25', sales: 2700.00, transactions: 32, quantity: 189 },
        { date: '2025-07-26', sales: 2150.00, transactions: 24, quantity: 156 },
        { date: '2025-07-27', sales: 2400.00, transactions: 28, quantity: 178 },
        { date: '2025-07-28', sales: 1900.00, transactions: 20, quantity: 123 },
        { date: '2025-07-29', sales: 2800.00, transactions: 33, quantity: 201 },
        { date: '2025-07-30', sales: 2250.00, transactions: 25, quantity: 167 },
        { date: '2025-07-31', sales: 2500.00, transactions: 30, quantity: 178 }
    ],

    // SST calculation data
    sstData: {
        dailyBaseAmount: 16392.50,
        sstRate: 0.06,
        monthlySST: 22500.00
    }
};

// Pagination variables
let currentPage = 1;
const itemsPerPage = 8;
let filteredTransactions = [];
let currentSSTPage = 1; // Add SST pagination variable

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
});

function initializeAnalytics() {
    // Initialize quantity analytics
    initializeQuantityAnalytics();
    
    // Initialize SST calculations
    initializeSSTCalculations();
    
    // Initialize daily sales report
    initializeDailySalesReport();
    
    // Initialize charts
    initializeCharts();
    
    // Add event listeners
    addEventListeners();
}

function initializeQuantityAnalytics() {
    // Calculate summary statistics
    const totalItems = mockData.transactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalTransactions = mockData.transactions.length;
    const avgItemsPerTransaction = (totalItems / totalTransactions).toFixed(1);
    
    // Find most sold product
    const productSales = {};
    mockData.transactions.forEach(t => {
        productSales[t.product] = (productSales[t.product] || 0) + t.quantity;
    });
    const mostSoldProduct = Object.entries(productSales).reduce((a, b) => a[1] > b[1] ? a : b);
    
    // Update summary cards
    updateSummaryCard('total-items', `${totalItems} items`);
    updateSummaryCard('most-sold', `${mostSoldProduct[0]} (${mostSoldProduct[1]} units)`);
    updateSummaryCard('avg-items', `${avgItemsPerTransaction} items`);
    
    // Populate transactions table
    populateTransactionsTable();
}

function initializeSSTCalculations() {
    // Calculate SST based on all transaction data (not just first 8)
    const totalBaseAmount = mockData.transactions.reduce((sum, t) => sum + t.total, 0);
    const sstRate = 0.06;
    const sstAmount = totalBaseAmount * sstRate;
    const finalAmount = totalBaseAmount + sstAmount;
    
    // Update SST summary cards with actual calculated values
    updateSummaryCard('daily-sales-before', `RM ${totalBaseAmount.toLocaleString()}`);
    updateSummaryCard('sst-amount', `RM ${sstAmount.toLocaleString()}`);
    updateSummaryCard('daily-sales-after', `RM ${finalAmount.toLocaleString()}`);
    
    // Populate SST breakdown
    populateSSTBreakdown();
}

function initializeDailySalesReport() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datePicker').value = today;
    
    // Update daily report
    updateDailyReport(today);
    
    // Populate daily breakdown table with pagination
    populateDailyBreakdownTable(1);
}

function initializeCharts() {
    // Daily sales chart - show full month (July 1-31)
    const dailySalesCtx = document.getElementById('dailySalesChart');
    if (dailySalesCtx) {
        new Chart(dailySalesCtx, {
            type: 'bar',
            data: {
                labels: mockData.dailySales.map(d => new Date(d.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'Daily Sales (RM)',
                    data: mockData.dailySales.map(d => d.sales),
                    backgroundColor: '#3B82F6',
                    borderRadius: 3,
                    borderSkipped: false,
                    maxBarThickness: 15,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            font: {
                                size: 8
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'RM ' + value.toLocaleString();
                            },
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // SST monthly chart - show full month (July 1-31)
    const sstChartCtx = document.getElementById('sstChart');
    if (sstChartCtx) {
        new Chart(sstChartCtx, {
            type: 'line',
            data: {
                labels: mockData.dailySales.map(d => new Date(d.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'SST Collected (RM)',
                    data: mockData.dailySales.map(d => d.sales * 0.06),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 8
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'RM ' + value.toLocaleString();
                            },
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
}

function updateSummaryCard(id, value) {
    const card = document.getElementById(id);
    if (card) {
        const valueElement = card.querySelector('.summary-card-value');
        if (valueElement) {
            valueElement.textContent = value;
        }
    }
}

function populateTransactionsTable(page = 1) {
    const tbody = document.querySelector('#transactionsTable tbody');
    const paginationContainer = document.getElementById('transactionsPagination');
    if (!tbody) return;
    
    // Filter transactions if search is active
    const searchInput = document.getElementById('searchTransactions');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    if (searchTerm) {
        filteredTransactions = mockData.transactions.filter(t => 
            t.id.toLowerCase().includes(searchTerm) ||
            t.product.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredTransactions = [...mockData.transactions];
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    // Clear table
    tbody.innerHTML = '';
    
    // Populate table with current page data
    pageTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="date">${formatDate(transaction.date)}</td>
            <td>${transaction.id}</td>
            <td>${transaction.product}</td>
            <td class="quantity">${transaction.quantity} units</td>
            <td>RM ${transaction.unitPrice.toFixed(2)}</td>
            <td class="amount">RM ${transaction.total.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update pagination controls
    updatePaginationControls(totalPages, page, paginationContainer);
    
    // Update current page
    currentPage = page;
}

function updatePaginationControls(totalPages, currentPage, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '← Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => populateTransactionsTable(currentPage - 1);
    container.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => populateTransactionsTable(i);
        container.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => populateTransactionsTable(currentPage + 1);
    container.appendChild(nextBtn);
}

function populateSSTBreakdown(page = 1) {
    const container = document.getElementById('sstBreakdown');
    const sstPaginationContainer = document.getElementById('sstPagination');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Use the same filtered transactions as the quantity table
    const searchInput = document.getElementById('searchTransactions');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let transactionsToUse;
    if (searchTerm) {
        transactionsToUse = mockData.transactions.filter(t => 
            t.id.toLowerCase().includes(searchTerm) ||
            t.product.toLowerCase().includes(searchTerm)
        );
    } else {
        transactionsToUse = [...mockData.transactions];
    }
    
    // Calculate pagination for SST
    const totalSSTPages = Math.ceil(transactionsToUse.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTransactions = transactionsToUse.slice(startIndex, endIndex);
    
    // Show transactions for current page
    pageTransactions.forEach(transaction => {
        const sstAmount = transaction.total * 0.06;
        const finalAmount = transaction.total + sstAmount;
        
        const row = document.createElement('div');
        row.className = 'sst-row';
        row.innerHTML = `
            <span class="sst-label">${transaction.id}</span>
            <span class="sst-value">RM ${transaction.total.toFixed(2)}</span>
            <span class="sst-label">6%</span>
            <span class="sst-value">RM ${sstAmount.toFixed(2)}</span>
            <span class="sst-value">RM ${finalAmount.toFixed(2)}</span>
        `;
        container.appendChild(row);
    });
    
    // Add total row using all filtered transactions (not just current page)
    const totalBase = transactionsToUse.reduce((sum, t) => sum + t.total, 0);
    const totalSST = totalBase * 0.06;
    const totalFinal = totalBase + totalSST;
    
    const totalRow = document.createElement('div');
    totalRow.className = 'sst-row total-row';
    totalRow.innerHTML = `
        <span class="sst-label">Total (All ${transactionsToUse.length} transactions)</span>
        <span class="sst-value">RM ${totalBase.toFixed(2)}</span>
        <span class="sst-label">6%</span>
        <span class="sst-value">RM ${totalSST.toFixed(2)}</span>
        <span class="sst-value">RM ${totalFinal.toFixed(2)}</span>
    `;
    container.appendChild(totalRow);
    
    // Update SST pagination controls
    updateSSTPaginationControls(totalSSTPages, page, sstPaginationContainer);
    
    // Update current SST page
    currentSSTPage = page;
}

function updateSSTPaginationControls(totalPages, currentPage, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '← Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => populateSSTBreakdown(currentPage - 1);
    container.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => populateSSTBreakdown(i);
        container.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => populateSSTBreakdown(currentPage + 1);
    container.appendChild(nextBtn);
}

function updateDailyReport(date) {
    const dailyData = mockData.dailySales.find(d => d.date === date);
    if (!dailyData) return;
    
    const sstAmount = dailyData.sales * 0.06;
    const netSales = dailyData.sales + sstAmount;
    
    // Update daily report values
    const elements = {
        'daily-sales': `RM ${dailyData.sales.toLocaleString()}`,
        'daily-items': `${dailyData.quantity} units`,
        'daily-transactions': dailyData.transactions,
        'daily-sst': `RM ${sstAmount.toLocaleString()}`,
        'daily-net': `RM ${netSales.toLocaleString()}`
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function populateDailyBreakdownTable(page = 1) {
    const tbody = document.querySelector('#dailyBreakdownTable tbody');
    const paginationContainer = document.getElementById('dailyBreakdownPagination');
    if (!tbody) return;
    
    // Clear table
    tbody.innerHTML = '';
    
    // Show all data from July 1st onwards (all 31 days)
    const dataToShow = mockData.dailySales;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(dataToShow.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = dataToShow.slice(startIndex, endIndex);
    
    // Populate table with daily data
    pageData.forEach(dayData => {
        const sstAmount = dayData.sales * 0.06;
        const netSales = dayData.sales + sstAmount;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="date">${formatDate(dayData.date)}</td>
            <td>${dayData.transactions}</td>
            <td class="quantity">${dayData.quantity} units</td>
            <td class="amount">RM ${dayData.sales.toLocaleString()}</td>
            <td class="amount">RM ${sstAmount.toLocaleString()}</td>
            <td class="amount">RM ${netSales.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update pagination controls
    if (paginationContainer) {
        updateDailyBreakdownPaginationControls(totalPages, page, paginationContainer);
    }
}

function updateDailyBreakdownPaginationControls(totalPages, currentPage, container) {
    container.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            populateDailyBreakdownTable(currentPage - 1);
        }
    });
    container.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            populateDailyBreakdownTable(i);
        });
        container.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            populateDailyBreakdownTable(currentPage + 1);
        }
    });
    container.appendChild(nextBtn);
}

function addEventListeners() {
    // Date picker
    const datePicker = document.getElementById('datePicker');
    if (datePicker) {
        datePicker.addEventListener('change', function() {
            updateDailyReport(this.value);
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchTransactions');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTransactions(this.value);
        });
    }
}

function updateChartsByFilter(filter) {
    // Update charts and data based on the selected filter
    // Since we removed the filter buttons, this function now just shows all data with pagination
    populateDailyBreakdownTable(1);
}

function filterTransactions(searchTerm) {
    // Reset to first page when searching
    populateTransactionsTable(1);
    
    // Also update SST breakdown to stay consistent (reset to page 1)
    populateSSTBreakdown(1);
    
    // Update SST summary cards based on filtered data
    const searchInput = document.getElementById('searchTransactions');
    const currentSearchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let transactionsToUse;
    if (currentSearchTerm) {
        transactionsToUse = mockData.transactions.filter(t => 
            t.id.toLowerCase().includes(currentSearchTerm) ||
            t.product.toLowerCase().includes(currentSearchTerm)
        );
    } else {
        transactionsToUse = [...mockData.transactions];
    }
    
    // Calculate SST based on all filtered transactions (not just first 8)
    const totalBaseAmount = transactionsToUse.reduce((sum, t) => sum + t.total, 0);
    const sstRate = 0.06;
    const sstAmount = totalBaseAmount * sstRate;
    const finalAmount = totalBaseAmount + sstAmount;
    
    // Update SST summary cards
    updateSummaryCard('daily-sales-before', `RM ${totalBaseAmount.toLocaleString()}`);
    updateSummaryCard('sst-amount', `RM ${sstAmount.toLocaleString()}`);
    updateSummaryCard('daily-sales-after', `RM ${finalAmount.toLocaleString()}`);
}



function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return `RM ${amount.toLocaleString()}`;
} 