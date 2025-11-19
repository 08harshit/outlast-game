# 🎮 Outlast Game - Multiplayer Join Guide

## Quick Start: How to Join a Game Using Game ID

### **For Player 1 (Game Creator):**

1. Open browser: `http://localhost:4200` (or `http://192.168.0.110:4200` if on network)
2. Enter your **username**
3. Click **"🚀 Create Game"**
4. Your **Game ID** will appear (e.g., `550e8400-e29b-41d4-a716-446655440000`)
5. **Copy the Game ID** using the 📋 button
6. Share it with your friend

---

### **For Player 2 (Game Joiner):**

1. Open browser: `http://192.168.0.110:4200` (use same network IP as Player 1)
2. Enter your **username**
3. **Paste the Game ID** that Player 1 shared
4. Click **"✅ Join Game"**
5. You're now in the same game! 🎯

---

## 🖥️ UI Overview

The lobby screen has two main sections:

### **Create New Game:**
- Enter username → Click "Create Game" → Get Game ID → Share ID

### **Join Existing Game:**
- Enter username → Enter Game ID → Click "Join Game" → Play!

---

## 🌐 Network Addresses

| Scenario | URL |
|----------|-----|
| **Same machine** | `http://localhost:4200` |
| **Different device, same WiFi** | `http://192.168.0.110:4200` |
| **Get your IP** | `ip route get 1 \| sed -n 's/^.*src \([0-9.]*\) .*$/\1/p'` |

---

## ✨ Features

✅ **Real-time multiplayer** - See other players moving instantly  
✅ **Game ID sharing** - Easy copy-paste Game IDs  
✅ **Auto-detection** - Socket automatically connects to correct server IP  
✅ **Connection status** - Green indicator shows server connection  
✅ **Error messages** - Clear feedback if something goes wrong  
✅ **Loading states** - Shows when connecting to server  

---

## 🎮 In-Game Controls

Once you've joined the game:

| Control | Action |
|---------|--------|
| **WASD** or **Arrow Keys** | Move around |
| **Mouse** | Look/aim direction |
| **Left Click** | Shoot bullets |
| **Red border on your square** | Your facing direction |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not connected to server" | Refresh page or start NestJS server |
| "Game not found" | Check Game ID spelling |
| "Can't connect from other device" | Use network IP instead of localhost |
| "Players moving but out of sync" | Check network latency |

---

## 📋 Game ID Format

A Game ID looks like:
```
550e8400-e29b-41d4-a716-446655440000
```

- 🔑 Unique identifier for each game room
- 📌 Shared via message/URL to invite friends
- ✅ Only valid while game is in "waiting" status
- 🔐 Currently no auth (add for production)

---

## 🚀 Try It Now!

1. Open `http://localhost:4200` on your main device
2. Create a game and copy the ID
3. Open `http://192.168.0.110:4200` on another device (same WiFi)
4. Paste the Game ID and join
5. Move around and watch the real-time sync! 🎯

See **HOW_TO_JOIN.md** for detailed guide with screenshots and flow diagrams.
