const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

// Load banned words from badwords.json
let bannedWords = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'public', 'badwords.json'), 'utf8');
  bannedWords = JSON.parse(data);
} catch (err) {
  console.error('Failed to load badwords.json:', err);
}

// Function to check for banned words
function containsBannedWords(text) {
  return bannedWords.some((entry) => {
    const regex = new RegExp(entry.match, 'i'); // Case-insensitive regex
    return regex.test(text);
  });
}

// Message history (in-memory storage)
const messageHistory = [];

// Function to clean up old messages
function cleanUpOldMessages() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000; // 10 minutes in milliseconds
  while (messageHistory.length > 0 && messageHistory[0].timestamp < tenMinutesAgo) {
    messageHistory.shift(); // Remove the oldest message
  }
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // Send message history to the new user
  socket.emit('message history', messageHistory);

  // Handle incoming chat messages
  socket.on('chat message', (data) => {
    if (containsBannedWords(data.username)) {
      socket.emit('error message', 'Your username contains inappropriate words.');
      return;
    }

    if (containsBannedWords(data.message)) {
      socket.emit('error message', 'Your message contains inappropriate words.');
      return;
    }

    const message = {
      username: data.username,
      message: data.message,
      timestamp: Date.now(),
    };

    // Add the message to the history
    messageHistory.push(message);

    // Clean up old messages
    cleanUpOldMessages();

    // Broadcast the message to all users
    io.emit('chat message', message);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});