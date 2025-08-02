// ===== MOCK DATA FOR MSME PLATFORM PROTOTYPE =====

const mockData = {
  // User Information
  user: {
    id: 'user_001',
    type: 'business',
    name: 'Ahmad Food Truck Sdn Bhd',
    email: 'demo@msme.my',
    businessType: 'food',
    registrationNumber: '123456-A',
    sstNumber: 'A01-1234-56789012',
    language: 'en',
    accessibilitySettings: {
      elderlyMode: false,
      highContrast: false,
      voiceFeedback: false,
      fontSize: 'medium'
    },
    onboardingCompleted: true,
    lastLogin: '2024-07-18T08:00:00Z'
  },

  // Bank Accounts
  accounts: [
    {
      id: 'acc_001',
      bankName: 'Maybank',
      bankCode: 'MBB',
      accountNumber: '****1234',
      fullAccountNumber: '5644-1234-5678',
      balance: 15420.50,
      currency: 'MYR',
      accountType: 'current',
      isDefault: true,
      status: 'active'
    },
    {
      id: 'acc_002',
      bankName: 'CIMB Bank',
      bankCode: 'CIMB',
      accountNumber: '****5678',
      fullAccountNumber: '8001-5678-9012',
      balance: 8930.20,
      currency: 'MYR',
      accountType: 'savings',
      isDefault: false,
      status: 'active'
    },
    {
      id: 'acc_003',
      bankName: 'Public Bank',
      bankCode: 'PBB',
      accountNumber: '****9012',
      fullAccountNumber: '3159-9012-3456',
      balance: 2456.75,
      currency: 'MYR',
      accountType: 'current',
      isDefault: false,
      status: 'active'
    }
  ],

  // Recent Transactions
  transactions: [
    {
      id: 'txn_001',
      type: 'income',
      amount: 450.00,
      description: 'Invoice Payment - Restoran Maju',
      date: '2024-07-18T10:30:00Z',
      status: 'completed',
      accountId: 'acc_001',
      category: 'sales',
      invoiceId: 'inv_001',
      reference: 'TXN20240718001'
    },
    {
      id: 'txn_002',
      type: 'income',
      amount: 720.50,
      description: 'Invoice Payment - Kedai Kopi Lim',
      date: '2024-07-17T14:15:00Z',
      status: 'completed',
      accountId: 'acc_001',
      category: 'sales',
      invoiceId: 'inv_002',
      reference: 'TXN20240717001'
    },
    {
      id: 'txn_003',
      type: 'expense',
      amount: 180.00,
      description: 'Flour & Ingredients Purchase',
      date: '2024-07-17T09:45:00Z',
      status: 'completed',
      accountId: 'acc_001',
      category: 'supplies',
      reference: 'TXN20240717002'
    },
    {
      id: 'txn_004',
      type: 'income',
      amount: 320.00,
      description: 'Cash Sale - Wedding Cake',
      date: '2024-07-16T16:20:00Z',
      status: 'completed',
      accountId: 'acc_002',
      category: 'sales',
      reference: 'TXN20240716001'
    },
    {
      id: 'txn_005',
      type: 'expense',
      amount: 95.60,
      description: 'Electricity Bill',
      date: '2024-07-16T11:00:00Z',
      status: 'completed',
      accountId: 'acc_001',
      category: 'utilities',
      reference: 'TXN20240716002'
    },
    {
      id: 'txn_006',
      type: 'income',
      amount: 680.00,
      description: 'Invoice Payment - Sekolah Kebangsaan',
      date: '2024-07-15T13:30:00Z',
      status: 'completed',
      accountId: 'acc_001',
      category: 'sales',
      invoiceId: 'inv_003',
      reference: 'TXN20240715001'
    }
  ],

  // Invoices
  invoices: [
    {
      id: 'inv_001',
      invoiceNumber: 'INV-2024-001',
      customerId: 'cust_001',
      customerName: 'Restoran Maju',
      customerEmail: 'manager@restoranmaju.com',
      customerAddress: 'No. 15, Jalan Makan, Taman Sedap, 50000 Kuala Lumpur',
      issueDate: '2024-07-15',
      dueDate: '2024-07-30',
      status: 'paid',
      subtotal: 424.53,
      sst: 25.47,
      total: 450.00,
      currency: 'MYR',
      lineItems: [
        {
          id: 'item_001',
          description: 'Roti Canai (100 pieces)',
          quantity: 100,
          unitPrice: 2.50,
          total: 250.00
        },
        {
          id: 'item_002',
          description: 'Curry Sauce (10 containers)',
          quantity: 10,
          unitPrice: 8.50,
          total: 85.00
        },
        {
          id: 'item_003',
          description: 'Dhal Sauce (8 containers)',
          quantity: 8,
          unitPrice: 7.50,
          total: 60.00
        },
        {
          id: 'item_004',
          description: 'Special Cake (1 unit)',
          quantity: 1,
          unitPrice: 29.53,
          total: 29.53
        }
      ],
      paidDate: '2024-07-18T10:30:00Z'
    },
    {
      id: 'inv_002',
      invoiceNumber: 'INV-2024-002',
      customerId: 'cust_002',
      customerName: 'Kedai Kopi Lim',
      customerEmail: 'lim@kedaikopi.com',
      customerAddress: 'No. 88, Jalan Kopi, Taman Warisan, 53000 Kuala Lumpur',
      issueDate: '2024-07-14',
      dueDate: '2024-07-28',
      status: 'paid',
      subtotal: 679.72,
      sst: 40.78,
      total: 720.50,
      currency: 'MYR',
      lineItems: [
        {
          id: 'item_005',
          description: 'Kaya Toast Bread (50 loaves)',
          quantity: 50,
          unitPrice: 4.50,
          total: 225.00
        },
        {
          id: 'item_006',
          description: 'Homemade Kaya (20 jars)',
          quantity: 20,
          unitPrice: 12.50,
          total: 250.00
        },
        {
          id: 'item_007',
          description: 'Butter Cookies (15 boxes)',
          quantity: 15,
          unitPrice: 13.65,
          total: 204.72
        }
      ],
      paidDate: '2024-07-17T14:15:00Z'
    },
    {
      id: 'inv_003',
      invoiceNumber: 'INV-2024-003',
      customerId: 'cust_003',
      customerName: 'Sekolah Kebangsaan Taman Bahagia',
      customerEmail: 'admin@sktb.edu.my',
      customerAddress: 'Jalan Pendidikan 1, Taman Bahagia, 47000 Sungai Buloh, Selangor',
      issueDate: '2024-07-12',
      dueDate: '2024-07-26',
      status: 'paid',
      subtotal: 641.51,
      sst: 38.49,
      total: 680.00,
      currency: 'MYR',
      lineItems: [
        {
          id: 'item_008',
          description: 'Student Lunch Bread (200 pieces)',
          quantity: 200,
          unitPrice: 2.00,
          total: 400.00
        },
        {
          id: 'item_009',
          description: 'Sandwich Filling Sets (50 sets)',
          quantity: 50,
          unitPrice: 4.83,
          total: 241.51
        }
      ],
      paidDate: '2024-07-15T13:30:00Z'
    },
    {
      id: 'inv_004',
      invoiceNumber: 'INV-2024-004',
      customerId: 'cust_004',
      customerName: 'Kedai Runcit Pak Cik',
      customerEmail: 'pakcik@kedairuncit.com',
      customerAddress: 'No. 22, Jalan Kampung, Taman Mesra, 43000 Kajang, Selangor',
      issueDate: '2024-07-18',
      dueDate: '2024-08-02',
      status: 'pending',
      subtotal: 566.04,
      sst: 33.96,
      total: 600.00,
      currency: 'MYR',
      lineItems: [
        {
          id: 'item_010',
          description: 'Mixed Pastries (40 boxes)',
          quantity: 40,
          unitPrice: 8.50,
          total: 340.00
        },
        {
          id: 'item_011',
          description: 'Traditional Cookies (25 containers)',
          quantity: 25,
          unitPrice: 9.04,
          total: 226.04
        }
      ]
    }
  ],

  // Customers
  customers: [
    {
      id: 'cust_001',
      name: 'Restoran Maju',
      email: 'manager@restoranmaju.com',
      phone: '+60-3-2234-5678',
      address: 'No. 15, Jalan Makan, Taman Sedap, 50000 Kuala Lumpur',
      businessType: 'restaurant',
      totalOrders: 8,
      totalAmount: 3200.00,
      lastOrder: '2024-07-15',
      status: 'active'
    },
    {
      id: 'cust_002',
      name: 'Kedai Kopi Lim',
      email: 'lim@kedaikopi.com',
      phone: '+60-3-7890-1234',
      address: 'No. 88, Jalan Kopi, Taman Warisan, 53000 Kuala Lumpur',
      businessType: 'coffee_shop',
      totalOrders: 12,
      totalAmount: 5400.00,
      lastOrder: '2024-07-14',
      status: 'active'
    },
    {
      id: 'cust_003',
      name: 'Sekolah Kebangsaan Taman Bahagia',
      email: 'admin@sktb.edu.my',
      phone: '+60-3-6156-7890',
      address: 'Jalan Pendidikan 1, Taman Bahagia, 47000 Sungai Buloh, Selangor',
      businessType: 'school',
      totalOrders: 6,
      totalAmount: 2800.00,
      lastOrder: '2024-07-12',
      status: 'active'
    },
    {
      id: 'cust_004',
      name: 'Kedai Runcit Pak Cik',
      email: 'pakcik@kedairuncit.com',
      phone: '+60-3-8765-4321',
      address: 'No. 22, Jalan Kampung, Taman Mesra, 43000 Kajang, Selangor',
      businessType: 'grocery',
      totalOrders: 4,
      totalAmount: 1800.00,
      lastOrder: '2024-07-18',
      status: 'active'
    }
  ],

  // Analytics Data
  analytics: {
    monthlyRevenue: {
      '2024-01': 8450.00,
      '2024-02': 9200.00,
      '2024-03': 10100.00,
      '2024-04': 9800.00,
      '2024-05': 11500.00,
      '2024-06': 12300.00,
      '2024-07': 8750.00 // Partial month
    },
    topProducts: [
      {
        name: 'Roti Canai',
        sales: 2450.00,
        units: 980,
        category: 'bread'
      },
      {
        name: 'Kaya Toast Bread',
        sales: 2200.00,
        units: 489,
        category: 'bread'
      },
      {
        name: 'Wedding Cakes',
        sales: 1980.00,
        units: 67,
        category: 'cakes'
      },
      {
        name: 'Traditional Cookies',
        sales: 1750.00,
        units: 194,
        category: 'cookies'
      },
      {
        name: 'Curry Sauce',
        sales: 1200.00,
        units: 141,
        category: 'condiments'
      }
    ],
    customerDemographics: {
      businessTypes: {
        restaurant: 35,
        coffee_shop: 28,
        school: 15,
        grocery: 12,
        hotel: 10
      },
      locations: {
        'Kuala Lumpur': 45,
        'Selangor': 35,
        'Penang': 12,
        'Johor': 8
      }
    },
    cashFlow: {
      weekly: [
        { date: '2024-07-08', income: 1200.00, expense: 450.00 },
        { date: '2024-07-09', income: 890.00, expense: 320.00 },
        { date: '2024-07-10', income: 1450.00, expense: 680.00 },
        { date: '2024-07-11', income: 980.00, expense: 220.00 },
        { date: '2024-07-12', income: 1680.00, expense: 890.00 },
        { date: '2024-07-13', income: 750.00, expense: 180.00 },
        { date: '2024-07-14', income: 1200.00, expense: 420.00 }
      ]
    }
  },

  // ESG Data
  esg: {
    carbonFootprint: {
      currentMonth: 2.3, // kg CO₂ saved
      target: 5.0,
      activities: [
        { type: 'digital_receipts', savings: 0.8 },
        { type: 'reduced_paper', savings: 0.9 },
        { type: 'local_sourcing', savings: 0.6 }
      ]
    },
    donations: {
      currentMonth: 45.60, // RM
      target: 100.00,
      charities: [
        { name: 'Persatuan Kebajikan Anak Yatim', amount: 25.30 },
        { name: 'Tabung Bencana Malaysia', amount: 20.30 }
      ]
    },
    communitySupport: {
      localBusinessesSupported: 5,
      totalAmount: 890.00,
      partnerships: [
        'Ladang Sayur Organik Pak Man',
        'Kilang Tepung Keluarga',
        'Kedai Peralatan Dapur Siti'
      ]
    }
  },

  // Notification Data
  notifications: [
    {
      id: 'notif_001',
      type: 'payment_received',
      title: 'Payment Received',
      message: 'RM 450.00 received from Restoran Maju',
      timestamp: '2024-07-18T10:30:00Z',
      read: false,
      priority: 'high'
    },
    {
      id: 'notif_002',
      type: 'invoice_due',
      title: 'Invoice Due Soon',
      message: 'Invoice INV-2024-004 due in 3 days',
      timestamp: '2024-07-18T08:00:00Z',
      read: false,
      priority: 'medium'
    },
    {
      id: 'notif_003',
      type: 'esg_milestone',
      title: 'ESG Milestone Reached',
      message: 'You\'ve saved 2.3kg CO₂ this month!',
      timestamp: '2024-07-17T16:00:00Z',
      read: true,
      priority: 'low'
    }
  ],

  // Settings Data
  settings: {
    notifications: {
      invoiceReminders: true,
      paymentAlerts: true,
      esgUpdates: true,
      marketingEmails: false
    },
    esg: {
      donationRoundup: true,
      carbonTracking: true,
      communitySupport: true
    },
    business: {
      defaultPaymentTerms: 14, // days
      defaultCurrency: 'MYR',
      sstRate: 0.06, // 6%
      invoiceNumberPrefix: 'INV-2024-'
    }
  },

  // Malaysian Banks Data
  malaysianBanks: [
    { code: 'MBB', name: 'Maybank', fullName: 'Malayan Banking Berhad' },
    { code: 'CIMB', name: 'CIMB Bank', fullName: 'CIMB Bank Berhad' },
    { code: 'PBB', name: 'Public Bank', fullName: 'Public Bank Berhad' },
    { code: 'RHB', name: 'RHB Bank', fullName: 'RHB Bank Berhad' },
    { code: 'HLB', name: 'Hong Leong Bank', fullName: 'Hong Leong Bank Berhad' },
    { code: 'AMMB', name: 'AmBank', fullName: 'AMMB Holdings Berhad' },
    { code: 'UOB', name: 'UOB Malaysia', fullName: 'United Overseas Bank (Malaysia) Bhd' },
    { code: 'OCBC', name: 'OCBC Bank', fullName: 'OCBC Bank (Malaysia) Berhad' },
    { code: 'SCB', name: 'Standard Chartered', fullName: 'Standard Chartered Bank Malaysia Berhad' },
    { code: 'BSN', name: 'Bank Simpanan Nasional', fullName: 'Bank Simpanan Nasional' }
  ]
};

// Helper functions for data manipulation
const DataHelper = {
  // Get user data
  getUser: () => mockData.user,
  
  // Get accounts
  getAccounts: () => mockData.accounts,
  getAccountById: (id) => mockData.accounts.find(acc => acc.id === id),
  getDefaultAccount: () => mockData.accounts.find(acc => acc.isDefault),
  
  // Get transactions
  getTransactions: (limit = null) => {
    const sorted = mockData.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return limit ? sorted.slice(0, limit) : sorted;
  },
  getTransactionsByAccount: (accountId) => {
    return mockData.transactions.filter(txn => txn.accountId === accountId);
  },
  
  // Get invoices
  getInvoices: () => mockData.invoices.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)),
  getInvoiceById: (id) => mockData.invoices.find(inv => inv.id === id),
  getPendingInvoices: () => mockData.invoices.filter(inv => inv.status === 'pending'),
  
  // Get customers
  getCustomers: () => mockData.customers,
  getCustomerById: (id) => mockData.customers.find(cust => cust.id === id),
  
  // Get analytics
  getAnalytics: () => mockData.analytics,
  getTopProducts: (limit = 5) => mockData.analytics.topProducts.slice(0, limit),
  
  // Get ESG data
  getESGData: () => mockData.esg,
  
  // Get notifications
  getNotifications: () => mockData.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  getUnreadNotifications: () => mockData.notifications.filter(notif => !notif.read),
  
  // Utility functions
  formatCurrency: (amount, currency = 'MYR') => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },
  
  formatDate: (date, locale = 'en-MY') => {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  calculateSST: (amount, rate = 0.06) => {
    return amount * rate;
  },
  
  generateInvoiceNumber: () => {
    const prefix = mockData.settings.business.invoiceNumberPrefix;
    const nextNumber = String(mockData.invoices.length + 1).padStart(3, '0');
    return `${prefix}${nextNumber}`;
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mockData, DataHelper };
} else if (typeof window !== 'undefined') {
  window.mockData = mockData;
  window.DataHelper = DataHelper;
} 