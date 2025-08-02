// Excel Upload Feature - Simple Implementation
// Adds Excel invoices to the existing invoice list and updates summary

document.addEventListener('DOMContentLoaded', function() {
    // Button click handler
    const uploadBtn = document.getElementById('excel-upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            // Create hidden file input if it doesn't exist
            let fileInput = document.getElementById('excel-file-input');
            if (!fileInput) {
                fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = 'excel-file-input';
                fileInput.accept = '.xlsx,.xls';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                
                // Add file selection handler
                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        readExcelFile(file);
                    }
                });
            }
            
            fileInput.click();
        });
    }
});

function readExcelFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Add each Excel row as new invoice to the controller
            let addedCount = 0;
            jsonData.forEach(row => {
                if (addInvoiceToController(row)) {
                    addedCount++;
                }
            });
            
            // Update the display after adding all invoices
            if (addedCount > 0 && window.invoiceController) {
                window.invoiceController.renderInvoices();
                window.invoiceController.updateSummaryCards();
            }
            
            alert(`Added ${addedCount} invoices to the list! Summary updated.`);
            
            // Clear file input
            const fileInput = document.getElementById('excel-file-input');
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            console.error('Error reading Excel file:', error);
            alert('Error reading Excel file. Please check the file format.');
        }
    };
    reader.readAsArrayBuffer(file);
}

function addInvoiceToController(excelRow) {
    // Check if invoice controller exists
    if (!window.invoiceController) {
        console.error('Invoice controller not found');
        return false;
    }
    
    try {
        // Convert Excel row to invoice object format
        const invoiceObject = convertExcelRowToInvoiceObject(excelRow);
        
        if (invoiceObject) {
            // Add to the controller's invoice arrays
            window.invoiceController.invoices.unshift(invoiceObject);
            window.invoiceController.filteredInvoices.unshift(invoiceObject);
            
            // Save to storage
            window.invoiceController.saveToStorage();
            
            return true;
        }
    } catch (error) {
        console.error('Error adding invoice to controller:', error);
    }
    
    return false;
}

function convertExcelRowToInvoiceObject(row) {
    // Parse and validate required fields
    const customerName = row['Customer Name'] || '';
    const invoiceNumber = row['Invoice Number'] || '';
    
    if (!customerName || !invoiceNumber) {
        console.warn('Skipping row with missing customer name or invoice number');
        return null;
    }
    
    // Parse amounts
    const amount = parseFloat(row['Total (RM)'] || 0);
    const quantity = parseFloat(row['Qty'] || 1);
    const unitPrice = parseFloat(row['Unit Price (RM)'] || 0);
    
    // Parse dates
    const invoiceDate = parseDate(row['Invoice Date']);
    const dueDate = parseDate(row['Due Date']);
    
    // Determine status based on due date
    let status = 'sent';
    if (dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        if (due < today) {
            status = 'overdue';
        }
    }
    
    // Map category
    const category = mapCategory(row['Category'] || 'business-expenses');
    
    // Create invoice object matching the existing format
    const invoiceObject = {
        id: invoiceNumber,
        customerName: customerName,
        customerEmail: row['Email Address'] || '',
        customerAddress: row['Billing Address'] || '',
        amount: amount,
        date: invoiceDate,
        dueDate: dueDate,
        status: status,
        type: (row['Transaction Type'] || 'income').toLowerCase(),
        category: category,
        items: [
            {
                description: row['Item Description'] || 'Imported item',
                quantity: quantity,
                price: unitPrice
            }
        ]
    };
    
    return invoiceObject;
}

function mapCategory(categoryName) {
    // Map category names to the existing category system
    const categoryMap = {
        'food-meals': 'food-meals',
        'food & meals': 'food-meals',
        'transport': 'transport',
        'business-expenses': 'business-expenses',
        'business expenses': 'business-expenses',
        'office-rent': 'office-rent',
        'office rent': 'office-rent',
        'office/rent': 'office-rent',
        'technology': 'technology',
        'education': 'education',
        'medical': 'medical',
        'professional-services': 'professional-services',
        'professional services': 'professional-services',
        'marketing': 'marketing',
        'utilities': 'utilities'
    };
    
    const normalizedCategory = categoryName.toLowerCase().trim();
    return categoryMap[normalizedCategory] || 'business-expenses';
}

function parseDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        
        // Try DD/MM/YYYY format
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const year = parseInt(parts[2]);
            const parsedDate = new Date(year, month, day);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split('T')[0];
            }
        }
        
        // Return today's date if parsing fails
        return new Date().toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
}

// Legacy function for backward compatibility (not used anymore)
function addInvoiceToList(excelRow) {
    console.warn('addInvoiceToList is deprecated. Use addInvoiceToController instead.');
    return addInvoiceToController(excelRow);
}

// Legacy function for backward compatibility (not used anymore)
function createInvoiceElement(row) {
    console.warn('createInvoiceElement is deprecated. Invoices are now managed by the controller.');
    return null;
}

function getCategoryInfo(categoryId) {
    // Category mapping to match existing system
    const categories = {
        'food-meals': { name: 'Food & Meals', icon: '🍽️', color: '#FF6B35' },
        'transport': { name: 'Transport', icon: '🚗', color: '#4A90E2' },
        'business-expenses': { name: 'Business Expenses', icon: '🏢', color: '#9B59B6' },
        'office-rent': { name: 'Office/Rent', icon: '🏠', color: '#27AE60' },
        'technology': { name: 'Technology', icon: '📱', color: '#1ABC9C' },
        'education': { name: 'Education', icon: '📚', color: '#F39C12' },
        'medical': { name: 'Medical', icon: '🏥', color: '#E74C3C' },
        'professional-services': { name: 'Professional Services', icon: '💼', color: '#2C3E50' },
        'marketing': { name: 'Marketing', icon: '🎯', color: '#E91E63' },
        'utilities': { name: 'Utilities', icon: '⚡', color: '#3498DB' }
    };
    
    // Try to match category by name or ID
    const categoryLower = categoryId.toLowerCase();
    
    // Direct match
    if (categories[categoryLower]) {
        return categories[categoryLower];
    }
    
    // Partial match
    for (const [key, value] of Object.entries(categories)) {
        if (categoryLower.includes(key.replace('-', ' ')) || 
            value.name.toLowerCase().includes(categoryLower)) {
            return value;
        }
    }
    
    // Default category
    return { name: 'Business', icon: '📊', color: '#3b82f6' };
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Try DD/MM/YYYY format
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                const parsedDate = new Date(year, month, day);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toLocaleDateString('en-MY', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                }
            }
            return dateString; // Return original if parsing fails
        }
        
        return date.toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Helper functions that should exist in the main invoice system
function viewInvoice(invoiceId) {
    console.log('Viewing invoice from excel-upload.js:', invoiceId);
    // Call the main invoice view function directly
    if (window.invoiceController && typeof window.invoiceController.viewInvoice === 'function') {
        window.invoiceController.viewInvoice(invoiceId);
    } else {
        console.error('Invoice controller not found');
        alert('View functionality not available');
    }
}

function editInvoice(invoiceId) {
    console.log('Editing invoice from excel-upload.js:', invoiceId);
    // Call the main invoice edit function directly
    if (window.invoiceController) {
        const invoice = window.invoiceController.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
            alert('Invoice not found');
            return;
        }
        
        // Reset form first
        const form = document.getElementById('create-invoice-form');
        form.reset();
        document.getElementById('line-items').innerHTML = '';
        
        // Populate customer information
        document.getElementById('customer-name').value = invoice.customerName;
        document.getElementById('customer-email').value = invoice.customerEmail || '';
        document.getElementById('customer-address').value = invoice.customerAddress || '';
        
        // Populate invoice details
        document.getElementById('invoice-number').value = invoice.id;
        document.getElementById('invoice-date').value = invoice.date;
        document.getElementById('due-date').value = invoice.dueDate;
        document.getElementById('transaction-type').value = invoice.type || 'income';
        document.getElementById('transaction-category').value = invoice.category || 'business-expenses';
        
        // Populate line items
        invoice.items.forEach(item => {
            window.invoiceController.addLineItem();
            const lineItems = document.querySelectorAll('.line-item');
            const lastItem = lineItems[lineItems.length - 1];
            
            lastItem.querySelector('input[name="description[]"]').value = item.description;
            lastItem.querySelector('input[name="quantity[]"]').value = item.quantity;
            lastItem.querySelector('input[name="price[]"]').value = item.price.toFixed(2);
            
            // Calculate line total
            const qty = item.quantity;
            const price = item.price;
            const total = qty * price;
            lastItem.querySelector('.line-total').value = total.toFixed(2);
        });
        
        // Calculate totals
        if (typeof calculateTotals === 'function') {
            calculateTotals();
        }
        
        // Store the invoice ID being edited
        form.dataset.editingInvoiceId = invoiceId;
        
        // Change modal title and button text
        document.querySelector('#create-invoice-modal .modal-header h2').textContent = `Edit Invoice ${invoice.id}`;
        document.querySelector('#create-invoice-modal .btn-primary').textContent = 'Update Invoice';
        
        // Show modal
        document.getElementById('create-invoice-modal').classList.add('active');
    } else {
        console.error('Invoice controller not found');
        alert('Edit functionality not available');
    }
}

function downloadInvoice(invoiceId) {
    console.log('Downloading invoice from excel-upload.js:', invoiceId);
    // Call the main invoice download function directly
    if (window.invoiceController) {
        const invoice = window.invoiceController.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
            alert('Invoice not found');
            return;
        }



        try {
            // Create PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Set font
            doc.setFont("helvetica");

            // Header - Customer Info
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text(invoice.customerName, 20, 25);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            if (invoice.customerAddress) {
              const addressLines = invoice.customerAddress.split('\n');
              addressLines.forEach((line, index) => {
                doc.text(line.trim(), 20, 35 + (index * 7));
              });
            }
            if (invoice.customerEmail) {
              doc.text(invoice.customerEmail, 20, 35 + (invoice.customerAddress ? invoice.customerAddress.split('\n').length * 7 : 0));
            }

            // Invoice Title and Meta
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("INVOICE", 150, 25);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Invoice #: ${invoice.id}`, 150, 40);
            doc.text(`Date: ${window.invoiceController.formatDate(invoice.date)}`, 150, 47);
            doc.text(`Due Date: ${window.invoiceController.formatDate(invoice.dueDate)}`, 150, 54);

            // Bill To Section
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Bill To:", 20, 70);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(invoice.customerName, 20, 80);
            if (invoice.customerEmail) {
                doc.text(invoice.customerEmail, 20, 87);
            }

            // Table Header
            let yPosition = 110;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            
            // Draw table header background
            doc.setFillColor(245, 245, 245);
            doc.rect(20, yPosition - 7, 170, 12, 'F');
            
            // Table headers
            doc.text("Description", 25, yPosition);
            doc.text("Qty", 120, yPosition);
            doc.text("Price (RM)", 140, yPosition);
            doc.text("Total (RM)", 170, yPosition);
            
            // Draw header border
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPosition + 3, 190, yPosition + 3);

            // Table Content
            yPosition += 15;
            doc.setFont("helvetica", "normal");
            
            let subtotal = 0;
            invoice.items.forEach((item, index) => {
                const lineTotal = item.quantity * item.price;
                subtotal += lineTotal;
                
                // Handle long descriptions
                const description = item.description.length > 35 ? 
                    item.description.substring(0, 35) + "..." : item.description;
                
                doc.text(description, 25, yPosition);
                doc.text(item.quantity.toString(), 125, yPosition);
                doc.text(item.price.toFixed(2), 145, yPosition);
                doc.text(lineTotal.toFixed(2), 175, yPosition);
                
                yPosition += 8;
                
                // Add new page if needed
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
            });

            // Totals Section
            yPosition += 10;
            const sst = subtotal * 0.06;
            const total = subtotal + sst;

            // Draw totals background
            doc.setFillColor(248, 249, 250);
            doc.rect(130, yPosition - 5, 60, 25, 'F');
            doc.setDrawColor(233, 236, 239);
            doc.rect(130, yPosition - 5, 60, 25);

            doc.setFont("helvetica", "normal");
            doc.text("Subtotal:", 135, yPosition);
            doc.text(`RM ${subtotal.toFixed(2)}`, 175, yPosition);
            
            yPosition += 7;
            doc.text("SST (6%):", 135, yPosition);
            doc.text(`RM ${sst.toFixed(2)}`, 175, yPosition);
            
            // Final total with emphasis
            yPosition += 7;
            doc.setFont("helvetica", "bold");
            doc.text("Total:", 135, yPosition);
            doc.text(`RM ${total.toFixed(2)}`, 175, yPosition);

            // Footer
            yPosition += 20;
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text("Thank you for your business!", 20, yPosition);
            doc.text(`Generated on ${new Date().toLocaleDateString('en-MY')}`, 20, yPosition + 7);

            // Save the PDF
            const fileName = `Invoice_${invoice.id}_${invoice.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            doc.save(fileName);

            // Show success message
            if (window.invoiceController && typeof window.invoiceController.announce === 'function') {
                window.invoiceController.announce(`Invoice ${invoice.id} downloaded successfully`);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert(`Error generating PDF: ${error.message}`);
        }
    } else {
        console.error('Invoice controller not found');
        alert('Download functionality not available');
    }
} 