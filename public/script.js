const socket = io();
const username = localStorage.getItem('username');

if (!username) {
  window.location.href = 'index.html';
}

const messagesContainer = document.querySelector('.messages-container');
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');

// Enforce 200-character limit
messageInput.addEventListener('input', () => {
  if (messageInput.value.length > 200) {
    messageInput.value = messageInput.value.slice(0, 200); // Trim to 200 characters
  }
});

// Handle message submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    // Add the message as "You" on the sender's screen
    addMessage('You', message);

    // Emit the message to the server with the username
    socket.emit('chat message', { username, message });

    // Clear the input field
    messageInput.value = '';
  }
});

// Function to add a message to the chat
function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  const senderSpan = document.createElement('span');
  senderSpan.classList.add('sender');

  // Change the color of "You" to red
  if (sender === 'You') {
    senderSpan.style.color = 'red';
  }

  senderSpan.textContent = `${sender}:`;

  const messageTextSpan = document.createElement('span');
  messageTextSpan.classList.add('message-text');
  messageTextSpan.textContent = text;

  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(messageTextSpan);
  messagesContainer.appendChild(messageDiv);

  // Scroll to the bottom of the chat
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Listen for incoming messages
socket.on('chat message', function(data) {
  // Only add the message if it's not from the current user
  if (data.username !== username) {
    addMessage(data.username, data.message);
  }
});