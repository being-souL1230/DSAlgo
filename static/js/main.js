let currentLanguage = 'python';

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSelector();
    setupChatbot();
    setupTopicButtons();
    setActiveLanguage('python');
    animateLearningJourney();
    setupPagination();
});

function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${iconMap[type]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showDialog(title, message, onConfirm = null) {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    
    overlay.innerHTML = `
        <div class="dialog">
            <div class="dialog-header">
                <div class="dialog-title">${title}</div>
                <button class="dialog-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="dialog-body">
                ${message}
            </div>
            <div class="dialog-footer">
                <button class="btn btn-secondary dialog-cancel">Cancel</button>
                ${onConfirm ? '<button class="btn btn-primary dialog-confirm">Confirm</button>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const closeDialog = () => {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    };
    
    overlay.querySelector('.dialog-close').addEventListener('click', closeDialog);
    overlay.querySelector('.dialog-cancel').addEventListener('click', closeDialog);
    
    if (onConfirm) {
        overlay.querySelector('.dialog-confirm').addEventListener('click', () => {
            onConfirm();
            closeDialog();
        });
    }
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });
}

function setupTopicButtons() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    topicButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            const chatInput = document.getElementById('chatInput');
            chatInput.value = `Tell me about ${topic}`;
            chatInput.focus();
            
            const chatSend = document.getElementById('chatSend');
            if (chatSend) {
                chatSend.click();
            }
        });
    });
}

function setupLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setActiveLanguage(lang);
        });
    });
}

function setActiveLanguage(lang) {
    currentLanguage = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.lang === lang) {
            tab.classList.add('active');
        }
    });
    
    document.querySelectorAll('.code-content').forEach(content => {
        content.classList.remove('active');
        if (content.dataset.lang === lang) {
            content.classList.add('active');
        }
    });
}

function setupChatbot() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatToggle) return;

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) {
            showNotification('Empty Message', 'Please type a message before sending!', 'warning');
            return;
        }

        addMessage(message, 'user');
        chatInput.value = '';

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot';
        typingIndicator.innerHTML = '<p><i class="fas fa-spinner fa-pulse"></i> AlgoBuddy is thinking...</p>';
        typingIndicator.id = 'typing-indicator';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/ask-bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: currentLanguage
                })
            });

            const typingElement = document.getElementById('typing-indicator');
            if (typingElement) typingElement.remove();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            addBotMessage(data.response, data.code);
        } catch (error) {
            const typingElement = document.getElementById('typing-indicator');
            if (typingElement) typingElement.remove();
            
            addMessage('Sorry, I encountered an error. Please try again!', 'bot');
            showNotification('Error', 'Failed to get response from AlgoBuddy. Please try again.', 'error');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const p = document.createElement('p');
        p.innerHTML = formatMessage(text);
        messageDiv.appendChild(p);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(text, code) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        const p = document.createElement('p');
        p.innerHTML = formatMessage(text);
        messageDiv.appendChild(p);
        
        if (code) {
            const pre = document.createElement('pre');
            pre.textContent = code;
            messageDiv.appendChild(pre);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatMessage(text) {
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
}

function setupCodeTabs() {
    const codeTabs = document.querySelectorAll('.code-tab');
    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const lang = tab.dataset.lang;
            setActiveLanguage(lang);
        });
    });
}

function animateLearningJourney() {
    const milestones = document.querySelectorAll('.journey-milestone');
    
    milestones.forEach(milestone => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    milestone.style.opacity = "1";
                    milestone.style.transform = "translateX(0)";
                    observer.unobserve(milestone);
                }
            });
        }, { threshold: 0.2 });
        
        // Set initial state
        milestone.style.opacity = "0";
        milestone.style.transform = "translateX(-20px)";
        milestone.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        
        observer.observe(milestone);
    });
}

function setupPagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const pages = document.querySelectorAll('.page');
    
    if (pageButtons.length === 0 || pages.length === 0) return;
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageNum = btn.dataset.page;
            
            pageButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            pages.forEach(page => {
                if (page.dataset.page === pageNum) {
                    page.style.display = 'block';
                } else {
                    page.style.display = 'none';
                }
            });
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    if (pages.length > 0) {
        pages.forEach((page, index) => {
            page.style.display = index === 0 ? 'block' : 'none';
        });
    }
}

// Initialize after full load
window.addEventListener('load', () => {
    console.log('[Debug] Window fully loaded');
    if (document.querySelector('.code-tab')) {
        setupCodeTabs();
    }
});
