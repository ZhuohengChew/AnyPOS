// Tax Status Detail Management
class TaxStatusDetailManager {
    constructor() {
        this.initializePage();
    }

    // Initialize Page
    initializePage() {
        const recordId = sessionStorage.getItem('selectedTaxRecord') || 'TB-2024-001';
        this.loadRecordDetail(recordId);
    }

    // Load Record Detail
    loadRecordDetail(recordId) {
        const recordDetail = this.getRecordDetail(recordId);
        this.displayRecordDetail(recordDetail);
        this.displayStatusTimeline(recordDetail);
        
        if (recordDetail.status === 'declined') {
            this.displayCorrectionPrompts(recordDetail);
        }
    }

    // Get Record Detail
    getRecordDetail(recordId) {
        const mockDetails = {
            'TB-2024-001': {
                id: 'TB-2024-001',
                date: '15 March 2024',
                status: 'pending',
                type: 'Income Tax',
                year: '2024',
                incomeTax: 12450.00,
                businessTax: 8200.00,
                sst: 2700.00,
                totalTax: 23350.00,
                timeline: [
                    {
                        date: '15 March 2024',
                        title: 'Submission Received',
                        description: 'Your tax submission has been received and is under review.'
                    },
                    {
                        date: '15 March 2024',
                        title: 'Initial Processing',
                        description: 'Documents are being verified and processed.'
                    }
                ]
            },
            'TB-2023-011': {
                id: 'TB-2023-011',
                date: '15 November 2023',
                status: 'declined',
                type: 'Business Tax',
                year: '2023',
                incomeTax: 0.00,
                businessTax: 12400.00,
                sst: 0.00,
                totalTax: 12400.00,
                timeline: [
                    {
                        date: '15 November 2023',
                        title: 'Submission Received',
                        description: 'Your tax submission has been received.'
                    },
                    {
                        date: '20 November 2023',
                        title: 'Under Review',
                        description: 'Your submission is being reviewed by our team.'
                    },
                    {
                        date: '25 November 2023',
                        title: 'Issues Identified',
                        description: 'Several issues have been identified that require correction.'
                    }
                ],
                corrections: [
                    {
                        title: 'Missing Business Registration Document',
                        description: 'Please provide a copy of your business registration certificate (SSM).',
                        action: 'Upload business registration document'
                    },
                    {
                        title: 'Incorrect Business Income Calculation',
                        description: 'The business income calculation appears to be incorrect. Please review and provide supporting documents.',
                        action: 'Review and correct income calculation'
                    },
                    {
                        title: 'Missing Expense Receipts',
                        description: 'Please provide receipts for business expenses totaling RM 45,000.',
                        action: 'Upload expense receipts'
                    }
                ]
            },
            'TB-2023-005': {
                id: 'TB-2023-005',
                date: '10 May 2023',
                status: 'declined',
                type: 'Business Tax',
                year: '2023',
                incomeTax: 0.00,
                businessTax: 14800.00,
                sst: 0.00,
                totalTax: 14800.00,
                timeline: [
                    {
                        date: '10 May 2023',
                        title: 'Submission Received',
                        description: 'Your tax submission has been received.'
                    },
                    {
                        date: '15 May 2023',
                        title: 'Under Review',
                        description: 'Your submission is being reviewed by our team.'
                    },
                    {
                        date: '20 May 2023',
                        title: 'Issues Identified',
                        description: 'Several issues have been identified that require correction.'
                    }
                ],
                corrections: [
                    {
                        title: 'Incomplete Financial Statements',
                        description: 'Please provide complete financial statements including profit and loss statement.',
                        action: 'Upload complete financial statements'
                    },
                    {
                        title: 'Missing Bank Statements',
                        description: 'Please provide bank statements for the last 3 months of the tax year.',
                        action: 'Upload bank statements'
                    }
                ]
            }
        };

        return mockDetails[recordId] || mockDetails['TB-2024-001'];
    }

    // Display Record Detail
    displayRecordDetail(record) {
        // Update submission info
        document.getElementById('submission-id').textContent = record.id;
        document.getElementById('submission-date').textContent = `Submitted on ${record.date}`;
        
        // Update status badge
        const statusBadge = document.getElementById('status-badge');
        const statusText = document.querySelector('.status-text');
        statusBadge.className = `status-badge ${record.status}`;
        statusText.textContent = this.getStatusText(record.status);

        // Update tax amounts
        document.getElementById('income-tax-amount').textContent = this.formatCurrency(record.incomeTax);
        document.getElementById('business-tax-amount').textContent = this.formatCurrency(record.businessTax);
        document.getElementById('sst-amount').textContent = this.formatCurrency(record.sst);
        document.getElementById('total-tax-amount').textContent = this.formatCurrency(record.totalTax);
    }

    // Display Status Timeline
    displayStatusTimeline(record) {
        const timelineContainer = document.getElementById('status-timeline');
        if (!timelineContainer) return;

        timelineContainer.innerHTML = '';

        record.timeline.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-description">${item.description}</div>
                </div>
            `;

            timelineContainer.appendChild(timelineItem);
        });
    }

    // Display Correction Prompts
    displayCorrectionPrompts(record) {
        const correctionSection = document.getElementById('correction-section');
        const promptsList = document.getElementById('prompts-list');
        
        if (!correctionSection || !promptsList || !record.corrections) return;

        correctionSection.style.display = 'block';
        promptsList.innerHTML = '';

        record.corrections.forEach(prompt => {
            const promptItem = document.createElement('div');
            promptItem.className = 'prompt-item';
            
            promptItem.innerHTML = `
                <div class="prompt-title">${prompt.title}</div>
                <div class="prompt-description">${prompt.description}</div>
                <div class="prompt-action">${prompt.action}</div>
            `;

            promptsList.appendChild(promptItem);
        });
    }

    // Get Status Text
    getStatusText(status) {
        switch (status) {
            case 'accepted': return 'Accepted';
            case 'pending': return 'Pending Review';
            case 'declined': return 'Need Resubmission';
            default: return 'Pending Review';
        }
    }

    // Format Currency
    formatCurrency(amount) {
        return `RM ${amount.toFixed(2)}`;
    }
}

// Initialize Tax Status Detail Manager
document.addEventListener('DOMContentLoaded', () => {
    window.taxStatusDetailManager = new TaxStatusDetailManager();
});

// Global Functions
function resubmitTax() {
    const recordId = sessionStorage.getItem('selectedTaxRecord') || 'TB-2024-001';
    const recordDetail = window.taxStatusDetailManager.getRecordDetail(recordId);
    
    if (recordDetail.status === 'declined') {
        // Show loading state
        const resubmitBtn = document.querySelector('[onclick="resubmitTax()"]');
        const originalText = resubmitBtn.innerHTML;
        resubmitBtn.innerHTML = '⏳ Resubmitting...';
        resubmitBtn.disabled = true;
        
        // Simulate resubmission process
        setTimeout(() => {
            // Update the record status to pending
            recordDetail.status = 'pending';
            recordDetail.timeline.push({
                date: new Date().toLocaleDateString('en-MY'),
                title: 'Resubmitted with Corrections',
                description: 'Your corrected submission has been resubmitted and is under review.'
            });
            
            // Update the display
            window.taxStatusDetailManager.displayRecordDetail(recordDetail);
            window.taxStatusDetailManager.displayStatusTimeline(recordDetail);
            
            // Hide the correction section since it's now pending
            const correctionSection = document.getElementById('correction-section');
            if (correctionSection) {
                correctionSection.style.display = 'none';
            }
            
            // Store updated status in sessionStorage for tax status page
            const updatedRecords = JSON.parse(sessionStorage.getItem('taxRecords') || '{}');
            updatedRecords[recordId] = {
                ...recordDetail,
                status: 'pending',
                lastUpdated: new Date().toISOString()
            };
            sessionStorage.setItem('taxRecords', JSON.stringify(updatedRecords));
            
            // Show success notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                font-family: 'Inter', sans-serif;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-size: 20px;">✅</div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Resubmission Successful!</div>
                        <div style="font-size: 14px; opacity: 0.9;">Your corrected submission is now pending review.</div>
                    </div>
                </div>
            `;
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Remove notification after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
            
            // Reset button
            resubmitBtn.innerHTML = originalText;
            resubmitBtn.disabled = false;
            
        }, 2000);
        
    } else {
        alert('This submission does not require corrections.');
    }
}

function downloadCorrectionForm() {
    const recordId = sessionStorage.getItem('selectedTaxRecord') || 'TB-2024-001';
    const recordDetail = window.taxStatusDetailManager.getRecordDetail(recordId);
    
    if (recordDetail.status === 'declined') {
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font and size
        doc.setFont('helvetica');
        doc.setFontSize(16);
        
        // Title
        doc.text('LHDN TAX CORRECTION FORM', 20, 20);
        doc.setFontSize(10);
        
        // Header information
        doc.text(`Submission ID: ${recordDetail.id}`, 20, 35);
        doc.text(`Date: ${new Date().toLocaleDateString('en-MY')}`, 20, 42);
        doc.text(`Tax Type: ${recordDetail.type}`, 20, 49);
        doc.text(`Year: ${recordDetail.year}`, 20, 56);
        doc.text(`Total Tax Amount: ${window.taxStatusDetailManager.formatCurrency(recordDetail.totalTax)}`, 20, 63);
        
        // Required Corrections
        doc.setFontSize(12);
        doc.text('REQUIRED CORRECTIONS:', 20, 80);
        doc.setFontSize(10);
        
        let yPosition = 90;
        recordDetail.corrections.forEach((correction, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(`${index + 1}. ${correction.title}`, 20, yPosition);
            doc.setFontSize(8);
            doc.text(`Description: ${correction.description}`, 25, yPosition + 5);
            doc.text(`Action Required: ${correction.action}`, 25, yPosition + 10);
            doc.text(`Status: [ ] Completed`, 25, yPosition + 15);
            doc.text(`Notes: ________________________________`, 25, yPosition + 20);
            doc.setFontSize(10);
            yPosition += 30;
        });
        
        // Document Checklist
        if (yPosition > 200) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.text('DOCUMENT CHECKLIST:', 20, yPosition);
        doc.setFontSize(10);
        yPosition += 10;
        
        const checklistItems = [
            'Business Registration Certificate (SSM)',
            'Financial Statements',
            'Bank Statements',
            'Expense Receipts',
            'Income Supporting Documents',
            'Other Required Documents'
        ];
        
        checklistItems.forEach(item => {
            doc.text(`[ ] ${item}`, 25, yPosition);
            yPosition += 5;
        });
        
        // Instructions
        if (yPosition > 180) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.text('INSTRUCTIONS:', 20, yPosition);
        doc.setFontSize(10);
        yPosition += 10;
        
        const instructions = [
            '1. Review each correction item carefully',
            '2. Complete all required actions',
            '3. Check the box when each item is completed',
            '4. Attach all supporting documents',
            '5. Submit this form along with corrected documents',
            '6. Keep a copy for your records'
        ];
        
        instructions.forEach(instruction => {
            doc.text(instruction, 20, yPosition);
            yPosition += 5;
        });
        
        // Declaration
        if (yPosition > 150) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.text('DECLARATION:', 20, yPosition);
        doc.setFontSize(10);
        yPosition += 10;
        
        const declarations = [
            'I hereby declare that:',
            '- All corrections have been made as required',
            '- All information provided is true and accurate',
            '- All supporting documents are genuine',
            '- I understand that false declarations may result in penalties'
        ];
        
        declarations.forEach(declaration => {
            doc.text(declaration, 20, yPosition);
            yPosition += 5;
        });
        
        yPosition += 10;
        doc.text('Signature: _____________________', 20, yPosition);
        doc.text('Date: _____________________', 20, yPosition + 7);
        doc.text('IC Number: _____________________', 20, yPosition + 14);
        
        // Save the PDF
        doc.save(`LHDN_Correction_Form_${recordDetail.id}.pdf`);
        
        alert('Correction form has been downloaded successfully!\n\nFile: LHDN_Correction_Form_' + recordDetail.id + '.pdf');
    } else {
        alert('This submission does not require corrections.');
    }
}

function downloadDocument(type) {
    const recordId = sessionStorage.getItem('selectedTaxRecord') || 'TB-2024-001';
    const recordDetail = window.taxStatusDetailManager.getRecordDetail(recordId);
    
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set font and size
    doc.setFont('helvetica');
    doc.setFontSize(16);
    
    if (type === 'original') {
        // Title
        doc.text('LHDN TAX SUBMISSION FORM', 20, 20);
        doc.setFontSize(10);
        
        // Header information
        doc.text(`Submission ID: ${recordDetail.id}`, 20, 35);
        doc.text(`Date: ${recordDetail.date}`, 20, 42);
        doc.text(`Tax Type: ${recordDetail.type}`, 20, 49);
        doc.text(`Year: ${recordDetail.year}`, 20, 56);
        
        // Tax Summary
        doc.setFontSize(12);
        doc.text('TAX SUMMARY:', 20, 75);
        doc.setFontSize(10);
        
        doc.text(`Income Tax: ${window.taxStatusDetailManager.formatCurrency(recordDetail.incomeTax)}`, 20, 85);
        doc.text(`Business Tax: ${window.taxStatusDetailManager.formatCurrency(recordDetail.businessTax)}`, 20, 92);
        doc.text(`SST: ${window.taxStatusDetailManager.formatCurrency(recordDetail.sst)}`, 20, 99);
        doc.text(`Total Tax: ${window.taxStatusDetailManager.formatCurrency(recordDetail.totalTax)}`, 20, 106);
        
        // Status
        doc.setFontSize(12);
        doc.text(`STATUS: ${recordDetail.status.toUpperCase()}`, 20, 120);
        
        // Save the PDF
        doc.save(`LHDN_Original_Form_${recordDetail.id}.pdf`);
        
        alert(`Original document has been downloaded successfully!\n\nFile: LHDN_Original_Form_${recordDetail.id}.pdf`);
        
    } else if (type === 'supporting') {
        // Title
        doc.text('LHDN SUPPORTING DOCUMENTS LIST', 20, 20);
        doc.setFontSize(10);
        
        // Header information
        doc.text(`Submission ID: ${recordDetail.id}`, 20, 35);
        doc.text(`Date: ${recordDetail.date}`, 20, 42);
        
        // Required Documents
        doc.setFontSize(12);
        doc.text('REQUIRED DOCUMENTS:', 20, 55);
        doc.setFontSize(10);
        
        const documents = [
            '1. Business Registration Certificate (SSM)',
            '2. Financial Statements',
            '3. Bank Statements (Last 3 months)',
            '4. Expense Receipts',
            '5. Income Supporting Documents',
            '6. EPF Contribution Statements',
            '7. Insurance Premium Receipts',
            '8. Donation Receipts',
            '9. Rental Income Documents',
            '10. Other Supporting Documents'
        ];
        
        let yPosition = 65;
        documents.forEach(docItem => {
            doc.text(docItem, 20, yPosition);
            yPosition += 5;
        });
        
        // Note
        yPosition += 10;
        doc.setFontSize(8);
        doc.text('Note: All documents must be original or certified true copies.', 20, yPosition);
        
        // Save the PDF
        doc.save(`LHDN_Supporting_Documents_${recordDetail.id}.pdf`);
        
        alert(`Supporting document has been downloaded successfully!\n\nFile: LHDN_Supporting_Documents_${recordDetail.id}.pdf`);
    }
}

function contactSupport() {
    // Create a modal-like dialog with clickable contact information
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2563eb; font-size: 20px;">LHDN Malaysia Contact Details</h2>
            <button onclick="this.closest('.contact-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">HASIL Care Line (LHDN Hotline):</h3>
            <p style="margin: 5px 0;"><a href="tel:1-300-88-3010" style="color: #2563eb; text-decoration: none;">📞 1-300-88-3010</a></p>
            <p style="margin: 5px 0;"><a href="tel:03-7713-6000" style="color: #2563eb; text-decoration: none;">📞 03-7713 6000</a></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Email Support:</h3>
            <p style="margin: 5px 0;"><a href="mailto:hasildata@hasil.gov.my" style="color: #2563eb; text-decoration: none;">📧 hasildata@hasil.gov.my</a></p>
            <p style="margin: 5px 0;"><a href="mailto:e-filing@hasil.gov.my" style="color: #2563eb; text-decoration: none;">📧 e-filing@hasil.gov.my</a></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Office Hours:</h3>
            <p style="margin: 5px 0;">🕐 Monday - Friday: 8:00 AM - 5:00 PM</p>
            <p style="margin: 5px 0;">🕐 Saturday: 8:00 AM - 1:00 PM</p>
            <p style="margin: 5px 0;">🕐 Sunday & Public Holidays: Closed</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">LHDN Headquarters:</h3>
            <p style="margin: 5px 0;">📍 Menara Hasil, Persiaran Rimba Permai,</p>
            <p style="margin: 5px 0;">&nbsp;&nbsp;&nbsp;&nbsp;Cyber 8, 63000 Cyberjaya, Selangor</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Online Support:</h3>
            <p style="margin: 5px 0;"><a href="https://www.hasil.gov.my" target="_blank" style="color: #2563eb; text-decoration: none;">🌐 https://www.hasil.gov.my</a></p>
            <p style="margin: 5px 0;"><a href="https://ez.hasil.gov.my" target="_blank" style="color: #2563eb; text-decoration: none;">🌐 https://ez.hasil.gov.my</a></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">WhatsApp Support:</h3>
            <p style="margin: 5px 0;"><a href="https://wa.me/60198515000" target="_blank" style="color: #2563eb; text-decoration: none;">📱 +60 19-851 5000</a></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">For Tax Status Inquiries:</h3>
            <p style="margin: 5px 0;"><a href="tel:1-300-88-3010" style="color: #2563eb; text-decoration: none;">📞 1-300-88-3010 (Press 1 for Tax Status)</a></p>
            <p style="margin: 5px 0;"><a href="mailto:taxstatus@hasil.gov.my" style="color: #2563eb; text-decoration: none;">📧 taxstatus@hasil.gov.my</a></p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Emergency Contact:</h3>
            <p style="margin: 5px 0;"><a href="tel:03-7713-6000" style="color: #2563eb; text-decoration: none;">📞 03-7713 6000 (After hours)</a></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="this.closest('.contact-modal').remove()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">Close</button>
        </div>
    `;

    modal.className = 'contact-modal';
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function printDetail() {
    window.print();
}

function showDetailHelp() {
    alert('Tax Status Detail Help:\n\n• View detailed information about your submission\n• Check the status timeline to track progress\n• If corrections are needed, review the prompts carefully\n• Download documents or contact support if needed');
} 