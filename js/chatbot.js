// Chatbot Configuration
const CHATBOT_CONFIG = {
    greetings: {
        en: "👋 Hi! I'm your MSME Assistant. How can I help you today?",
        my: "👋 Hai! Saya Pembantu MSME anda. Bagaimana saya boleh membantu anda hari ini?",
        zh: "👋 你好！我是您的MSME助手。今天我能为您做些什么？",
        ta: "👋 வணக்கம்! நான் உங்கள் MSME உதவியாளர். இன்று நான் எப்படி உதவ முடியும்?"
    },
    categories: {
        account: {
            title: "Account & Banking",
            questions: [
                "How do I add a new bank account?",
                "Why is my account balance not updating?",
                "How to link multiple bank accounts?",
                "What banks are supported?"
            ]
        },
        payments: {
            title: "Payments & Transfers",
            questions: [
                "How do I make a payment?",
                "How to add a new recipient?",
                "Payment failed, what should I do?",
                "How to check payment history?"
            ]
        },
        invoices: {
            title: "Invoices",
            questions: [
                "How to create an invoice?",
                "How to send invoices to customers?",
                "Invoice template customization",
                "SST calculation in invoices"
            ]
        },
        tax: {
            title: "Tax & LHDN",
            questions: [
                "How to file income tax?",
                "What are tax reliefs available?",
                "Donation tax deductions",
                "Business expense deductions"
            ]
        },
        esg: {
            title: "ESG & Donations",
            questions: [
                "How does donation round-up work?",
                "Which charities are approved?",
                "Carbon footprint tracking",
                "Sustainability features"
            ]
        },
        support: {
            title: "Technical Support",
            questions: [
                "App is not working properly",
                "How to reset password?",
                "Data synchronization issues",
                "Contact customer support"
            ]
        }
    }
};

// Keyword matching for intent detection
const KEYWORDS = {
    banking: ["bank", "account", "balance", "maybank", "cimb"],
    payments: ["pay", "payment", "transfer", "recipient", "failed"],
    invoices: ["invoice", "bill", "customer", "sst", "tax"],
    tax: ["lhdn", "income tax", "relief", "deduction", "filing"],
    esg: ["donation", "charity", "carbon", "sustainability", "esg"],
    technical: ["error", "bug", "not working", "reset", "support"],
    greetings: ["hello", "hi", "help", "start"]
};

// Add answers for predefined questions
const QUESTION_ANSWERS = {
    // Account & Banking
    "How do I add a new bank account?": {
        text: "To add a new bank account:\n1. Go to Settings\n2. Select 'Bank Accounts'\n3. Click '+ Add New Account'\n4. Choose your bank from the list\n5. Follow the secure verification process\n\nSupported banks include Maybank, CIMB, Public Bank, and more.",
        quickReplies: [
            { text: "What banks are supported?", action: "show_supported_banks" },
            { text: "Help with verification", action: "show_verification_help" }
        ]
    },
    "Why is my account balance not updating?": {
        text: "Account balance delays can occur for several reasons:\n1. Bank sync delay (usually 10-15 minutes)\n2. Internet connectivity issues\n3. Bank system maintenance\n\nTry refreshing the page or checking your internet connection. If the issue persists, you can manually sync by clicking the refresh icon next to your account.",
        quickReplies: [
            { text: "How to manual sync", action: "show_sync_help" },
            { text: "Contact Support", action: "show_support" }
        ]
    },
    "How to link multiple bank accounts?": {
        text: "You can link up to 5 bank accounts:\n1. Go to 'Add New Account'\n2. Select different banks\n3. Complete verification for each\n\nAll accounts will be visible on your dashboard with real-time updates.",
        quickReplies: [
            { text: "Account limits", action: "show_account_limits" },
            { text: "Bank linking help", action: "show_linking_help" }
        ]
    },
    "What banks are supported?": {
        text: "We support all major Malaysian banks including:\n• Maybank\n• CIMB Bank\n• Public Bank\n• RHB Bank\n• Hong Leong Bank\n• Bank Islam\n• AmBank\n\nMore banks are being added regularly.",
        quickReplies: [
            { text: "Add new account", action: "show_add_account" },
            { text: "View all banks", action: "show_all_banks" }
        ]
    },

    // Payments & Transfers
    "How do I make a payment?": {
        text: "To make a payment:\n1. Click 'Pay' on the dashboard\n2. Choose recipient (or add new)\n3. Enter amount and details\n4. Select payment method\n5. Verify and confirm\n\nPayments are usually instant for supported banks.",
        quickReplies: [
            { text: "Add new recipient", action: "show_add_recipient" },
            { text: "Payment methods", action: "show_payment_methods" }
        ]
    },
    "How to add a new recipient?": {
        text: "To add a new recipient:\n1. Go to 'Recipients' or during payment\n2. Click '+ Add New'\n3. Enter their details:\n   - Name\n   - Bank account number\n   - Bank name\n4. Save for future use",
        quickReplies: [
            { text: "Make a payment", action: "show_payment" },
            { text: "Manage recipients", action: "show_recipients" }
        ]
    },
    "Payment failed, what should I do?": {
        text: "If your payment failed:\n1. Check your balance\n2. Verify recipient details\n3. Check for bank system issues\n\nYou can retry the payment or use an alternative payment method. Failed payments are not deducted from your account.",
        quickReplies: [
            { text: "Contact support", action: "show_support" },
            { text: "View payment status", action: "show_payment_status" }
        ]
    },
    "How to check payment history?": {
        text: "Access your payment history:\n1. Click 'Transactions' on dashboard\n2. Filter by 'Payments'\n3. View detailed history\n\nYou can download statements or filter by date, recipient, or amount.",
        quickReplies: [
            { text: "Download statement", action: "show_download_statement" },
            { text: "Filter transactions", action: "show_filters" }
        ]
    },

    // Invoices
    "How to create an invoice?": {
        text: "Create an invoice in 4 steps:\n1. Click 'Create Invoice'\n2. Add customer details\n3. Add items and prices\n4. Set payment terms\n\nSST is automatically calculated if applicable.",
        quickReplies: [
            { text: "Invoice templates", action: "show_templates" },
            { text: "SST settings", action: "show_sst_settings" }
        ]
    },
    "How to send invoices to customers?": {
        text: "Send invoices directly through:\n1. Email (automated)\n2. WhatsApp link\n3. Download PDF\n\nCustomers can pay instantly via secure payment link.",
        quickReplies: [
            { text: "Payment methods", action: "show_invoice_payments" },
            { text: "Track invoices", action: "show_invoice_tracking" }
        ]
    },
    "Invoice template customization": {
        text: "Customize your invoices:\n1. Add company logo\n2. Choose color scheme\n3. Edit layout and fields\n4. Add terms & conditions\n\nSave templates for future use.",
        quickReplies: [
            { text: "Upload logo", action: "show_logo_upload" },
            { text: "Manage templates", action: "show_template_manager" }
        ]
    },
    "SST calculation in invoices": {
        text: "SST (6%) is automatically:\n1. Calculated on eligible items\n2. Added to invoice total\n3. Tracked for tax reporting\n\nYou can enable/disable SST per invoice.",
        quickReplies: [
            { text: "SST settings", action: "show_sst_settings" },
            { text: "Tax reporting", action: "show_tax_reports" }
        ]
    },

    // Tax & LHDN
    "How to file income tax?": {
        text: "Our system helps with tax filing:\n1. Automatically tracks income\n2. Calculates deductions\n3. Generates tax reports\n4. Links to LHDN portal\n\nTax reports are available under 'Tax' section.",
        quickReplies: [
            { text: "Generate tax report", action: "show_tax_report" },
            { text: "LHDN integration", action: "show_lhdn_help" }
        ]
    },
    "What are tax reliefs available?": {
        text: "Common business tax reliefs:\n1. Equipment purchases\n2. Operating expenses\n3. Employee salaries\n4. Business insurance\n\nTrack all in 'Tax Relief' section.",
        quickReplies: [
            { text: "Add tax relief", action: "show_add_relief" },
            { text: "Relief calculator", action: "show_calculator" }
        ]
    },
    "Donation tax deductions": {
        text: "Track donation deductions:\n1. Approved charities list\n2. Automatic receipt storage\n3. Deduction calculator\n4. Annual summary\n\nAll donations through our platform are tax-deductible.",
        quickReplies: [
            { text: "Make donation", action: "show_donate" },
            { text: "View deductions", action: "show_deductions" }
        ]
    },
    "Business expense deductions": {
        text: "Deductible business expenses:\n1. Inventory purchases\n2. Utilities & rent\n3. Marketing costs\n4. Professional fees\n\nTrack all expenses in our app.",
        quickReplies: [
            { text: "Add expense", action: "show_add_expense" },
            { text: "Expense report", action: "show_expense_report" }
        ]
    }
};

class MSMEChatbot {
    constructor() {
        this.init();
        this.bindEvents();
        this.currentLanguage = 'en';
        
        // Show chatbot after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('msme-chatbot').classList.add('show');
            }, 2000); // 1 second delay after page load
        });
    }

    init() {
        this.chatToggle = document.getElementById('chatbot-toggle');
        this.chatWindow = document.getElementById('chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.quickActions = document.getElementById('quick-actions');
        
        // Initialize session storage for chat history
        if (!sessionStorage.getItem('chatHistory')) {
            sessionStorage.setItem('chatHistory', JSON.stringify([]));
        }
    }

    bindEvents() {
        // Toggle chat window
        this.chatToggle.addEventListener('click', () => this.toggleChat());

        // Close and minimize buttons
        document.querySelector('.close-btn').addEventListener('click', () => this.closeChat());
        document.querySelector('.minimize-btn').addEventListener('click', () => this.minimizeChat());

        // Send message on enter or button click
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        document.querySelector('.chat-send-btn').addEventListener('click', () => this.sendMessage());

        // Quick action buttons
        this.quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                this.handleQuickAction(e.target.dataset.category);
            }
        });
    }

    toggleChat() {
        this.chatWindow.classList.toggle('active');
        if (this.chatWindow.classList.contains('active') && this.chatMessages.children.length === 0) {
            this.showGreeting();
        }
        // Hide notification badge when chat is opened
        document.getElementById('chat-notification-badge').style.display = 'none';
    }

    closeChat() {
        this.chatWindow.classList.remove('active');
    }

    minimizeChat() {
        this.chatWindow.classList.remove('active');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and get response
        const response = await this.processMessage(message);

        // Hide typing indicator and show response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(response.text, 'bot');
            
            // Add quick replies if available
            if (response.quickReplies) {
                this.addQuickReplies(response.quickReplies);
            }
        }, 1000);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(text)}
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Save to session storage
        const history = JSON.parse(sessionStorage.getItem('chatHistory'));
        history.push({ text, sender, timestamp: new Date().toISOString() });
        sessionStorage.setItem('chatHistory', JSON.stringify(history));
    }

    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        // Convert markdown-style links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        return text;
    }

    addQuickReplies(replies) {
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies';
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply.text;
            button.addEventListener('click', () => {
                if (reply.action) {
                    this.handleQuickReplyAction(reply.action);
                } else {
                    this.chatInput.value = reply.text;
                    this.sendMessage();
                }
            });
            quickRepliesDiv.appendChild(button);
        });
        this.chatMessages.appendChild(quickRepliesDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('active');
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }

    showGreeting() {
        const greeting = CHATBOT_CONFIG.greetings[this.currentLanguage];
        this.addMessage(greeting, 'bot');
    }

    async processMessage(message) {
        // Detect intent based on keywords
        const intent = this.detectIntent(message.toLowerCase());
        
        // Get response based on intent
        return this.getResponse(intent, message);
    }

    detectIntent(message) {
        for (const [intent, keywords] of Object.entries(KEYWORDS)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }
        return 'unknown';
    }

    getResponse(intent, message) {
        // Check for exact question matches first
        if (QUESTION_ANSWERS[message]) {
            return QUESTION_ANSWERS[message];
        }

        // Basic response templates - in production, this would be more sophisticated
        const responses = {
            banking: {
                text: "I can help you with banking! Here are some common questions:",
                quickReplies: CHATBOT_CONFIG.categories.account.questions.map(q => ({ text: q }))
            },
            payments: {
                text: "Let me help you with payments. What would you like to know?",
                quickReplies: CHATBOT_CONFIG.categories.payments.questions.map(q => ({ text: q }))
            },
            invoices: {
                text: "I can help you with invoices. Here are some common topics:",
                quickReplies: CHATBOT_CONFIG.categories.invoices.questions.map(q => ({ text: q }))
            },
            tax: {
                text: "Let me help you with tax matters. What would you like to know?",
                quickReplies: CHATBOT_CONFIG.categories.tax.questions.map(q => ({ text: q }))
            },
            esg: {
                text: "Here's how I can help you with ESG and donations:",
                quickReplies: CHATBOT_CONFIG.categories.esg.questions.map(q => ({ text: q }))
            },
            technical: {
                text: "I can help you with technical issues. What's the problem?",
                quickReplies: CHATBOT_CONFIG.categories.support.questions.map(q => ({ text: q }))
            },
            greetings: {
                text: "Hello! How can I help you today?",
                quickReplies: [
                    { text: "Banking Help", action: "show_banking" },
                    { text: "Make a Payment", action: "show_payments" },
                    { text: "Create Invoice", action: "show_invoices" }
                ]
            },
            unknown: {
                text: "I'm not sure I understand. Could you please select one of these topics?",
                quickReplies: Object.values(CHATBOT_CONFIG.categories).map(cat => ({
                    text: cat.title,
                    action: `show_${cat.title.toLowerCase().replace(/[^a-z]/g, '_')}`
                }))
            }
        };

        return responses[intent] || responses.unknown;
    }

    handleQuickAction(category) {
        const categoryConfig = CHATBOT_CONFIG.categories[category];
        if (categoryConfig) {
            this.addMessage(`Show me ${categoryConfig.title} help`, 'user');
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(`Here are common questions about ${categoryConfig.title}:`, 'bot');
                this.addQuickReplies(categoryConfig.questions.map(q => ({ text: q })));
            }, 500);
        }
    }

    handleQuickReplyAction(action) {
        // Handle navigation and other actions
        switch (action) {
            case 'show_banking':
                this.handleQuickAction('account');
                break;
            case 'show_payments':
                this.handleQuickAction('payments');
                break;
            case 'show_invoices':
                this.handleQuickAction('invoices');
                break;
            // Add more action handlers as needed
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.msmeChatbot = new MSMEChatbot();
}); 