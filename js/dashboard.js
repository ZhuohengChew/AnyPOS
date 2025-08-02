// ===== DASHBOARD MANAGER =====

class DashboardManager {
  constructor() {
    this.currentPeriod = 'week';
    this.isLoaded = false;
    this.chartInstances = new Map();
    
    this.init();
  }

  // Initialize dashboard
  init() {
    console.log('Initializing Dashboard Manager...');
    this.setupEventListeners();
  }

  // Setup event listeners
  setupEventListeners() {
    // Period selector buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.changePeriod(e.target.dataset.period);
      });
    });

    // Voice feedback for quick action menu
    document.querySelectorAll('.action-card').forEach(card => {
      card.addEventListener('focus', (e) => {
        if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
          const label = card.querySelector('.action-label');
          if (label) {
            window.msmeApp.speakText(label.textContent.trim());
          }
        }
      });
    });

    // Voice feedback for notification and settings buttons
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('focus', (e) => {
        if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
          window.msmeApp.speakText('Notifications');
        }
      });
    }
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('focus', (e) => {
        if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
          window.msmeApp.speakText('Settings');
        }
      });
    }

    // Voice feedback for View All button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('focus', (e) => {
        if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
          window.msmeApp.speakText('View All');
        }
      });
    }

    // Voice feedback for account cards (after they are loaded)
    const addAccountCardVoiceFeedback = () => {
      document.querySelectorAll('.balance-card').forEach(card => {
        card.addEventListener('focus', (e) => {
          if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
            const bank = card.querySelector('h3');
            const type = card.querySelector('.account-type');
            if (bank && type) {
              window.msmeApp.speakText(`${bank.textContent.trim()}, ${type.textContent.trim()}`);
            } else if (bank) {
              window.msmeApp.speakText(bank.textContent.trim());
            }
          }
        });
      });
    };
    // Call after cards are loaded
    setTimeout(addAccountCardVoiceFeedback, 1000);

    // Refresh button simulation (pull-to-refresh)
    let startY = 0;
    let isRefreshing = false;

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].pageY;
    });

    document.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].pageY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 100 && window.scrollY === 0 && !isRefreshing) {
        this.simulateRefresh();
        isRefreshing = true;
      }
    });

    document.addEventListener('touchend', () => {
      isRefreshing = false;
    });
  }

  // Load dashboard data
  loadDashboard() {
    if (this.isLoaded) return;

    console.log('Loading dashboard data...');
    
    // Show loading state
    this.showLoadingState();
    
    // Simulate API loading delay
    setTimeout(() => {
      this.loadBalanceCards();
      this.loadTransactions();
      this.loadCashFlowChart();
      this.updateNotificationBadge();
      this.hideLoadingState();
      this.isLoaded = true;
      
      // Check and apply elderly mode layout if needed
      if (window.accessibilityManager) {
        window.accessibilityManager.checkAndApplyElderlyModeLayout();
        
        // Additional check after a short delay to ensure layout is applied
        setTimeout(() => {
          window.accessibilityManager.checkAndApplyElderlyModeLayout();
        }, 100);
      }
    }, 800);
  }

  // Show loading state
  showLoadingState() {
    const sections = document.querySelectorAll('.balance-section, .transactions-section, .cashflow-section');
    sections.forEach(section => {
      section.classList.add('loading');
    });
  }

  // Hide loading state
  hideLoadingState() {
    const sections = document.querySelectorAll('.balance-section, .transactions-section, .cashflow-section');
    sections.forEach(section => {
      section.classList.remove('loading');
    });
  }

  // Load balance cards
  loadBalanceCards() {
    const balanceCardsContainer = document.getElementById('balance-cards');
    if (!balanceCardsContainer) return;

    const accounts = DataHelper.getAccounts();
    
    balanceCardsContainer.innerHTML = accounts.map(account => `
      <div class="balance-card animate-fade-in" data-account-id="${account.id}">
        <h3>${account.bankName}</h3>
        <div class="balance-amount">${DataHelper.formatCurrency(account.balance)}</div>
        <div class="account-number">${account.accountNumber}</div>
        <div class="account-type">${this.formatAccountType(account.accountType)}</div>
      </div>
    `).join('');

    // Add click listeners for account details
    balanceCardsContainer.querySelectorAll('.balance-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const accountId = e.currentTarget.dataset.accountId;
        this.showAccountDetails(accountId);
      });
    });
  }

  // Format account type
  formatAccountType(type) {
    const types = {
      'current': 'Current Account',
      'savings': 'Savings Account',
      'business': 'Business Account'
    };
    return types[type] || type;
  }

  // Show account details
  showAccountDetails(accountId) {
    const account = DataHelper.getAccountById(accountId);
    if (!account) return;

    const transactions = DataHelper.getTransactionsByAccount(accountId);
    
    // For demo, show alert with account details
    const transactionCount = transactions.length;
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    alert(`Account Details:
${account.bankName}
${account.fullAccountNumber}
Balance: ${DataHelper.formatCurrency(account.balance)}
Transactions: ${transactionCount}
Income: ${DataHelper.formatCurrency(totalIncome)}
Expenses: ${DataHelper.formatCurrency(totalExpense)}`);
  }

  // Load transactions
  loadTransactions() {
    const transactionListContainer = document.getElementById('transaction-list');
    if (!transactionListContainer) return;

    const transactions = DataHelper.getTransactions(6); // Latest 6 transactions
    
    transactionListContainer.innerHTML = transactions.map(transaction => `
      <div class="transaction-item animate-fade-in" data-transaction-id="${transaction.id}">
        <div class="transaction-icon ${transaction.type}">
          ${this.getTransactionIcon(transaction.type)}
        </div>
        <div class="transaction-details">
          <h4>${transaction.description}</h4>
          <p>${DataHelper.formatDate(transaction.date)} • ${transaction.reference}</p>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}${DataHelper.formatCurrency(transaction.amount)}
        </div>
      </div>
    `).join('');

    // Add click listeners for transaction details
    transactionListContainer.querySelectorAll('.transaction-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const transactionId = e.currentTarget.dataset.transactionId;
        this.showTransactionDetails(transactionId);
      });
    });
  }

  // Get transaction icon
  getTransactionIcon(type) {
    const icons = {
      'income': '📈',
      'expense': '📉',
      'transfer': '🔄'
    };
    return icons[type] || '💳';
  }

  // Show transaction details
  showTransactionDetails(transactionId) {
    const transaction = DataHelper.getTransactions().find(t => t.id === transactionId);
    if (!transaction) return;

    const account = DataHelper.getAccountById(transaction.accountId);
    
    alert(`Transaction Details:
${transaction.description}
Amount: ${DataHelper.formatCurrency(transaction.amount)}
Date: ${DataHelper.formatDate(transaction.date)}
Account: ${account ? account.bankName : 'Unknown'}
Reference: ${transaction.reference}
Status: ${transaction.status}`);
  }

  // Load cash flow chart
  loadCashFlowChart() {
    const chartContainer = document.getElementById('cashflow-chart');
    const canvas = document.getElementById('cashflow-canvas');
    
    if (!chartContainer || !canvas) return;

    // Simple CSS-based chart for demo (since we're not using external chart libraries)
    this.renderSimpleCashFlowChart(chartContainer);
  }

  // Render simple cash flow chart using CSS
  renderSimpleCashFlowChart(container) {
    const analytics = DataHelper.getAnalytics();
    const weeklyData = analytics.cashFlow.weekly;
    
    // Clear existing chart
    container.innerHTML = '';
    
    // Create chart HTML
    const chartHTML = `
      <div class="chart-header">
        <h3>Weekly Cash Flow</h3>
        <div class="chart-legend">
          <span class="legend-item income"><span class="legend-color"></span>Income</span>
          <span class="legend-item expense"><span class="legend-color"></span>Expenses</span>
        </div>
      </div>
      <div class="chart-bars">
        ${weeklyData.map(day => {
          const maxValue = Math.max(...weeklyData.map(d => Math.max(d.income, d.expense)));
          const incomeHeight = (day.income / maxValue) * 100;
          const expenseHeight = (day.expense / maxValue) * 100;
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en', { weekday: 'short' });
          
          return `
            <div class="chart-day">
              <div class="chart-day-bars">
                <div class="chart-bar income" style="height: ${incomeHeight}%" title="Income: ${DataHelper.formatCurrency(day.income)}"></div>
                <div class="chart-bar expense" style="height: ${expenseHeight}%" title="Expenses: ${DataHelper.formatCurrency(day.expense)}"></div>
              </div>
              <div class="chart-day-label">${dayName}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="chart-summary">
        <div class="summary-item">
          <span class="summary-label">Total Income:</span>
          <span class="summary-value income">${DataHelper.formatCurrency(weeklyData.reduce((sum, d) => sum + d.income, 0))}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total Expenses:</span>
          <span class="summary-value expense">${DataHelper.formatCurrency(weeklyData.reduce((sum, d) => sum + d.expense, 0))}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Net Cash Flow:</span>
          <span class="summary-value ${weeklyData.reduce((sum, d) => sum + d.income - d.expense, 0) >= 0 ? 'income' : 'expense'}">
            ${DataHelper.formatCurrency(weeklyData.reduce((sum, d) => sum + d.income - d.expense, 0))}
          </span>
        </div>
      </div>
    `;
    
    container.innerHTML = chartHTML;
    
    // Add chart-specific styles
    this.addChartStyles();
  }

  // Add chart styles
  addChartStyles() {
    if (document.getElementById('chart-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'chart-styles';
    style.textContent = `
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-light);
      }
      
      .chart-legend {
        display: flex;
        gap: 1rem;
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: var(--font-size-sm);
      }
      
      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      
      .legend-item.income .legend-color {
        background-color: var(--secondary-green);
      }
      
      .legend-item.expense .legend-color {
        background-color: var(--error);
      }
      
      .chart-bars {
        display: flex;
        justify-content: space-between;
        align-items: end;
        height: 150px;
        margin-bottom: 1rem;
        padding: 0 0.5rem;
      }
      
      .chart-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 40px;
      }
      
      .chart-day-bars {
        display: flex;
        gap: 2px;
        height: 130px;
        align-items: end;
        margin-bottom: 0.5rem;
      }
      
      .chart-bar {
        width: 8px;
        border-radius: 2px 2px 0 0;
        min-height: 4px;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .chart-bar.income {
        background-color: var(--secondary-green);
      }
      
      .chart-bar.expense {
        background-color: var(--error);
      }
      
      .chart-bar:hover {
        opacity: 0.8;
        transform: scaleY(1.05);
      }
      
      .chart-day-label {
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        text-align: center;
      }
      
      .chart-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
      }
      
      .summary-item {
        text-align: center;
      }
      
      .summary-label {
        display: block;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
      }
      
      .summary-value {
        display: block;
        font-size: var(--font-size-lg);
        font-weight: 600;
      }
      
      .summary-value.income {
        color: var(--secondary-green);
      }
      
      .summary-value.expense {
        color: var(--error);
      }
      
      @media (max-width: 768px) {
        .chart-header {
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }
        
        .chart-legend {
          justify-content: center;
        }
        
        .chart-summary {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Update notification badge
  updateNotificationBadge() {
    const notificationBadge = document.querySelector('.notification-badge');
    if (!notificationBadge) return;

    const unreadNotifications = DataHelper.getUnreadNotifications();
    const count = unreadNotifications.length;
    
    notificationBadge.textContent = count;
    notificationBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Change period
  changePeriod(period) {
    this.currentPeriod = period;
    
    // Update active button
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-period="${period}"]`).classList.add('active');
    
    // Reload data for new period
    this.reloadData();
  }

  // Reload data
  reloadData() {
    this.showLoadingState();
    
    setTimeout(() => {
      this.loadTransactions();
      this.loadCashFlowChart();
      this.hideLoadingState();
    }, 500);
  }

  // Simulate refresh
  simulateRefresh() {
    console.log('Refreshing dashboard...');
    
    // Show refresh indicator
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'refresh-indicator';
    refreshIndicator.innerHTML = '↻ Refreshing...';
    refreshIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-blue);
      color: var(--text-inverse);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      z-index: var(--z-tooltip);
      animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(refreshIndicator);
    
    // Simulate refresh delay
    setTimeout(() => {
      this.reloadData();
      refreshIndicator.remove();
      
      // Announce refresh completion for accessibility
      if (window.msmeApp) {
        window.msmeApp.announce('Dashboard refreshed');
      }
    }, 1000);
  }

  // Calculate totals
  calculateTotals() {
    const accounts = DataHelper.getAccounts();
    const transactions = DataHelper.getTransactions();
    
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netCashFlow: totalIncome - totalExpenses
    };
  }

  // Get dashboard insights
  getDashboardInsights() {
    const totals = this.calculateTotals();
    const transactions = DataHelper.getTransactions();
    const pendingInvoices = DataHelper.getPendingInvoices();
    
    const insights = [];
    
    // Cash flow insight
    if (totals.netCashFlow > 0) {
      insights.push({
        type: 'positive',
        message: `Positive cash flow of ${DataHelper.formatCurrency(totals.netCashFlow)} this period`
      });
    } else {
      insights.push({
        type: 'warning',
        message: `Negative cash flow of ${DataHelper.formatCurrency(Math.abs(totals.netCashFlow))} this period`
      });
    }
    
    // Pending invoices insight
    if (pendingInvoices.length > 0) {
      const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
      insights.push({
        type: 'info',
        message: `${pendingInvoices.length} pending invoices worth ${DataHelper.formatCurrency(totalPending)}`
      });
    }
    
    // Transaction frequency insight
    const recentTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return transactionDate >= threeDaysAgo;
    });
    
    if (recentTransactions.length > 10) {
      insights.push({
        type: 'info',
        message: `High activity: ${recentTransactions.length} transactions in the last 3 days`
      });
    }
    
    return insights;
  }

  // Show insights
  showInsights() {
    const insights = this.getDashboardInsights();
    
    // Create insights container if it doesn't exist
    let insightsContainer = document.getElementById('dashboard-insights');
    if (!insightsContainer) {
      insightsContainer = document.createElement('div');
      insightsContainer.id = 'dashboard-insights';
      insightsContainer.className = 'insights-section';
      
      // Insert after quick actions
      const quickActions = document.querySelector('.quick-actions');
      if (quickActions) {
        quickActions.parentNode.insertBefore(insightsContainer, quickActions.nextSibling);
      }
    }
    
    insightsContainer.innerHTML = `
      <h2>Insights</h2>
      <div class="insights-list">
        ${insights.map(insight => `
          <div class="insight-item ${insight.type}">
            <span class="insight-icon">${this.getInsightIcon(insight.type)}</span>
            <span class="insight-message">${insight.message}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Get insight icon
  getInsightIcon(type) {
    const icons = {
      'positive': '✅',
      'warning': '⚠️',
      'info': 'ℹ️',
      'negative': '❌'
    };
    return icons[type] || 'ℹ️';
  }

  // Export dashboard data
  exportDashboardData() {
    const data = {
      accounts: DataHelper.getAccounts(),
      transactions: DataHelper.getTransactions(),
      totals: this.calculateTotals(),
      insights: this.getDashboardInsights(),
      exportDate: new Date().toISOString()
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Announce export completion
    if (window.msmeApp) {
      window.msmeApp.announce('Dashboard data exported successfully');
    }
  }
}

// Initialize dashboard manager
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardManager = new DashboardManager();
}); 