const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

app.use(express.json());

// Load bad words and exceptions
const badWords = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'badwords.json'), 'utf8'));
const exceptions = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'exceptions.json'), 'utf8'));

/**
 * Validates a username against bad words and exceptions.
 * @param {string} username - The username to validate.
 * @returns {boolean} - Returns true if the username is valid, false otherwise.
 */
function validateUsername(username) {
  // Normalize the username to lowercase for comparison
  const normalizedUsername = username.toLowerCase();

  // Check if the username is in the exceptions list
  if (exceptions.allowedUsernames.map((u) => u.toLowerCase()).includes(normalizedUsername)) {
    return true;
  }

  // Check if the username matches any bad words
  for (const badWord of badWords) {
    const regex = new RegExp(badWord.match, 'i');
    if (regex.test(username)) {
      return false; // Invalid username
    }
  }

  return true; // Valid username
}

// API endpoint for username validation
app.post('/validate-username', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const isValid = validateUsername(username);
  res.json({ isValid });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});