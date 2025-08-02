// ===== INVOICE MANAGER =====

class InvoiceManager {
  constructor() {
    this.currentInvoice = {
      lineItems: [],
      subtotal: 0,
      sst: 0,
      total: 0
    };
    this.lineItemCounter = 0;
    this.sstRate = 0.06; // 6% SST
    
    this.init();
  }

  // Initialize invoice manager
  init() {
    console.log('Initializing Invoice Manager...');
    this.setupEventListeners();
  }

  // Setup event listeners
  setupEventListeners() {
    // Add line item button
    const addItemBtn = document.querySelector('.btn-secondary[onclick="addLineItem()"]');
    if (addItemBtn) {
      addItemBtn.removeAttribute('onclick');
      addItemBtn.addEventListener('click', () => this.addLineItem());
    }

    // Save as draft button
    window.saveAsDraft = () => this.saveAsDraft();
    
    // Preview invoice button
    window.previewInvoice = () => this.previewInvoice();

    // Global function for removing line items
    window.removeLineItem = (index) => this.removeLineItem(index);
  }

  // Initialize invoice form
  initializeInvoiceForm() {
    console.log('Initializing invoice form...');
    
    // Set default values
    this.setDefaultValues();
    
    // Add initial line item
    this.addLineItem();
    
    // Setup form validation
    this.setupFormValidation();
  }

  // Set default values
  setDefaultValues() {
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    const invoiceDateInput = document.getElementById('invoice-date');
    const dueDateInput = document.getElementById('due-date');
    
    if (invoiceDateInput) {
      invoiceDateInput.value = today;
    }
    
    // Set due date 14 days from today
    if (dueDateInput) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      dueDateInput.value = dueDate.toISOString().split('T')[0];
    }

    // Generate invoice number
    const invoiceNumberInput = document.getElementById('invoice-number');
    if (invoiceNumberInput) {
      invoiceNumberInput.value = DataHelper.generateInvoiceNumber();
    }

    // Reset current invoice
    this.currentInvoice = {
      lineItems: [],
      subtotal: 0,
      sst: 0,
      total: 0
    };
    this.lineItemCounter = 0;
  }

  // Setup form validation
  setupFormValidation() {
    const form = document.getElementById('invoice-form');
    if (!form) return;

    // Add validation for required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });

    // Prevent form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  // Validate field
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    // Remove existing error
    this.clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, `${this.formatFieldName(fieldName)} is required`);
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      return false;
    }
    
    // Date validation
    if (field.type === 'date' && value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (fieldName === 'dueDate' && date < today) {
        this.showFieldError(field, 'Due date cannot be in the past');
        return false;
      }
    }
    
    return true;
  }

  // Show field error
  showFieldError(field, message) {
    field.classList.add('error');
    field.parentElement.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
  }

  // Clear field error
  clearFieldError(field) {
    field.classList.remove('error');
    field.parentElement.classList.remove('error');
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  // Format field name for display
  formatFieldName(name) {
    return name.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add line item
  addLineItem(item = null) {
    const lineItemsContainer = document.getElementById('line-items');
    if (!lineItemsContainer) return;

    const itemData = item || {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };

    const lineItemHTML = `
      <div class="line-item" data-item-index="${this.lineItemCounter}">
        <div class="form-group">
          <label>Description</label>
          <input type="text" 
                 name="lineItem[${this.lineItemCounter}][description]" 
                 value="${itemData.description}"
                 placeholder="Item description" 
                 required>
        </div>
        
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" 
                 name="lineItem[${this.lineItemCounter}][quantity]" 
                 value="${itemData.quantity}"
                 min="1" 
                 step="1" 
                 required>
        </div>
        
        <div class="form-group">
          <label>Unit Price (RM)</label>
          <input type="number" 
                 name="lineItem[${this.lineItemCounter}][unitPrice]" 
                 value="${itemData.unitPrice}"
                 min="0" 
                 step="0.01" 
                 required>
        </div>
        
        <div class="form-group">
          <label>Total (RM)</label>
          <input type="number" 
                 name="lineItem[${this.lineItemCounter}][total]" 
                 value="${itemData.total}"
                 readonly 
                 class="calculated-field">
        </div>
        
        <button type="button" 
                class="remove-item-btn" 
                onclick="removeLineItem(${this.lineItemCounter})"
                title="Remove item">
          ×
        </button>
      </div>
    `;

    lineItemsContainer.insertAdjacentHTML('beforeend', lineItemHTML);

    // Add event listeners to the new line item
    const newLineItem = lineItemsContainer.lastElementChild;
    this.setupLineItemListeners(newLineItem);

    this.lineItemCounter++;
    this.calculateTotals();
  }

  // Setup line item event listeners
  setupLineItemListeners(lineItem) {
    const quantityInput = lineItem.querySelector('input[name*="[quantity]"]');
    const unitPriceInput = lineItem.querySelector('input[name*="[unitPrice]"]');
    
    [quantityInput, unitPriceInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.updateLineItemTotal(lineItem);
          this.calculateTotals();
        });
      }
    });
  }

  // Update line item total
  updateLineItemTotal(lineItem) {
    const quantityInput = lineItem.querySelector('input[name*="[quantity]"]');
    const unitPriceInput = lineItem.querySelector('input[name*="[unitPrice]"]');
    const totalInput = lineItem.querySelector('input[name*="[total]"]');

    if (quantityInput && unitPriceInput && totalInput) {
      const quantity = parseFloat(quantityInput.value) || 0;
      const unitPrice = parseFloat(unitPriceInput.value) || 0;
      const total = quantity * unitPrice;
      
      totalInput.value = total.toFixed(2);
    }
  }

  // Remove line item
  removeLineItem(index) {
    const lineItem = document.querySelector(`[data-item-index="${index}"]`);
    if (lineItem) {
      lineItem.remove();
      this.calculateTotals();
      
      // Ensure at least one line item exists
      const remainingItems = document.querySelectorAll('.line-item');
      if (remainingItems.length === 0) {
        this.addLineItem();
      }
    }
  }

  // Calculate totals
  calculateTotals() {
    const lineItems = document.querySelectorAll('.line-item');
    let subtotal = 0;

    // Calculate subtotal from all line items
    lineItems.forEach(item => {
      const totalInput = item.querySelector('input[name*="[total]"]');
      if (totalInput) {
        subtotal += parseFloat(totalInput.value) || 0;
      }
    });

    // Calculate SST (6%)
    const sst = subtotal * this.sstRate;
    const total = subtotal + sst;

    // Update display
    this.updateTotalsDisplay(subtotal, sst, total);

    // Update current invoice object
    this.currentInvoice.subtotal = subtotal;
    this.currentInvoice.sst = sst;
    this.currentInvoice.total = total;
  }

  // Update totals display
  updateTotalsDisplay(subtotal, sst, total) {
    const subtotalEl = document.getElementById('subtotal-amount');
    const sstEl = document.getElementById('sst-amount');
    const totalEl = document.getElementById('total-amount');

    if (subtotalEl) {
      subtotalEl.textContent = DataHelper.formatCurrency(subtotal);
    }
    if (sstEl) {
      sstEl.textContent = DataHelper.formatCurrency(sst);
    }
    if (totalEl) {
      totalEl.textContent = DataHelper.formatCurrency(total);
    }
  }

  // Get form data
  getFormData() {
    const form = document.getElementById('invoice-form');
    if (!form) return null;

    const formData = new FormData(form);
    const invoice = {};

    // Basic invoice information
    invoice.customerName = formData.get('customerName');
    invoice.customerEmail = formData.get('customerEmail');
    invoice.customerAddress = formData.get('customerAddress');
    invoice.invoiceNumber = formData.get('invoiceNumber');
    invoice.invoiceDate = formData.get('invoiceDate');
    invoice.dueDate = formData.get('dueDate');

    // Line items
    invoice.lineItems = [];
    const lineItems = document.querySelectorAll('.line-item');
    
    lineItems.forEach((item, index) => {
      const description = item.querySelector('input[name*="[description]"]')?.value;
      const quantity = parseFloat(item.querySelector('input[name*="[quantity]"]')?.value) || 0;
      const unitPrice = parseFloat(item.querySelector('input[name*="[unitPrice]"]')?.value) || 0;
      const total = parseFloat(item.querySelector('input[name*="[total]"]')?.value) || 0;

      if (description && quantity > 0 && unitPrice >= 0) {
        invoice.lineItems.push({
          id: `item_${Date.now()}_${index}`,
          description,
          quantity,
          unitPrice,
          total
        });
      }
    });

    // Totals
    invoice.subtotal = this.currentInvoice.subtotal;
    invoice.sst = this.currentInvoice.sst;
    invoice.total = this.currentInvoice.total;
    invoice.currency = 'MYR';
    invoice.status = 'draft';

    return invoice;
  }

  // Validate form
  validateForm() {
    const form = document.getElementById('invoice-form');
    if (!form) return false;

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Validate line items
    const lineItems = document.querySelectorAll('.line-item');
    if (lineItems.length === 0) {
      this.showNotification('Please add at least one line item', 'error');
      isValid = false;
    }

    // Check if all line items have valid data
    let hasValidLineItems = false;
    lineItems.forEach(item => {
      const description = item.querySelector('input[name*="[description]"]')?.value.trim();
      const quantity = parseFloat(item.querySelector('input[name*="[quantity]"]')?.value) || 0;
      const unitPrice = parseFloat(item.querySelector('input[name*="[unitPrice]"]')?.value) || 0;

      if (description && quantity > 0 && unitPrice >= 0) {
        hasValidLineItems = true;
      }
    });

    if (!hasValidLineItems) {
      this.showNotification('Please ensure all line items have valid data', 'error');
      isValid = false;
    }

    return isValid;
  }

  // Save as draft
  saveAsDraft() {
    if (!this.validateForm()) {
      return;
    }

    const invoiceData = this.getFormData();
    if (!invoiceData) return;

    // Show loading state
    const saveBtn = document.querySelector('.btn-secondary[onclick="saveAsDraft()"], .btn-secondary');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    // Simulate save operation
    setTimeout(() => {
      // Add unique ID and timestamp
      invoiceData.id = `inv_${Date.now()}`;
      invoiceData.issueDate = invoiceData.invoiceDate;
      invoiceData.createdAt = new Date().toISOString();

      // Save to localStorage (simulate API)
      this.saveDraftToStorage(invoiceData);

      // Reset button
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;

      // Show success message
      this.showNotification('Invoice saved as draft successfully!', 'success');

      // Announce for accessibility
      if (window.msmeApp) {
        window.msmeApp.announce('Invoice saved as draft');
      }
    }, 1000);
  }

  // Save draft to storage
  saveDraftToStorage(invoiceData) {
    try {
      let drafts = JSON.parse(localStorage.getItem('msme-invoice-drafts') || '[]');
      
      // Check if this draft already exists (update) or is new (add)
      const existingIndex = drafts.findIndex(draft => draft.invoiceNumber === invoiceData.invoiceNumber);
      
      if (existingIndex >= 0) {
        drafts[existingIndex] = invoiceData;
      } else {
        drafts.push(invoiceData);
      }
      
      localStorage.setItem('msme-invoice-drafts', JSON.stringify(drafts));
    } catch (error) {
      console.warn('Failed to save draft to storage:', error);
    }
  }

  // Preview invoice
  previewInvoice() {
    if (!this.validateForm()) {
      return;
    }

    const invoiceData = this.getFormData();
    if (!invoiceData) return;

    // Generate preview HTML
    const previewHTML = this.generateInvoicePreview(invoiceData);
    
    // Show preview in modal or new window
    this.showInvoicePreview(previewHTML);
  }

  // Generate invoice preview HTML
  generateInvoicePreview(invoice) {
    const businessInfo = DataHelper.getUser();
    
    return `
      <div class="invoice-preview">
        <div class="invoice-header">
          <div class="business-info">
            <h1>${businessInfo.name}</h1>
            <p>Registration No: ${businessInfo.registrationNumber}</p>
            <p>SST No: ${businessInfo.sstNumber}</p>
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> ${DataHelper.formatDate(invoice.invoiceDate)}</p>
            <p><strong>Due Date:</strong> ${DataHelper.formatDate(invoice.dueDate)}</p>
          </div>
        </div>
        
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${invoice.customerName}</strong></p>
          ${invoice.customerEmail ? `<p>${invoice.customerEmail}</p>` : ''}
          ${invoice.customerAddress ? `<p>${invoice.customerAddress.replace(/\n/g, '<br>')}</p>` : ''}
        </div>
        
        <div class="invoice-items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${DataHelper.formatCurrency(item.unitPrice)}</td>
                  <td>${DataHelper.formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="invoice-totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>${DataHelper.formatCurrency(invoice.subtotal)}</span>
          </div>
          <div class="totals-row">
            <span>SST (6%):</span>
            <span>${DataHelper.formatCurrency(invoice.sst)}</span>
          </div>
          <div class="totals-row total">
            <span><strong>Total:</strong></span>
            <span><strong>${DataHelper.formatCurrency(invoice.total)}</strong></span>
          </div>
        </div>
        
        <div class="invoice-footer">
          <p><em>This is a computer-generated invoice.</em></p>
          <p><strong>Payment Terms:</strong> Net 14 days</p>
        </div>
      </div>
    `;
  }

  // Show invoice preview
  showInvoicePreview(html) {
    // Create modal for preview
    const modal = document.createElement('div');
    modal.className = 'modal active invoice-preview-modal';
    modal.innerHTML = `
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Invoice Preview</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          ${html}
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
          <button class="btn-primary" onclick="window.print()">Print</button>
          <button class="btn-primary" onclick="invoiceManager.sendInvoice()">Send Invoice</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add preview styles
    this.addPreviewStyles();
    
    // Focus on close button for accessibility
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  // Add preview styles
  addPreviewStyles() {
    if (document.getElementById('invoice-preview-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'invoice-preview-styles';
    style.textContent = `
      .invoice-preview-modal .modal-content {
        max-width: 800px;
        width: 90%;
      }
      
      .invoice-preview {
        background: white;
        padding: 2rem;
        color: black;
        font-family: 'Inter', sans-serif;
        line-height: 1.4;
      }
      
      .invoice-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #000;
      }
      
      .business-info h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        color: #2563eb;
      }
      
      .invoice-info {
        text-align: right;
      }
      
      .invoice-info h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.8rem;
        color: #2563eb;
      }
      
      .customer-info {
        margin-bottom: 2rem;
      }
      
      .customer-info h3 {
        margin: 0 0 0.5rem 0;
        color: #374151;
      }
      
      .invoice-items table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2rem;
      }
      
      .invoice-items th,
      .invoice-items td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .invoice-items th {
        background-color: #f3f4f6;
        font-weight: 600;
        color: #374151;
      }
      
      .invoice-items td:nth-child(2),
      .invoice-items td:nth-child(3),
      .invoice-items td:nth-child(4) {
        text-align: right;
      }
      
      .invoice-totals {
        margin-left: auto;
        width: 300px;
      }
      
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .totals-row.total {
        border-top: 2px solid #000;
        border-bottom: 2px solid #000;
        font-size: 1.1rem;
        margin-top: 0.5rem;
      }
      
      .invoice-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 0.9rem;
      }
      
      .modal-footer {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
      }
      
      @media print {
        .modal-header,
        .modal-footer {
          display: none !important;
        }
        
        .modal-content {
          box-shadow: none !important;
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
        }
      }
      
      @media (max-width: 768px) {
        .invoice-header {
          flex-direction: column;
          gap: 1rem;
        }
        
        .invoice-info {
          text-align: left;
        }
        
        .invoice-totals {
          width: 100%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Send invoice
  sendInvoice() {
    const invoiceData = this.getFormData();
    if (!invoiceData) return;

    // Simulate sending invoice
    this.showNotification('Sending invoice...', 'info');
    
    setTimeout(() => {
      // Update status to sent
      invoiceData.status = 'sent';
      invoiceData.sentDate = new Date().toISOString();
      
      // Save to mock data (simulate API)
      this.saveInvoiceToMockData(invoiceData);
      
      this.showNotification('Invoice sent successfully!', 'success');
      
      // Close preview modal
      const modal = document.querySelector('.invoice-preview-modal');
      if (modal) {
        modal.remove();
      }
      
      // Navigate to dashboard
      if (window.msmeApp) {
        window.msmeApp.showScreen('dashboard-screen');
      }
    }, 2000);
  }

  // Save invoice to mock data
  saveInvoiceToMockData(invoiceData) {
    // Add unique ID and additional fields
    invoiceData.id = `inv_${Date.now()}`;
    invoiceData.issueDate = invoiceData.invoiceDate;
    invoiceData.customerId = `cust_${Date.now()}`;
    
    // For demo purposes, just store in localStorage
    try {
      let invoices = JSON.parse(localStorage.getItem('msme-invoices') || '[]');
      invoices.push(invoiceData);
      localStorage.setItem('msme-invoices', JSON.stringify(invoices));
    } catch (error) {
      console.warn('Failed to save invoice:', error);
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
    } else if (type === 'error') {
      notification.style.borderColor = 'var(--error)';
      notification.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
    
    // Announce for accessibility
    if (window.msmeApp) {
      window.msmeApp.announce(message);
    }
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

  // Load draft invoices
  loadDrafts() {
    try {
      return JSON.parse(localStorage.getItem('msme-invoice-drafts') || '[]');
    } catch (error) {
      console.warn('Failed to load drafts:', error);
      return [];
    }
  }

  // Load saved invoices
  loadInvoices() {
    try {
      return JSON.parse(localStorage.getItem('msme-invoices') || '[]');
    } catch (error) {
      console.warn('Failed to load invoices:', error);
      return [];
    }
  }

  // Clear form
  clearForm() {
    const form = document.getElementById('invoice-form');
    if (!form) return;
    
    form.reset();
    
    // Clear line items
    const lineItemsContainer = document.getElementById('line-items');
    if (lineItemsContainer) {
      lineItemsContainer.innerHTML = '';
    }
    
    // Reset defaults
    this.setDefaultValues();
    this.addLineItem();
  }
}

// Initialize invoice manager
document.addEventListener('DOMContentLoaded', () => {
  window.invoiceManager = new InvoiceManager();
}); 