// Form Handler for Microloans Feature

// PDF Generation and Download Functions
function generatePDF() {
    const applicationData = JSON.parse(sessionStorage.getItem('applicationData'));
    if (!applicationData) {
        console.error('No application data found');
        return;
    }

    // Create PDF using jsPDF
    createAndDownloadPDF(applicationData);
}

// Create and download PDF using jsPDF
function createAndDownloadPDF(applicationData) {
    // Import jsPDF dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        const { jsPDF } = window.jspdf;
        generatePDFDocument(applicationData, jsPDF);
    };
    document.head.appendChild(script);
}

// Generate PDF document
function generatePDFDocument(applicationData, jsPDF) {
    const { referenceNumber, timestamp, loanDetails } = applicationData;
    const date = new Date(timestamp).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
        title: 'Microloan Application Submission',
        subject: `Application Reference: ${referenceNumber}`,
        author: 'MSME Finance Platform',
        creator: 'MSME Finance Platform'
    });

    // Add header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('MSME Finance Platform', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Microloan Application Submission', 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text(`Reference: ${referenceNumber}`, 105, 45, { align: 'center' });
    doc.text(`Submitted on: ${date}`, 105, 52, { align: 'center' });
    
    // Add status badge
    doc.setFillColor(16, 185, 129); // Green
    doc.roundedRect(85, 58, 40, 8, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('SUBMITTED', 105, 64, { align: 'center' });
    
    let yPosition = 80;
    
    // Personal Information Section
    yPosition = addSectionHeader(doc, 'Personal Information', yPosition);
    yPosition = addDetailRow(doc, 'Full Name', loanDetails.fullName || 'John Smith', yPosition);
    yPosition = addDetailRow(doc, 'Account Number', loanDetails.accountNumber || 'ACC-789456123', yPosition);
    yPosition = addDetailRow(doc, 'Email Address', loanDetails.email || 'john.smith@business.com', yPosition);
    yPosition = addDetailRow(doc, 'Phone Number', loanDetails.phone || '+60 12-345 6789', yPosition);
    yPosition = addDetailRow(doc, 'Business Registration', loanDetails.businessReg || 'BR-2024-001234', yPosition);
    
    yPosition += 10;
    
    // Business Information Section
    yPosition = addSectionHeader(doc, 'Business Information', yPosition);
    yPosition = addDetailRow(doc, 'Business Name', loanDetails.businessName || 'Smith Trading Sdn Bhd', yPosition);
    yPosition = addDetailRow(doc, 'Business Type', loanDetails.businessType || 'Retail Trading', yPosition);
    yPosition = addDetailRow(doc, 'Monthly Revenue', `RM ${loanDetails.monthlyRevenue || '8,500'}`, yPosition);
    yPosition = addDetailRow(doc, 'Years in Operation', `${loanDetails.yearsInOperation || '3'} years`, yPosition);
    
    yPosition += 10;
    
    // Loan Details Section
    yPosition = addSectionHeader(doc, 'Loan Details', yPosition);
    
    // Add loan summary box
    doc.setFillColor(248, 250, 252); // Light gray background
    doc.roundedRect(20, yPosition - 5, 170, 40, 3, 3, 'F');
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition - 5, 20, yPosition + 35);
    
    yPosition = addSummaryRow(doc, 'Loan Type', loanDetails.loanType || 'Business Growth Loan', yPosition);
    yPosition = addSummaryRow(doc, 'Requested Amount', `RM ${loanDetails.loanAmount || '5,000'}`, yPosition);
    yPosition = addSummaryRow(doc, 'Loan Purpose', loanDetails.loanPurpose || 'Business Expansion', yPosition);
    yPosition = addSummaryRow(doc, 'Repayment Period', `${loanDetails.repaymentPeriod || '24'} months`, yPosition);
    
    yPosition += 20;
    
    // Next Steps Section
    yPosition = addSectionHeader(doc, 'Next Steps', yPosition);
    yPosition = addStepItem(doc, '1. Application Review ', '                             Your application will be reviewed within 2-3 business days.', yPosition);
    yPosition = addStepItem(doc, '2. Document Verification', '                                  You may be contacted for additional documentation.', yPosition);
    yPosition = addStepItem(doc, '3. Approval Process', 'Final decision will be communicated via email and SMS.', yPosition);
    yPosition = addStepItem(doc, '4. Disbursement', 'Upon approval, funds will be transferred to your registered account.', yPosition);
    
    yPosition += 20;
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text('Contact Information:', 20, yPosition);
    yPosition += 8;
    doc.text('Email: support@msme.my', 20, yPosition);
    yPosition += 6;
    doc.text('Phone: +60 3-1234 5678', 20, yPosition);
    yPosition += 6;
    doc.text('Hours: Monday - Friday, 9:00 AM - 6:00 PM', 20, yPosition);
    
    yPosition += 15;
    doc.text('This document serves as proof of your microloan application submission.', 20, yPosition);
    yPosition += 6;
    doc.text('Please keep this for your records.', 20, yPosition);
    
    // Download the PDF
    const filename = `microloan-application-${referenceNumber}-${new Date().getTime()}.pdf`;
    doc.save(filename);
}

// Helper function to add section header
function addSectionHeader(doc, title, yPosition) {
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // Blue
    doc.setFont(undefined, 'bold');
    doc.text(title, 20, yPosition);
    
    // Add underline
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition + 2, 190, yPosition + 2);
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    return yPosition + 15;
}

// Helper function to add detail row
function addDetailRow(doc, label, value, yPosition) {
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.setFont(undefined, 'bold');
    doc.text(label + ':', 20, yPosition);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    // Handle long values by wrapping text
    const maxWidth = 120;
    const lines = doc.splitTextToSize(value, maxWidth);
    
    if (lines.length === 1) {
        doc.text(value, 80, yPosition);
        return yPosition + 8;
    } else {
        doc.text(lines[0], 80, yPosition);
        for (let i = 1; i < lines.length; i++) {
            doc.text(lines[i], 80, yPosition + (i * 5));
        }
        return yPosition + (lines.length * 5) + 3;
    }
}

// Helper function to add summary row
function addSummaryRow(doc, label, value, yPosition) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(label + ':', 30, yPosition);
    
    doc.setFont(undefined, 'normal');
    doc.text(value, 100, yPosition);
    
    return yPosition + 8;
}

// Helper function to add step item
function addStepItem(doc, step, description, yPosition) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(step + ':', 20, yPosition);
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(102, 102, 102);
    
    // Handle long descriptions by wrapping text
    const maxWidth = 150;
    const lines = doc.splitTextToSize(description, maxWidth);
    
    if (lines.length === 1) {
        doc.text(description, 30, yPosition);
        return yPosition + 8;
    } else {
        doc.text(lines[0], 30, yPosition);
        for (let i = 1; i < lines.length; i++) {
            doc.text(lines[i], 30, yPosition + (i * 5));
        }
        return yPosition + (lines.length * 5) + 3;
    }
}

// Initialize success page
function initializeSuccessPage() {
    const applicationData = JSON.parse(sessionStorage.getItem('applicationData'));
    
    if (!applicationData) {
        // Redirect to application page if no data
        window.location.href = 'microloan-application.html';
        return;
    }
    
    // Display application details
    displayApplicationDetails(applicationData);
}

// Display application details
function displayApplicationDetails(applicationData) {
    const { referenceNumber, timestamp, loanDetails } = applicationData;
    const date = new Date(timestamp).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Update page elements
    const refElement = document.getElementById('referenceNumber');
    if (refElement) {
        refElement.textContent = referenceNumber;
    }
    
    const dateElement = document.getElementById('submissionDate');
    if (dateElement) {
        dateElement.textContent = date;
    }
    
    // Update application details
    updateDetailRow('applicantName', loanDetails.fullName || 'John Smith');
    updateDetailRow('businessName', loanDetails.businessName || 'Smith Trading Sdn Bhd');
    updateDetailRow('loanType', loanDetails.loanType || 'Business Growth Loan');
    updateDetailRow('loanAmount', `RM ${loanDetails.loanAmount || '5,000'}`);
    updateDetailRow('repaymentPeriod', `${loanDetails.repaymentPeriod || '24'} months`);
}

// Update detail row
function updateDetailRow(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize success page
    if (document.getElementById('successContainer')) {
        initializeSuccessPage();
    }
    
    // Add download button event listener
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generatePDF);
    }
    
    // Add back to dashboard button event listener
    const backBtn = document.getElementById('backToDashboard');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Add apply again button event listener
    const applyAgainBtn = document.getElementById('applyAgain');
    if (applyAgainBtn) {
        applyAgainBtn.addEventListener('click', function() {
            window.location.href = 'analytics-graph.html';
        });
    }
}); 