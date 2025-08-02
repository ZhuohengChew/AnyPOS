// Tax Status Management
class TaxStatusManager {
    constructor() {
        this.initializeEventListeners();
        this.loadTaxRecords();
    }

    // Initialize Event Listeners
    initializeEventListeners() {
        // Status filter listener
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.filterRecords(e.target.value));
        }
    }

    // Load Tax Records
    loadTaxRecords() {
        const mockRecords = this.getMockTaxRecords();
        
        // Check for updated records from sessionStorage
        const updatedRecords = JSON.parse(sessionStorage.getItem('taxRecords') || '{}');
        
        // Update mock records with any changes from sessionStorage
        const finalRecords = mockRecords.map(record => {
            if (updatedRecords[record.id]) {
                return {
                    ...record,
                    status: updatedRecords[record.id].status
                };
            }
            return record;
        });
        
        this.displayRecords(finalRecords);
        this.updateStatusCounts(finalRecords);
    }

    // Get Mock Tax Records
    getMockTaxRecords() {
        return [
            {
                id: 'TB-2024-001',
                date: '15 March 2024',
                amount: 'RM 23,350.00',
                status: 'pending',
                type: 'Income Tax',
                year: '2024'
            },
            {
                id: 'TB-2024-002',
                date: '10 February 2024',
                amount: 'RM 18,750.00',
                status: 'accepted',
                type: 'Business Tax',
                year: '2024'
            },
            {
                id: 'TB-2024-003',
                date: '5 January 2024',
                amount: 'RM 15,200.00',
                status: 'accepted',
                type: 'SST',
                year: '2024'
            },
            {
                id: 'TB-2023-012',
                date: '20 December 2023',
                amount: 'RM 28,900.00',
                status: 'accepted',
                type: 'Income Tax',
                year: '2023'
            },
            {
                id: 'TB-2023-011',
                date: '15 November 2023',
                amount: 'RM 12,400.00',
                status: 'declined',
                type: 'Business Tax',
                year: '2023'
            },
            {
                id: 'TB-2023-010',
                date: '10 October 2023',
                amount: 'RM 9,800.00',
                status: 'accepted',
                type: 'SST',
                year: '2023'
            },
            {
                id: 'TB-2023-009',
                date: '5 September 2023',
                amount: 'RM 22,150.00',
                status: 'accepted',
                type: 'Income Tax',
                year: '2023'
            },
            {
                id: 'TB-2023-008',
                date: '1 August 2023',
                amount: 'RM 16,300.00',
                status: 'accepted',
                type: 'Business Tax',
                year: '2023'
            },
            {
                id: 'TB-2023-007',
                date: '25 July 2023',
                amount: 'RM 11,200.00',
                status: 'accepted',
                type: 'SST',
                year: '2023'
            },
            {
                id: 'TB-2023-006',
                date: '15 June 2023',
                amount: 'RM 19,450.00',
                status: 'accepted',
                type: 'Income Tax',
                year: '2023'
            },
            {
                id: 'TB-2023-005',
                date: '10 May 2023',
                amount: 'RM 14,800.00',
                status: 'declined',
                type: 'Business Tax',
                year: '2023'
            },
            {
                id: 'TB-2023-004',
                date: '5 April 2023',
                amount: 'RM 8,900.00',
                status: 'accepted',
                type: 'SST',
                year: '2023'
            }
        ];
    }

    // Display Records
    displayRecords(records) {
        const recordsList = document.getElementById('records-list');
        if (!recordsList) return;

        recordsList.innerHTML = '';

        records.forEach(record => {
            const recordElement = this.createRecordElement(record);
            recordsList.appendChild(recordElement);
        });
    }

    // Create Record Element
    createRecordElement(record) {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        recordDiv.onclick = () => this.openRecordDetail(record.id);

        const statusClass = this.getStatusClass(record.status);
        const statusText = this.getStatusText(record.status);

        recordDiv.innerHTML = `
            <div class="record-info">
                <div class="record-id">${record.id}</div>
                <div class="record-date">${record.date} • ${record.type}</div>
                <div class="record-amount">${record.amount}</div>
            </div>
            <div class="record-status">
                <span class="status-indicator ${statusClass}">${statusText}</span>
            </div>
        `;

        return recordDiv;
    }

    // Get Status Class
    getStatusClass(status) {
        switch (status) {
            case 'accepted': return 'accepted';
            case 'pending': return 'pending';
            case 'declined': return 'declined';
            default: return 'pending';
        }
    }

    // Get Status Text
    getStatusText(status) {
        switch (status) {
            case 'accepted': return 'Accepted';
            case 'pending': return 'Pending';
            case 'declined': return 'Need Resubmission';
            default: return 'Pending';
        }
    }

    // Filter Records
    filterRecords(status) {
        const mockRecords = this.getMockTaxRecords();
        
        // Check for updated records from sessionStorage
        const updatedRecords = JSON.parse(sessionStorage.getItem('taxRecords') || '{}');
        
        // Update mock records with any changes from sessionStorage
        const allRecords = mockRecords.map(record => {
            if (updatedRecords[record.id]) {
                return {
                    ...record,
                    status: updatedRecords[record.id].status
                };
            }
            return record;
        });
        
        let filteredRecords = allRecords;

        if (status !== 'all') {
            filteredRecords = allRecords.filter(record => record.status === status);
        }

        this.displayRecords(filteredRecords);
    }

    // Update Status Counts
    updateStatusCounts(records) {
        const total = records.length;
        const accepted = records.filter(r => r.status === 'accepted').length;
        const pending = records.filter(r => r.status === 'pending').length;
        const declined = records.filter(r => r.status === 'declined').length;

        const totalElement = document.getElementById('total-submissions');
        const acceptedElement = document.getElementById('accepted-count');
        const pendingElement = document.getElementById('pending-count');
        const declinedElement = document.getElementById('resubmission-count');

        if (totalElement) totalElement.textContent = total;
        if (acceptedElement) acceptedElement.textContent = accepted;
        if (pendingElement) pendingElement.textContent = pending;
        if (declinedElement) declinedElement.textContent = declined;
    }

    // Open Record Detail
    openRecordDetail(recordId) {
        // Store the record ID in sessionStorage for the detail page
        sessionStorage.setItem('selectedTaxRecord', recordId);
        window.location.href = 'tax-status-detail.html';
    }
}

// Initialize Tax Status Manager
document.addEventListener('DOMContentLoaded', () => {
    window.taxStatusManager = new TaxStatusManager();
});

// Global Functions
function checkTaxStatus() {
    window.location.href = 'tax-status.html';
}

function showStatusHelp() {
    alert('Tax Status Help:\n\n• View all your tax submissions\n• Filter by status (Accepted, Pending, Need Resubmission)\n• Click on any record to see detailed information\n• Track the progress of your submissions');
} 