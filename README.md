# Unlike

**Unlike** is a privacy-first global chat platform where anyone can chat in real time—without any data being stored.

## 🌍 Overview

Unlike is a global, fully ephemeral chat application. All messages live only in memory and are destroyed when users disconnect or close the chat. No logs, no history, no user data is stored.

- **Global access**: anyone can connect from anywhere
- **No user accounts or registration**
- **Zero data retention**: all messages are erased when sessions end
- **Minimalistic design**: focused on pure chatting experience

## 🚀 Features

- Real‑time messaging across a single global chat room
- No login/authentication required
- End‑to‑end encryption
- Fast & lightweight—can run on mobile, desktop, or embedded environments
- Publicly accessible via [unlike.gr](https://unlike.gr)

## 🔗 Live Demo

Check out the live platform at **[https://unlike.gr](https://unlike.gr)** to start chatting instantly—no registration needed.

## 🏗 Architecture

Unlike is built on a simple server–client model:

- **Backend (server)**  
  - WebSocket server handles incoming messages and distributes them in real time  
  - Keeps all chat in memory only  
  - Automatically flushes all active messages and sessions when stopped

- **Frontend (client)**  
  - Web UI connects to the WebSocket endpoint  
  - Displays incoming messages and allows the user to send new ones  
  - Minimal UI: just messages and input field

## ⚙️ Tech Stack

- **Server**: Node.js with `ws`
- **Client**: HTML/CSS/JavaScript
- **Hosting**: Deployed over HTTPS and WebSockets (WSS) for encrypted communication
- **No Database**: chat operates entirely in volatile memory

## 🛡 Privacy & Security

- **No persistent logs**: Chat messages are not written to disk or database
- **Anonymous**: No usernames or personal identifiers collected
- **Session-based**: all data is lost once the session ends or the server restarts

## 🚀 Getting Started

### Developer

1. Clone repository:  
   ```bash
   git clone https://github.com/your‑org/unlike.git

2. Install dependencies:
   ```bash
   cd unlike
   npm install

3. Launch server:
   ```bash
   npm run start

4
    Open browser to http://localhost:3000 (or your configured host) and chat away!

Deployment

  Provide an SSL-secured WebSocket endpoint (e.g. wss://chat.unlike.gr)

  Deploy the server on any VPS or cloud provider

  Use a reverse proxy (Nginx/Traefik) to handle HTTPS/WSS

  Again: no database setup—just run and go!

💡 Why “Unlike”?

  The name reflects unlike conventional chat platforms

  Unlike stores no data and does not require identifying information

  Unlike traditional apps with accounts or ads — this is totally ephemeral

📄 License

This project is released under the MIT License — feel free to review, fork, or adapt it.
Author & Contact

Created by Antonios Rusman.
No tracking, no analytics — just chat.
  
