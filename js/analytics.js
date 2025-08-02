// ===== ANALYTICS MANAGER =====

class AnalyticsManager {
  constructor() {
    this.currentPeriod = 'month';
    this.isLoaded = false;
    this.chartData = {};
    
    this.init();
  }

  // Initialize analytics manager
  init() {
    console.log('Initializing Analytics Manager...');
    this.setupEventListeners();
  }

  // Setup event listeners
  setupEventListeners() {
    // Period selector buttons
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.changePeriod(e.target.dataset.period);
      });
      // Voice feedback on focus
      btn.addEventListener('focus', (e) => {
        if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
          window.msmeApp.speakText(btn.textContent.trim());
        }
      });
    });

    // Export button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAnalytics());
      // Voice feedback on focus
      exportBtn.addEventListener('focus', (e) => {
        if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
          window.msmeApp.speakText('Export Analytics');
        }
      });
    }

    // Voice feedback for metric cards
    const addMetricCardVoiceFeedback = () => {
      document.querySelectorAll('.metric-card').forEach(card => {
        card.addEventListener('focus', (e) => {
          if (window.msmeApp?.currentUser?.accessibilitySettings?.voiceFeedback) {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3 && p) {
              window.msmeApp.speakText(`${h3.textContent.trim()}, ${p.textContent.trim()}`);
            }
          }
        });
      });
    };
    setTimeout(addMetricCardVoiceFeedback, 1000);
  }

  // Load analytics data
  loadAnalytics() {
    console.log('Loading analytics data...');
    
    // Show loading state
    this.showLoadingState();
    
    // Simulate API loading delay
    setTimeout(() => {
      this.loadMetrics();
      this.loadTopProducts();
      this.loadSalesChart();
      this.hideLoadingState();
      this.isLoaded = true;
    }, 800);
  }

  // Show loading state
  showLoadingState() {
    const sections = document.querySelectorAll('.metrics-section, .charts-section, .esg-section');
    sections.forEach(section => {
      section.classList.add('loading');
    });
  }

  // Hide loading state
  hideLoadingState() {
    const sections = document.querySelectorAll('.metrics-section, .charts-section, .esg-section');
    sections.forEach(section => {
      section.classList.remove('loading');
    });
  }

  // Load metrics cards
  loadMetrics() {
    const analytics = DataHelper.getAnalytics();
    const invoices = DataHelper.getInvoices();
    
    // Calculate metrics based on current period
    const metrics = this.calculateMetrics(analytics, invoices);
    
    // Update metric cards if they exist
    this.updateMetricCards(metrics);
  }

  // Calculate metrics for current period
  calculateMetrics(analytics, invoices) {
    const now = new Date();
    let startDate = new Date();
    
    // Set date range based on current period
    switch (this.currentPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Filter data for period
    const periodInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoiceDate >= startDate && invoiceDate <= now;
    });

    // Calculate metrics
    const totalRevenue = periodInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const invoicesSent = periodInvoices.length;
    const paidInvoices = periodInvoices.filter(inv => inv.status === 'paid');
    const avgPaymentTime = this.calculateAveragePaymentTime(paidInvoices);

    // Calculate growth
    const prevPeriodRevenue = this.getPreviousPeriodRevenue(analytics);
    const revenueGrowth = ((totalRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100;

    return {
      totalRevenue,
      revenueGrowth,
      invoicesSent,
      avgPaymentTime
    };
  }

  // Update metric cards
  updateMetricCards(metrics) {
    // These would update existing metric cards in the HTML
    // For now, we'll just log the data
    console.log('Updated metrics:', metrics);
    
    // Update metric displays if elements exist
    const revenueEl = document.querySelector('.metric-card:nth-child(1) h3');
    if (revenueEl) {
      revenueEl.textContent = DataHelper.formatCurrency(metrics.totalRevenue);
    }

    const invoicesEl = document.querySelector('.metric-card:nth-child(2) h3');
    if (invoicesEl) {
      invoicesEl.textContent = metrics.invoicesSent.toString();
    }

    const paymentTimeEl = document.querySelector('.metric-card:nth-child(3) h3');
    if (paymentTimeEl) {
      paymentTimeEl.textContent = `${metrics.avgPaymentTime} days`;
    }
  }

  // Calculate average payment time
  calculateAveragePaymentTime(paidInvoices) {
    if (paidInvoices.length === 0) return 0;

    const totalDays = paidInvoices.reduce((sum, invoice) => {
      const issueDate = new Date(invoice.issueDate);
      const paidDate = new Date(invoice.paidDate);
      const daysDiff = Math.ceil((paidDate - issueDate) / (1000 * 60 * 60 * 24));
      return sum + daysDiff;
    }, 0);

    return Math.round(totalDays / paidInvoices.length);
  }

  // Get previous period revenue for growth calculation
  getPreviousPeriodRevenue(analytics) {
    // Simplified calculation for demo
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = analytics.monthlyRevenue;
    
    const months = Object.keys(monthlyRevenue).sort();
    const currentIndex = months.findIndex(month => {
      const monthNum = parseInt(month.split('-')[1]) - 1;
      return monthNum === currentMonth;
    });

    if (currentIndex > 0) {
      return monthlyRevenue[months[currentIndex - 1]];
    }
    
    return 8000; // Default fallback
  }

  // Load top products
  loadTopProducts() {
    const analytics = DataHelper.getAnalytics();
    const topProducts = analytics.topProducts.slice(0, 5);
    
    const topProductsContainer = document.getElementById('top-products');
    if (!topProductsContainer) return;

    topProductsContainer.innerHTML = topProducts.map(product => `
      <div class="product-item">
        <div class="product-info">
          <h4>${product.name}</h4>
          <p>${product.units} units sold</p>
        </div>
        <div class="product-sales">${DataHelper.formatCurrency(product.sales)}</div>
      </div>
    `).join('');
  }

  // Load sales chart
  loadSalesChart() {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) return;

    // Create simple sales trend chart
    this.renderSalesChart(chartContainer);
  }

  // Render sales chart using CSS
  renderSalesChart(container) {
    const analytics = DataHelper.getAnalytics();
    const monthlyData = Object.entries(analytics.monthlyRevenue).slice(-6); // Last 6 months
    
    const chartHTML = `
      <div class="sales-chart">
        <div class="chart-title">
          <h3>Sales Trend</h3>
          <div class="chart-period">${this.currentPeriod.charAt(0).toUpperCase() + this.currentPeriod.slice(1)} View</div>
        </div>
        <div class="chart-container-inner">
          <div class="chart-bars">
            ${monthlyData.map(([month, revenue]) => {
              const maxRevenue = Math.max(...monthlyData.map(([, rev]) => rev));
              const height = (revenue / maxRevenue) * 100;
              const monthName = this.formatMonthName(month);
              
              return `
                <div class="chart-bar-container">
                  <div class="chart-bar" 
                       style="height: ${height}%" 
                       title="${monthName}: ${DataHelper.formatCurrency(revenue)}">
                  </div>
                  <div class="chart-label">${monthName}</div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="chart-summary">
            <div class="chart-stat">
              <span class="stat-label">Total Revenue:</span>
              <span class="stat-value">${DataHelper.formatCurrency(monthlyData.reduce((sum, [, rev]) => sum + rev, 0))}</span>
            </div>
            <div class="chart-stat">
              <span class="stat-label">Average:</span>
              <span class="stat-value">${DataHelper.formatCurrency(monthlyData.reduce((sum, [, rev]) => sum + rev, 0) / monthlyData.length)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = chartHTML;
    this.addChartStyles();
  }

  // Add chart styles
  addChartStyles() {
    if (document.getElementById('analytics-chart-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'analytics-chart-styles';
    style.textContent = `
      .sales-chart {
        background-color: var(--bg-primary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-6);
        border: 1px solid var(--border-light);
      }
      
      .chart-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-4);
        padding-bottom: var(--spacing-3);
        border-bottom: 1px solid var(--border-light);
      }
      
      .chart-period {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        background-color: var(--bg-secondary);
        padding: var(--spacing-1) var(--spacing-3);
        border-radius: var(--radius-full);
      }
      
      .chart-container-inner {
        position: relative;
      }
      
      .chart-bars {
        display: flex;
        justify-content: space-between;
        align-items: end;
        height: 200px;
        margin-bottom: var(--spacing-4);
        padding: 0 var(--spacing-2);
      }
      
      .chart-bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        max-width: 80px;
      }
      
      .chart-bar {
        width: 32px;
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%);
        border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        min-height: 8px;
        margin-bottom: var(--spacing-2);
        transition: all var(--transition-fast);
        cursor: pointer;
      }
      
      .chart-bar:hover {
        transform: scaleY(1.05);
        opacity: 0.8;
      }
      
      .chart-label {
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        text-align: center;
        font-weight: 500;
      }
      
      .chart-summary {
        display: flex;
        justify-content: space-around;
        padding-top: var(--spacing-4);
        border-top: 1px solid var(--border-light);
      }
      
      .chart-stat {
        text-align: center;
      }
      
      .stat-label {
        display: block;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-1);
      }
      
      .stat-value {
        display: block;
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--primary-blue);
      }
      
      @media (max-width: 768px) {
        .chart-title {
          flex-direction: column;
          gap: var(--spacing-2);
          align-items: stretch;
        }
        
        .chart-bars {
          height: 150px;
        }
        
        .chart-bar {
          width: 24px;
        }
        
        .chart-summary {
          flex-direction: column;
          gap: var(--spacing-3);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Format month name
  formatMonthName(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en', { month: 'short' });
  }

  // Change period
  changePeriod(period) {
    this.currentPeriod = period;
    
    // Update active button
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-period="${period}"]`)?.classList.add('active');
    
    // Reload data for new period
    this.reloadAnalytics();
    
    // Announce change for accessibility
    if (window.accessibilityManager) {
      window.accessibilityManager.announce(`Analytics period changed to ${period}`);
    }
  }

  // Reload analytics data
  reloadAnalytics() {
    this.showLoadingState();
    
    setTimeout(() => {
      this.loadMetrics();
      this.loadSalesChart();
      this.hideLoadingState();
    }, 500);
  }

  // Export analytics data
  exportAnalytics() {
    const analytics = DataHelper.getAnalytics();
    const invoices = DataHelper.getInvoices();
    const metrics = this.calculateMetrics(analytics, invoices);
    
    const exportData = {
      period: this.currentPeriod,
      metrics,
      analytics,
      invoices: invoices.map(inv => ({
        id: inv.id,
        number: inv.invoiceNumber,
        customer: inv.customerName,
        total: inv.total,
        date: inv.issueDate,
        status: inv.status
      })),
      exportDate: new Date().toISOString(),
      generatedBy: 'MSME Finance Platform'
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${this.currentPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    this.showNotification('Analytics data exported successfully!', 'success');
    
    // Announce export for accessibility
    if (window.accessibilityManager) {
      window.accessibilityManager.announce('Analytics data exported');
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${this.getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-primary);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-lg);
      padding: 1rem;
      box-shadow: var(--shadow-lg);
      z-index: var(--z-tooltip);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add type-specific styling
    if (type === 'success') {
      notification.style.borderColor = 'var(--secondary-green)';
      notification.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Get notification icon
  getNotificationIcon(type) {
    const icons = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  // Get analytics insights
  getAnalyticsInsights() {
    const analytics = DataHelper.getAnalytics();
    const invoices = DataHelper.getInvoices();
    const metrics = this.calculateMetrics(analytics, invoices);
    
    const insights = [];
    
    // Revenue growth insight
    if (metrics.revenueGrowth > 10) {
      insights.push({
        type: 'positive',
        title: 'Strong Growth',
        message: `Revenue increased by ${metrics.revenueGrowth.toFixed(1)}% this ${this.currentPeriod}`
      });
    } else if (metrics.revenueGrowth < -5) {
      insights.push({
        type: 'warning',
        title: 'Revenue Decline',
        message: `Revenue decreased by ${Math.abs(metrics.revenueGrowth).toFixed(1)}% this ${this.currentPeriod}`
      });
    }
    
    // Payment time insight
    if (metrics.avgPaymentTime > 30) {
      insights.push({
        type: 'warning',
        title: 'Slow Payments',
        message: `Average payment time is ${metrics.avgPaymentTime} days`
      });
    } else if (metrics.avgPaymentTime < 14) {
      insights.push({
        type: 'positive',
        title: 'Fast Payments',
        message: `Customers pay quickly - average ${metrics.avgPaymentTime} days`
      });
    }
    
    // Invoice volume insight
    if (metrics.invoicesSent > 50) {
      insights.push({
        type: 'info',
        title: 'High Activity',
        message: `${metrics.invoicesSent} invoices sent this ${this.currentPeriod}`
      });
    }
    
    return insights;
  }

  // Show insights
  showInsights() {
    const insights = this.getAnalyticsInsights();
    
    // Create insights section if it doesn't exist
    let insightsSection = document.querySelector('.insights-section');
    if (!insightsSection) {
      insightsSection = document.createElement('section');
      insightsSection.className = 'insights-section';
      
      // Insert after metrics section
      const metricsSection = document.querySelector('.metrics-section');
      if (metricsSection) {
        metricsSection.parentNode.insertBefore(insightsSection, metricsSection.nextSibling);
      }
    }
    
    insightsSection.innerHTML = `
      <h2>Business Insights</h2>
      <div class="insights-grid">
        ${insights.map(insight => `
          <div class="insight-card ${insight.type}">
            <div class="insight-header">
              <span class="insight-icon">${this.getInsightIcon(insight.type)}</span>
              <h3>${insight.title}</h3>
            </div>
            <p>${insight.message}</p>
          </div>
        `).join('')}
      </div>
    `;
    
    this.addInsightStyles();
  }

  // Get insight icon
  getInsightIcon(type) {
    const icons = {
      'positive': '📈',
      'warning': '⚠️',
      'info': 'ℹ️',
      'negative': '📉'
    };
    return icons[type] || 'ℹ️';
  }

  // Add insight styles
  addInsightStyles() {
    if (document.getElementById('insights-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'insights-styles';
    style.textContent = `
      .insights-section {
        margin-bottom: var(--spacing-8);
      }
      
      .insights-grid {
        display: grid;
        gap: var(--spacing-4);
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
      
      .insight-card {
        background-color: var(--bg-primary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-5);
        box-shadow: var(--shadow-sm);
      }
      
      .insight-card.positive {
        border-left: 4px solid var(--secondary-green);
      }
      
      .insight-card.warning {
        border-left: 4px solid var(--warning);
      }
      
      .insight-card.info {
        border-left: 4px solid var(--info);
      }
      
      .insight-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-3);
      }
      
      .insight-icon {
        font-size: var(--font-size-xl);
      }
      
      .insight-card h3 {
        margin: 0;
        font-size: var(--font-size-lg);
      }
      
      .insight-card p {
        margin: 0;
        color: var(--text-secondary);
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize analytics manager
document.addEventListener('DOMContentLoaded', () => {
  window.analyticsManager = new AnalyticsManager();
}); 