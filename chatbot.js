const chatResponses = {
    "default": "I'm not sure I understand. I can help with Login, Sign Up, or search for recipes.",
    "hello": "Hello! Welcome to PixelFoodie. How can I assist you today?",
    "hi": "Hi there! Need help logging in or finding a recipe?",
    "login": "To log in, enter your email and password. If you don't have an account, click 'Sign Up'.",
    "password": "If you forgot your password, click the 'Forgot Password?' link.",
    "forgot": "Don't worry! Click 'Forgot Password?' to reset it.",
    "signup": "Click 'Sign Up' at the bottom of the card to create a new account.",
    "register": "You can register by clicking 'Sign Up' below the login button.",
    "what is pixelfoodie": "PixelFoodie is your premium destination for professional recipes and culinary inspiration.",
    "recipes": "We have a huge collection of recipes! You can ask me 'Do you have butter chicken?' or 'Show me vegan recipes'.",
    "guest": "You can try the 'Guest User' option in the Google Sign-In menu to look around!",
    "help": "I can help with: Login, Sign Up, and Recipe recommendations."
};

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');

    // Focus input if opening
    if (chatWindow.classList.contains('active')) {
        document.getElementById('chatInput').focus();
    }
}

function handleUserMessage(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message === "") return;

    // Add User Message
    addMessageToChat('user', message);
    input.value = '';

    // Simulate thinking delay
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = generateAIResponse(message);
        addMessageToChat('bot', response);
    }, 1000 + Math.random() * 500);
}

function generateAIResponse(message) {
    const lowerMsg = message.toLowerCase();

    // 1. Check for specific keywords in predefined responses
    for (const key in chatResponses) {
        if (lowerMsg.includes(key) && key !== 'default') {
            return chatResponses[key];
        }
    }

    // 2. Search Recipes (Smart Feature)
    if (typeof recipes !== 'undefined' && Array.isArray(recipes)) {
        // Search by title or category
        const foundRecipes = recipes.filter(r =>
            lowerMsg.includes(r.title.toLowerCase()) ||
            (r.categories && r.categories.some(c => lowerMsg.includes(c.toLowerCase()))) ||
            lowerMsg.includes("recommend") || lowerMsg.includes("suggest")
        );

        if (foundRecipes.length > 0) {
            // Pick random 3 if too many
            const distinctRecipes = foundRecipes.slice(0, 3);
            let response = "I found some recipes you might like:<br>";
            distinctRecipes.forEach(r => {
                response += `• <b>${r.title}</b> (${r.time})<br>`;
            });
            if (foundRecipes.length > 3) {
                response += `...and ${foundRecipes.length - 3} more! Log in to see them all.`;
            }
            return response;
        }
    }

    return chatResponses['default'];
}

function addMessageToChat(sender, text) {
    const messagesContainer = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender === 'user' ? 'user-msg' : 'bot-msg');

    // Allow simple HTML in bot responses
    msgDiv.innerHTML = text;

    messagesContainer.appendChild(msgDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.classList.add('chat-message', 'bot-msg', 'typing');
    typingDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}
