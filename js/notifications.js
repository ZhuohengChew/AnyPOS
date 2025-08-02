// MSME Notification System
// Malaysian Business-Specific Notifications

const msmeNotifications = [
  {
    id: 1,
    type: 'warning',
    icon: '⚠️',
    title: 'Invoice Payment Overdue',
    message: 'ABC Supplier invoice #INV-2024-001 is 5 days overdue (RM 2,350.00)',
    timestamp: '2 hours ago',
    unread: true,
    category: 'payment'
  },
  {
    id: 2,
    type: 'success',
    icon: '✅',
    title: 'Payment Received',
    message: 'Customer payment of RM 1,200.00 received from TechSolutions Malaysia Sdn Bhd',
    timestamp: '4 hours ago',
    unread: true,
    category: 'payment'
  },
  {
    id: 3,
    type: 'info',
    icon: '📊',
    title: 'Monthly Report Ready',
    message: 'Your December 2024 financial report is ready for review',
    timestamp: '1 day ago',
    unread: false,
    category: 'report'
  },
  {
    id: 4,
    type: 'warning',
    icon: '🏛️',
    title: 'SST Filing Reminder',
    message: 'SST return filing due in 7 days. Total tax: RM 450.60',
    timestamp: '1 day ago',
    unread: true,
    category: 'tax'
  },
  {
    id: 5,
    type: 'info',
    icon: '🔄',
    title: 'Bank Sync Complete',
    message: 'Successfully synced 24 new transactions from Maybank',
    timestamp: '2 days ago',
    unread: false,
    category: 'system'
  },
  {
    id: 6,
    type: 'success',
    icon: '💝',
    title: 'Donation Milestone',
    message: 'You\'ve donated RM 100 to local charities this month through round-ups',
    timestamp: '3 days ago',
    unread: false,
    category: 'esg'
  },
  {
    id: 7,
    type: 'error',
    icon: '🔒',
    title: 'Security Alert',
    message: 'New login detected from Kuala Lumpur. Was this you?',
    timestamp: '1 week ago',
    unread: false,
    category: 'security'
  },
  {
    id: 8,
    type: 'info',
    icon: '📋',
    title: 'LHDN Tax Filing',
    message: 'Personal income tax filing deadline approaching. Complete by 30 April',
    timestamp: '1 week ago',
    unread: false,
    category: 'tax'
  },
  {
    id: 9,
    type: 'success',
    icon: '🏦',
    title: 'Bank Transfer Success',
    message: 'RM 500.00 transferred to CIMB Bank successfully',
    timestamp: '1 week ago',
    unread: false,
    category: 'payment'
  },
  {
    id: 10,
    type: 'warning',
    icon: '📈',
    title: 'Low Account Balance',
    message: 'Maybank account balance is below RM 1,000. Consider top-up',
    timestamp: '1 week ago',
    unread: false,
    category: 'system'
  }
];

class NotificationManager {
  constructor() {
    this.notifications = [...msmeNotifications];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateNotificationBadge();
  }

  setupEventListeners() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const markAllRead = document.querySelector('.mark-all-read');
    const viewAllBtn = document.querySelector('.view-all-notifications');

    console.log('Setting up notification event listeners...');
    console.log('Notification button:', notificationBtn);
    console.log('Notification panel:', notificationPanel);

    if (!notificationBtn || !notificationPanel) {
      console.warn('Notification elements not found');
      return;
    }

    // Toggle notification panel
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleNotificationPanel();
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
        this.closeNotificationPanel();
      }
    });

    // Mark all as read
    if (markAllRead) {
      markAllRead.addEventListener('click', () => {
        this.markAllAsRead();
      });
    }

    // View all notifications
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        this.viewAllNotifications();
      });
    }

    // Initial render
    this.renderNotifications();
  }

  toggleNotificationPanel() {
    const panel = document.getElementById('notification-panel');
    const btn = document.getElementById('notification-btn');
    
    console.log('Toggle notification panel called');
    console.log('Panel:', panel);
    console.log('Button:', btn);
    
    if (!panel || !btn) {
      console.warn('Panel or button not found');
      return;
    }
    
    if (panel.classList.contains('show')) {
      console.log('Closing panel');
      this.closeNotificationPanel();
    } else {
      console.log('Opening panel');
      panel.classList.add('show');
      btn.classList.add('active');
    }
  }

  closeNotificationPanel() {
    const panel = document.getElementById('notification-panel');
    const btn = document.getElementById('notification-btn');
    
    if (!panel || !btn) return;
    
    panel.classList.remove('show');
    btn.classList.remove('active');
  }

  renderNotifications() {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) return;

    const recentNotifications = this.notifications.slice(0, 6); // Show only recent 6

    notificationList.innerHTML = recentNotifications.map(notification => `
      <div class="notification-item ${notification.unread ? 'unread' : ''}" 
           data-id="${notification.id}"
           onclick="window.notificationManager.handleNotificationClick(${notification.id})">
        <div class="notification-icon ${notification.type}">
          ${notification.icon}
        </div>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-timestamp">${notification.timestamp}</div>
        </div>
      </div>
    `).join('');
  }

  handleNotificationClick(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Mark as read
    notification.unread = false;
    this.updateNotificationBadge();
    this.renderNotifications();

    // Show notification details instead of navigating
    console.log('Notification clicked:', notification.title);
    
    // Show a brief message to confirm the notification was read
    this.showNotificationMessage(notification);

    this.closeNotificationPanel();
  }

  showNotificationMessage(notification) {
    // Create a temporary message to show the notification was read
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-size: 14px;
      font-weight: 500;
      max-width: 300px;
      word-wrap: break-word;
    `;
    message.textContent = `✓ ${notification.title} - Marked as read`;
    
    document.body.appendChild(message);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 1500);
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.unread = false;
    });
    this.updateNotificationBadge();
    this.renderNotifications();
  }

  updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;
    
    const unreadCount = this.notifications.filter(n => n.unread).length;
    
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  viewAllNotifications() {
    // Navigate to full notifications page or expand panel
    console.log('View all notifications clicked');
    this.closeNotificationPanel();
    // You can implement a full notifications page here
    alert('Full notifications page - Coming Soon!');
  }

  // Method to add new notifications (for real-time updates)
  addNotification(notification) {
    notification.id = Date.now();
    notification.unread = true;
    notification.timestamp = 'Just now';
    
    this.notifications.unshift(notification);
    this.updateNotificationBadge();
    
    if (document.getElementById('notification-panel')?.classList.contains('show')) {
      this.renderNotifications();
    }
  }

  // Method to simulate new notifications (for testing)
  simulateNewNotification() {
    const newNotification = {
      type: 'info',
      icon: '📢',
      title: 'New System Update',
      message: 'Platform updated with new features. Check out the latest improvements!',
      category: 'system'
    };
    
    this.addNotification(newNotification);
  }

  // Method to get notification statistics
  getNotificationStats() {
    const total = this.notifications.length;
    const unread = this.notifications.filter(n => n.unread).length;
    const byCategory = {};
    
    this.notifications.forEach(notification => {
      byCategory[notification.category] = (byCategory[notification.category] || 0) + 1;
    });
    
    return {
      total,
      unread,
      byCategory
    };
  }
}

// Initialize notification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.notificationManager = new NotificationManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotificationManager, msmeNotifications };
} 