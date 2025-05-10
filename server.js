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

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('chat message', (data) => {
    if (containsBannedWords(data.username)) {
      socket.emit('error message', 'Your username contains inappropriate words.');
      return;
    }
    io.emit('chat message', data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});