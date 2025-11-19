# Network Multiplayer Setup Guide

This guide explains how to set up the Outlast Game for multiplayer play over local WiFi.

## Prerequisites

- NestJS server running on port 3000 (WebSocket gateway)
- Angular client running on port 4200
- Both devices on the same WiFi network

---

## Step 1: Find Your Local IP Address

On your machine, run:

```bash
# Linux/Mac
ip route get 1 | sed -n 's/^.*src \([0-9.]*\) .*$/\1/p'

# Or try
hostname -I | awk '{print $1}'
```

This will output something like: `192.168.1.100` (note this down)

---

## Step 2: Ensure NestJS Server is Running

The server should already be running. Verify it's listening on all interfaces:

```bash
cd /home/harshit/workspace/outlastproject/server
npm run start:debug
```

Expected output:
```
[Nest] xxxxx  - 11/13/2025, HH:MM:SS PM     LOG [NestFactory] Starting Nest application...
[Nest] xxxxx  - 11/13/2025, HH:MM:SS PM     LOG [NestApplication] Nest application successfully started +3ms
```

The server listens on `0.0.0.0:3000` (all network interfaces).

---

## Step 3: Start Angular Client on All Network Interfaces

**Stop the current Angular dev server** (Ctrl+C in the client terminal), then restart it to listen on all interfaces:

```bash
cd /home/harshit/workspace/outlastproject/client
npm start -- --host 0.0.0.0 --disable-host-check
```

You should see:
```
➜  Local:   http://localhost:4200/
➜  On Your Network: http://192.168.1.100:4200/
```

---

## Step 4: Share the URL with Others

Anyone on the same WiFi can now access the game by opening in their browser:

```
http://192.168.1.100:4200
```

(Replace `192.168.1.100` with your actual local IP address from Step 1)

---

## Step 5: Test Multiplayer Connection

1. **Player 1**: Open `http://localhost:4200` (or `http://192.168.1.100:4200`)
   - Click "Create Game" (or corresponding button in UI)
   - Note the Game ID displayed

2. **Player 2** (on another device): Open `http://192.168.1.100:4200`
   - Click "Join Game"
   - Enter the Game ID from Player 1
   - Click "Join"

3. **Verify Connection**:
   - Check browser console on both clients (F12 → Console tab)
   - Look for: `✅ Connected to game server`
   - Look for: `Player joined: [game info]`

---

## Network Architecture

```
Player 1 (192.168.1.100:4200)
         |
         | WebSocket
         |
    NestJS Server (0.0.0.0:3000)
         |
         | WebSocket
         |
Player 2 (192.168.1.101:4200)
```

### How It Works:

1. **Player 1** creates a game room via `createGame` event
2. Server creates a `Game` database record and Socket.IO room
3. **Player 2** joins with the Game ID via `joinGame` event
4. Server adds Player 2 to the same Socket.IO room
5. When Player 1 moves/shoots, their `playerUpdate` broadcasts to all in the room
6. Player 2 receives `playerStateUpdate` and updates their game state

---

## Troubleshooting

### "Cannot connect to server"
- Verify both devices are on the same WiFi
- Check firewall allows port 3000 (WebSocket)
- Verify server is running: `netstat -an | grep 3000`
- Check browser console for specific error

### "localhost doesn't work from other device"
- **Don't use localhost** from other devices
- Use your local IP address instead: `http://192.168.x.x:4200`
- The GameSocketService now auto-detects the correct hostname

### Server not accepting connections
- Ensure CORS is enabled (it is, in GameGateway)
- Check NestJS server logs for errors
- Verify port 3000 is not blocked by firewall

### Game ID not working
- Make sure you copied the entire ID correctly
- Verify both players are using the same Game ID
- Check network connection in console logs

---

## Current WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `createGame` | `{ username: string }` | Create a new game room |
| `joinGame` | `{ gameId: string, username: string }` | Join an existing room |
| `playerUpdate` | `PlayerState` | Send your player state (position, velocity, health) |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `gameCreated` | `{ gameId, gamePlayerId, playerId }` | Room created successfully |
| `joinedGame` | `{ gameId, gamePlayerId, playerId }` | Successfully joined room |
| `playerJoined` | `{ gamePlayer }` | Another player joined your room |
| `playerStateUpdate` | `PlayerState` | Another player's state update |
| `error` | `{ message, error }` | Server error occurred |

---

## Performance Tips

1. **Player Update Rate**: Capped at 60fps (16.67ms between updates)
2. **Database Updates**: Fire-and-forget (non-blocking) to keep latency low
3. **Broadcast Scope**: Only sends to players in the same game room
4. **Network Optimization**: Player state includes only changed values

---

## Next Steps

- Implement player spawn/despawn handlers
- Add proper game state synchronization on join
- Handle player disconnect/reconnect
- Implement game start/end logic
- Add chat/messaging functionality
