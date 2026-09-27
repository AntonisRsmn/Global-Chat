const socket = io();
const username = localStorage.getItem('username');

let bannedWords = [];
let allowedUsernames = [];

// Load both badwords.json and exceptions.json
Promise.all([
  fetch('badwords.json').then((res) => res.json()),
  fetch('exceptions.json').then((res) => res.json())
])
  .then(([badwordsData, exceptionsData]) => {
    bannedWords = badwordsData;
    allowedUsernames = exceptionsData.allowedUsernames.map(name => name.toLowerCase());

    // Check username
    if (!isUsernameClean(username)) {
      alert('Your username contains inappropriate words. Please choose a different one.');
      localStorage.removeItem('username');
      window.location.href = 'index.html';
    }
  })
  .catch((err) => {
    console.error('Failed to load filter lists:', err);
  });

// If no username stored, redirect
if (!username) {
  window.location.href = 'index.html';
}

// Escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Username cleaner
function isUsernameClean(name) {
  const lowerName = name.toLowerCase();

  // Allow if in global exceptions
  if (allowedUsernames.includes(lowerName)) {
    return true;
  }

  return !bannedWords.some(entry => {
    const regex = new RegExp(entry.match, 'i');
    if (regex.test(lowerName)) {
      // Check per-entry exceptions
      if (
        entry.exceptions &&
        entry.exceptions.some(exception => {
          const pattern = exception.replace(/\*/g, '.*');
          const exceptionRegex = new RegExp(`^.*${pattern}.*$`, 'i');
          return exceptionRegex.test(lowerName);
        })
      ) {
        return false; // Exception matched — allow
      }
      return true; // Bad word matched with no valid exception
    }
    return false;
  });
}

// DOM setup
const messagesContainer = document.querySelector('.messages-container');
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');
const currentUser = document.querySelector('.current-user');
const userAvatar = document.querySelector('.user-avatar');

if (currentUser && username) {
  currentUser.textContent = username;
}
if (userAvatar && username) {
  userAvatar.textContent = username.charAt(0).toUpperCase();
}

// Limit to 200 characters
messageInput.addEventListener('input', () => {
  if (messageInput.value.length > 200) {
    messageInput.value = messageInput.value.slice(0, 200);
  }
});

// Handle sending
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    addMessage('You', message);
    socket.emit('chat message', { username, message });
    messageInput.value = '';
  }
});

// Display message
function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender === 'You' ? 'message-own' : 'message-other');

  const avatar = document.createElement('span');
  avatar.classList.add('message-avatar');
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = sender === 'You' ? (username || 'Y').charAt(0).toUpperCase() : sender.charAt(0).toUpperCase();

  const senderSpan = document.createElement('span');
  senderSpan.classList.add('sender');
  senderSpan.textContent = sender === 'You' ? 'You' : sender;

  const messageTextSpan = document.createElement('span');
  messageTextSpan.classList.add('message-text');
  messageTextSpan.textContent = text;

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.appendChild(senderSpan);
  messageContent.appendChild(messageTextSpan);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(messageContent);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Receive chat messages
socket.on('chat message', (data) => {
  if (data.username !== username) {
    addMessage(data.username, data.message);
  }
});

// Receive message history
socket.on('message history', (history) => {
  history.forEach((message) => {
    addMessage(message.username, message.message);
  });
});

// Receive error messages
socket.on('error message', (errorMessage) => {
  alert(errorMessage);
});
