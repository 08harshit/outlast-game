# How to Join Using Game ID

## 🎮 Step-by-Step Guide

### **Step 1: Player 1 - Create a Game**

1. Open the game in your browser: `http://localhost:4200`
2. You'll see the **Outlast Game Lobby** screen
3. Enter your **username** (e.g., "Player1")
4. Click the **"🚀 Create Game"** button
5. Your unique **Game ID** will be displayed (e.g., `550e8400-e29b-41d4-a716-446655440000`)
6. **Copy** the Game ID using the 📋 button or select it manually

### **Step 2: Share the Game ID**

Send the Game ID to your friend via:
- Text message
- Discord
- Email
- Or any communication method

**Example:**
```
Come play Outlast with me! Game ID: 550e8400-e29b-41d4-a716-446655440000
```

### **Step 3: Player 2 - Join the Game**

1. On another device, open: `http://192.168.0.110:4200` (use the network IP)
2. You'll see the **Outlast Game Lobby** screen
3. Enter your **username** (e.g., "Player2")
4. Paste or type the **Game ID** that Player 1 shared
5. Click the **"✅ Join Game"** button
6. You'll be added to Player 1's game room

### **Step 4: Start Playing!**

Once both players are in the game, you'll both be in the same game world with real-time synchronization:
- **WASD** or **Arrow Keys** - Move
- **Mouse** - Aim/Look around
- **Left Click** - Shoot bullets
- **Red border on your square** - This is your player direction

---

## 🔍 Understanding Game IDs

### What is a Game ID?

A **Game ID** is a unique identifier for each game room. It's a UUID (Universally Unique Identifier) that looks like:

```
550e8400-e29b-41d4-a716-446655440000
```

### Key Points:

- ✅ Each game room has a **unique ID**
- ✅ **Game IDs are persistent** - stay the same during the game
- ✅ **Only players with the ID can join** - it's your private room
- ✅ **Game ID is shown after creation** - easy to copy and share
- ✅ **Game must be in "waiting" status** - can't join games that have started

---

## 🖥️ Network Address Examples

### On Your Machine (Localhost):
```
http://localhost:4200
```
- Works on the same device
- NestJS server connects to `http://localhost:3000`

### From Another Device (Network):
```
http://192.168.0.110:4200
```
- Replace `192.168.0.110` with your actual local IP
- NestJS server auto-detects and connects to same IP on port `3000`
- Both devices must be on **same WiFi network**

---

## 📱 Step-by-Step Screenshots (Text Description)

### Lobby Screen:
```
┌─────────────────────────────────┐
│      🎮 Outlast Game            │
│   Multiplayer Battle Arena      │
├─────────────────────────────────┤
│ ✅ Connected to server          │
├─────────────────────────────────┤
│ 👤 Username                     │
│ ┌─────────────────────────────┐ │
│ │ Enter your username         │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│  🚀 CREATE GAME                 │
├─────────────────────────────────┤
│            or                   │
├─────────────────────────────────┤
│ 🎫 Game ID                      │
│ ┌─────────────────────────────┐ │
│ │ Enter the Game ID from ...  │ │
│ └─────────────────────────────┘ │
│                                 │
│  ✅ JOIN GAME                   │
└─────────────────────────────────┘
```

### After Creating Game:
```
┌─────────────────────────────────┐
│      🎯 Game Created!           │
├─────────────────────────────────┤
│ Share this Game ID with friends:│
│                                 │
│ ┌───────────────────────────┐   │
│ │ 550e8400-e29b-41d4-...   │ 📋│
│ └───────────────────────────┘   │
│                                 │
│  ⏳ Waiting for players to join │
└─────────────────────────────────┘
```

---

## 🚨 Troubleshooting

### "Not connected to server"
- ❌ Server is not running
- ✅ Solution: Start server with `npm run start:debug` in server folder

### "Connection refused"
- ❌ Firewall blocking port 3000
- ✅ Solution: Allow port 3000 through firewall

### "Game not found or is already in progress"
- ❌ Game ID is wrong
- ❌ Game has already started
- ✅ Solution: Check Game ID spelling, create a new game if needed

### "Cannot connect from another device"
- ❌ Using `localhost:4200` instead of network IP
- ❌ Different WiFi network
- ✅ Solution: Use `http://192.168.x.x:4200` with correct IP

### "Game ID too long/wrong format"
- ❌ Accidentally added extra characters
- ✅ Solution: Copy the ID using the 📋 Copy button

---

## 🔄 Game Flow Diagram

```
Player 1                                  Server                                 Player 2
   |                                       |                                       |
   |--- Enter username ---                 |                                       |
   |                                       |                                       |
   |--- Click "Create Game" --------->     |                                       |
   |                                       |--- Create Game Room (SQLite) -------->|
   |<------ Display Game ID <----------    |                                       |
   |                                       |                                       |
   |  [Copy & Share Game ID]               |                                       |
   |         ↓                             |                                       |
   |      [Send via message] --------------|-----> [Receive Game ID]              |
   |                                       |          Player 2 opens app           |
   |                                       |          |                            |
   |                                       |          |--- Enter username -------->|
   |                                       |          |                            |
   |                                       |          |--- Enter Game ID & Join -->|
   |                                       |          |                            |
   |                                       |<----- Join Game Socket Room <-----   |
   |<---- playerJoined event ----------   |          |                            |
   |  (Player 2 joined notification)      |                                       |
   |                                       |-----> playerJoined event ---------->|
   |                                       |                                       |
   |--- playerUpdate (move/shoot) ------> |<--- playerStateUpdate (broadcast) -->|
   |                                       |                                       |
   |<---- playerStateUpdate ------------- |<--- playerUpdate (Player 1's moves)--|
   |   (Player 2's movements sync)         |                                       |
   |                                       |                                       |
```

---

## 💡 Pro Tips

1. **Copy Game ID First** - Use the 📋 Copy button to avoid typos
2. **Share Full URL** - Include network IP in shared link: `http://192.168.0.110:4200`
3. **Same WiFi Required** - Both devices must be on the same WiFi network
4. **Username Can Be Same** - Two players can have the same username (bad idea for confusion though!)
5. **One Game Per Tab** - Open multiple tabs to test locally, but one game instance per tab
6. **Server Must Be Running** - Check green connection indicator before creating/joining

---

## 🎮 What Happens After Joining?

1. **Automatic Navigation** - Both players redirected to `/game` route
2. **Game World Loaded** - Phaser game engine initializes
3. **Real-time Sync** - Player positions sync at 60fps
4. **WASD Controls** - Move around the game world
5. **Mouse & Click** - Shoot at other players
6. **Health Tracking** - Health displayed at top-left corner
7. **Collision Detection** - Obstacles and bullet collisions work

---

## 📊 Network Flow Summary

```
Browser 1 (Player 1)           Browser 2 (Player 2)
      ↓                              ↓
GameSocketService              GameSocketService
      ↓                              ↓
Socket.IO Client               Socket.IO Client
      ↓                              ↓
WebSocket: localhost:3000 ←→ NestJS GameGateway
                              ↓
                           Prisma ORM
                              ↓
                          SQLite Database
```

---

## 🔐 Security Notes

- Game IDs are displayed but not secured (share cautiously)
- Currently no authentication - anyone with Game ID can join
- CORS is open to any origin (fine for local testing)
- For production, add proper auth and game state validation
