const socket = io();
const username = localStorage.getItem('username');

// Load banned words from badwords.json
let bannedWords = [];
fetch('badwords.json')
  .then((response) => response.json())
  .then((data) => {
    bannedWords = data;

    // Redirect if username contains banned words
    if (containsBannedWords(username)) {
      alert('Your username contains inappropriate words. Please choose a different one.');
      localStorage.removeItem('username');
      window.location.href = 'index.html';
    }
  })
  .catch((err) => {
    console.error('Failed to load badwords.json:', err);
  });

// Function to escape special characters in regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}

// Function to check for banned words
function containsBannedWords(text) {
  return bannedWords.some((entry) => {
    const regex = new RegExp(entry.match, 'i'); // Case-insensitive regex
    if (regex.test(text)) {
      // Check for exceptions
      if (
        entry.exceptions &&
        entry.exceptions.some((exception) => {
          const exceptionRegex = new RegExp(`\\b${escapeRegex(exception)}\\b`, 'i'); // Match exceptions as whole words
          return exceptionRegex.test(text);
        })
      ) {
        return false; // Skip if the text matches an exception
      }
      return true; // Flag as inappropriate
    }
    return false;
  });
}

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
socket.on('chat message', function (data) {
  // Only add the message if it's not from the current user
  if (data.username !== username) {
    addMessage(data.username, data.message);
  }
});

// Listen for message history from the server
socket.on('message history', (history) => {
  history.forEach((message) => {
    addMessage(message.username, message.message);
  });
});

// Listen for error messages from the server
socket.on('error message', (errorMessage) => {
  alert(errorMessage);
});

async function validateUsername(username) {
  try {
    const response = await fetch('/validate-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const result = await response.json();
    return result.isValid;
  } catch (error) {
    console.error('Error validating username:', error);
    return false;
  }
}

// Example usage
document.getElementById('usernameForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value;

  const isValid = await validateUsername(username);
  if (isValid) {
    alert('Username is valid!');
    // Save the username and redirect to the chat page
    localStorage.setItem('username', username);
    window.location.href = 'chat.html';
  } else {
    alert('Username is invalid!');
  }
});