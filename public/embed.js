/**
 * JetAI Embeddable Assistant Widget
 * Version: 1.0.0
 * This script creates a lightweight version of the JetAI travel assistant
 * that can be embedded on any website.
 * 
 * Usage:
 * <script src="https://jetai.app/embed.js?ref=AFFILIATE_CODE"></script>
 * <div id="jetai-assistant"></div>
 */

(function() {
  // Extract affiliate/partner ID from script URL
  const scriptTags = document.getElementsByTagName('script');
  const currentScript = scriptTags[scriptTags.length - 1];
  const scriptSrc = currentScript.src;
  const urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
  const affiliateId = urlParams.get('ref') || '';
  
  // Default configuration
  const DEFAULT_CONFIG = {
    primaryColor: '#3182CE', // Default blue color
    autoOpen: false,
    position: 'right', // 'right' or 'left'
    greeting: 'Hi there! I\'m your AI travel assistant. How can I help with your travel plans?',
    iconUrl: 'https://jetai.app/assets/chat-icon.svg',
    placeHolder: 'Ask me about travel destinations...',
    brandText: 'Powered by JetAI',
    logoUrl: 'https://jetai.app/assets/logo.svg'
  };
  
  // Merge default config with user-provided config
  const config = {
    ...DEFAULT_CONFIG,
    ...(window.jetAIConfig || {}),
    affiliateId
  };
  
  // Create Widget Styles
  const createStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .jetai-widget-container {
        position: fixed;
        bottom: 20px;
        ${config.position === 'right' ? 'right: 20px' : 'left: 20px'};
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      
      .jetai-chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${config.primaryColor};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      }
      
      .jetai-chat-button:hover {
        transform: scale(1.05);
      }
      
      .jetai-chat-icon {
        width: 24px;
        height: 24px;
        fill: white;
      }
      
      .jetai-chat-window {
        position: absolute;
        bottom: 70px;
        ${config.position === 'right' ? 'right: 0' : 'left: 0'};
        width: 360px;
        height: 520px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }
      
      .jetai-chat-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }
      
      .jetai-chat-header {
        background-color: ${config.primaryColor};
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .jetai-chat-title {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
      
      .jetai-chat-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
      }
      
      .jetai-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }
      
      .jetai-message {
        margin-bottom: 12px;
        max-width: 80%;
        padding: 12px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .jetai-message-bot {
        background-color: #F1F5F9;
        border-top-left-radius: 4px;
        margin-right: auto;
      }
      
      .jetai-message-user {
        background-color: ${config.primaryColor};
        color: white;
        border-top-right-radius: 4px;
        margin-left: auto;
      }
      
      .jetai-chat-input-container {
        padding: 12px 16px;
        border-top: 1px solid #E2E8F0;
        display: flex;
      }
      
      .jetai-chat-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #CBD5E0;
        border-radius: 20px;
        font-size: 14px;
        outline: none;
      }
      
      .jetai-chat-input:focus {
        border-color: ${config.primaryColor};
      }
      
      .jetai-chat-send {
        background-color: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        margin-left: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .jetai-branding {
        font-size: 12px;
        color: #A0AEC0;
        text-align: center;
        padding: 8px;
        border-top: 1px solid #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .jetai-branding img {
        height: 16px;
        margin-right: 6px;
      }
      
      .jetai-typing-indicator {
        display: flex;
        padding: 12px 16px;
      }
      
      .jetai-typing-dot {
        width: 8px;
        height: 8px;
        margin: 0 2px;
        background-color: #CBD5E0;
        border-radius: 50%;
        animation: jetai-typing-animation 1.4s infinite both;
      }
      
      .jetai-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .jetai-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes jetai-typing-animation {
        0%, 100% {
          opacity: 0.3;
          transform: translateY(0);
        }
        50% {
          opacity: 1;
          transform: translateY(-5px);
        }
      }
    `;
    document.head.appendChild(style);
  };
  
  // Create widget DOM elements
  const createWidget = () => {
    // Find target element or create one
    let targetEl = document.getElementById('jetai-assistant');
    if (!targetEl) {
      targetEl = document.createElement('div');
      targetEl.id = 'jetai-assistant';
      document.body.appendChild(targetEl);
    }
    
    // Create widget container
    const container = document.createElement('div');
    container.className = 'jetai-widget-container';
    
    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.className = 'jetai-chat-button';
    chatButton.innerHTML = `<img src="${config.iconUrl}" alt="Chat" class="jetai-chat-icon">`;
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'jetai-chat-window';
    
    chatWindow.innerHTML = `
      <div class="jetai-chat-header">
        <h3 class="jetai-chat-title">AI Travel Assistant</h3>
        <button class="jetai-chat-close">×</button>
      </div>
      <div class="jetai-chat-messages"></div>
      <div class="jetai-chat-input-container">
        <input type="text" class="jetai-chat-input" placeholder="${config.placeHolder}">
        <button class="jetai-chat-send">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div class="jetai-branding">
        <img src="${config.logoUrl}" alt="JetAI Logo">
        <span>${config.brandText}</span>
      </div>
    `;
    
    // Append elements to container and target
    container.appendChild(chatWindow);
    container.appendChild(chatButton);
    targetEl.appendChild(container);
    
    return {
      container,
      chatButton,
      chatWindow,
      messagesContainer: chatWindow.querySelector('.jetai-chat-messages'),
      inputField: chatWindow.querySelector('.jetai-chat-input'),
      sendButton: chatWindow.querySelector('.jetai-chat-send'),
      closeButton: chatWindow.querySelector('.jetai-chat-close')
    };
  };
  
  // Handle widget functionality
  const initWidget = (elements) => {
    const { 
      chatButton, 
      chatWindow, 
      messagesContainer, 
      inputField, 
      sendButton, 
      closeButton 
    } = elements;
    
    let isOpen = false;
    
    // Toggle chat window
    const toggleChat = () => {
      isOpen = !isOpen;
      if (isOpen) {
        chatWindow.classList.add('open');
        // If it's the first open, send greeting
        if (messagesContainer.children.length === 0) {
          addMessage(config.greeting, 'bot');
        }
        inputField.focus();
      } else {
        chatWindow.classList.remove('open');
      }
    };
    
    // Add message to chat
    const addMessage = (text, sender) => {
      const messageEl = document.createElement('div');
      messageEl.className = `jetai-message jetai-message-${sender}`;
      messageEl.textContent = text;
      messagesContainer.appendChild(messageEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    // Show typing indicator
    const showTypingIndicator = () => {
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'jetai-typing-indicator';
      typingIndicator.innerHTML = `
        <div class="jetai-typing-dot"></div>
        <div class="jetai-typing-dot"></div>
        <div class="jetai-typing-dot"></div>
      `;
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return typingIndicator;
    };
    
    // Process user message
    const processMessage = async (message) => {
      // Add user message to chat
      addMessage(message, 'user');
      
      // Show typing indicator
      const typingIndicator = showTypingIndicator();
      
      // In a real implementation, this would call the JetAI API
      try {
        // Create POST data with affiliate tracking
        const apiData = {
          message,
          affiliateId: config.affiliateId,
          referrer: window.location.href,
          embedSource: true
        };
        
        // This would be the real API call
        // const response = await fetch('https://api.jetai.app/chat', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(apiData),
        // });
        // const data = await response.json();
        
        // For demo, simulate API response
        await new Promise(resolve => setTimeout(resolve, 1500));
        const responseTxt = getSimulatedResponse(message);
        
        // Remove typing indicator
        messagesContainer.removeChild(typingIndicator);
        
        // Add response to chat
        addMessage(responseTxt, 'bot');
      } catch (error) {
        console.error('Error processing message:', error);
        messagesContainer.removeChild(typingIndicator);
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    };
    
    // Send message on button click or Enter key
    const sendMessage = () => {
      const message = inputField.value.trim();
      if (message) {
        processMessage(message);
        inputField.value = '';
      }
    };
    
    // Attach event listeners
    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Auto-open chat if configured
    if (config.autoOpen) {
      setTimeout(toggleChat, 1000);
    }
  };
  
  // Simulate bot responses for demo purposes
  const getSimulatedResponse = (message) => {
    message = message.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! How can I help with your travel plans today?';
    }
    
    if (message.includes('paris') || message.includes('france')) {
      return 'Paris is a beautiful destination! The best time to visit is from April to June or October to early November when the weather is mild and crowds are smaller. Would you like some hotel recommendations?';
    }
    
    if (message.includes('hotel') || message.includes('accommodation')) {
      return 'I can help you find the perfect place to stay! Could you tell me your budget range (economy, mid-range, or luxury) and what area you prefer?';
    }
    
    if (message.includes('flight') || message.includes('airline')) {
      return 'For the best flight deals, I recommend booking 2-3 months in advance. Would you like me to search for flights for specific dates?';
    }
    
    if (message.includes('beach') || message.includes('island')) {
      return 'Looking for a beach getaway? Bali, the Maldives, and Santorini are excellent choices right now. What type of beach experience are you looking for - relaxation, activities, or nightlife?';
    }
    
    if (message.includes('cost') || message.includes('price') || message.includes('budget')) {
      return 'Your budget is an important consideration. Most travelers spend around $150-200 per day for mid-range accommodations and meals. Luxury options start at $300+ per day. What's your target budget range?';
    }
    
    // Default response for other messages
    return 'I can help you plan your perfect trip. Tell me what type of destination you're interested in or ask about specific locations, activities, or travel tips!';
  };
  
  // Initialize the widget
  const init = () => {
    createStyles();
    const elements = createWidget();
    initWidget(elements);
    
    // Make API available globally
    window.jetAIWidget = {
      open: () => {
        elements.chatWindow.classList.add('open');
      },
      close: () => {
        elements.chatWindow.classList.remove('open');
      },
      updateConfig: (newConfig) => {
        Object.assign(config, newConfig);
        // This is simplified - in a real implementation,
        // we would need to update DOM elements to reflect the new config
      }
    };
  };
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();