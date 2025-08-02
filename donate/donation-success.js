// Donation Success Page Controller
class DonationSuccessManager {
    constructor() {
        this.init();
    }

    init() {
        // Load donation data
        const donationData = JSON.parse(localStorage.getItem('donation_success_data') || '{}');
        
        // Update display
        if (donationData.amount) {
            document.getElementById('confirm-amount').textContent = donationData.amount.toFixed(2);
        }
        if (donationData.ngo) {
            document.getElementById('confirm-ngo').textContent = donationData.ngo;
        }
        if (donationData.date) {
            document.getElementById('confirm-date').textContent = donationData.date;
        }

        // Setup heart interaction
        this.setupHeartInteraction();

        // Clear stored data
        localStorage.removeItem('donation_success_data');
    }

    setupHeartInteraction() {
        const heartIcon = document.querySelector('.success-icon');
        if (heartIcon) {
            heartIcon.addEventListener('click', () => {
                // Add extra beat animation
                heartIcon.style.animation = 'none';
                heartIcon.offsetHeight; // Trigger reflow
                heartIcon.style.animation = 'heartBeat 0.6s ease-in-out';
                
                // Change heart color randomly
                const hearts = ['❤️', '💖', '💝', '💗', '💓', '💕'];
                heartIcon.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            });
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.successManager = new DonationSuccessManager();
});

// Global functions
function goToDashboard() {
    window.location.href = 'index.html';
} 