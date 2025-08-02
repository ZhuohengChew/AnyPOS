// Account Manager for MSME Platform

class AccountManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const addAccountBtn = document.getElementById('add-account-btn');
    if (addAccountBtn) {
      addAccountBtn.addEventListener('click', () => {
        this.showAddAccountModal();
      });
    }

    const addAccountForm = document.getElementById('add-account-form');
    if (addAccountForm) {
      addAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddAccount(e.target);
      });
    }
  }

  showAddAccountModal() {
    const modal = document.getElementById('add-account-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeAddAccountModal() {
    const modal = document.getElementById('add-account-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      const form = document.getElementById('add-account-form');
      if (form) form.reset();
    }
  }

  handleAddAccount(form) {
    const formData = new FormData(form);
    const accountData = {
      bankCode: formData.get('bankCode'),
      accountNumber: formData.get('accountNumber'),
      accountType: formData.get('accountType'),
      balance: this.generateRandomBalance(),
      isDefault: formData.get('isDefault') === 'on'
    };

    if (!this.validateAccountData(accountData)) return;

    const newAccount = this.createNewAccount(accountData);
    this.addAccountToData(newAccount);
    this.refreshAccounts();
    this.closeAddAccountModal();
    this.showSuccessMessage(`Account added successfully! Initial balance: RM ${DataHelper.formatCurrency(newAccount.balance)}`);
  }

  generateRandomBalance() {
    // Generate a random balance between RM 1,000 and RM 50,000
    const minBalance = 1000;
    const maxBalance = 50000;
    const randomBalance = Math.random() * (maxBalance - minBalance) + minBalance;
    return Math.round(randomBalance * 100) / 100; // Round to 2 decimal places
  }

  validateAccountData(data) {
    if (!data.bankCode) {
      this.showErrorMessage('Please select a bank');
      return false;
    }
    if (!data.accountNumber || data.accountNumber.length < 10) {
      this.showErrorMessage('Account number must be at least 10 digits');
      return false;
    }
    if (!data.accountType) {
      this.showErrorMessage('Please select an account type');
      return false;
    }
    return true;
  }

  createNewAccount(data) {
    const bankInfo = mockData.malaysianBanks.find(bank => bank.code === data.bankCode);
    const accountId = `acc_${Date.now()}`;
    const maskedNumber = `****${data.accountNumber.slice(-4)}`;
    
    if (data.isDefault) {
      mockData.accounts.forEach(acc => acc.isDefault = false);
    }

    return {
      id: accountId,
      bankName: bankInfo ? bankInfo.name : data.bankCode,
      bankCode: data.bankCode,
      accountNumber: maskedNumber,
      fullAccountNumber: data.accountNumber,
      balance: data.balance,
      currency: 'MYR',
      accountType: data.accountType,
      isDefault: data.isDefault,
      status: 'active'
    };
  }

  addAccountToData(newAccount) {
    mockData.accounts.push(newAccount);
    this.saveAccountsToStorage();
  }

  saveAccountsToStorage() {
    try {
      localStorage.setItem('msme_accounts', JSON.stringify(mockData.accounts));
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  }

  refreshAccounts() {
    if (window.dashboardManager) {
      window.dashboardManager.loadBalanceCards();
    }
  }

  showSuccessMessage(message) {
    alert(message);
  }

  showErrorMessage(message) {
    alert(message);
  }
}

function closeAddAccountModal() {
  if (window.accountManager) {
    window.accountManager.closeAddAccountModal();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.accountManager = new AccountManager();
}); 