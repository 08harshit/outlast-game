# WebSocket Integration Example

This guide shows how to use `GameSocketService` in your Angular components to connect to the NestJS WebSocket gateway.

## Setup

1. **Inject the service** in your component:

```typescript
import { GameSocketService } from './services/game-socket.service';

@Component({...})
export class GameComponent implements OnInit {
  constructor(private socketService: GameSocketService) {}
  
  ngOnInit() {
    this.socketService.connect('http://localhost:3000');
  }
}
```

## Creating a Game

```typescript
createNewGame() {
  this.socketService.createGame({ username: 'Player1' })
    .subscribe({
      next: (response) => {
        console.log('Game created:', response.gameId);
        this.gameId = response.gameId;
        this.gamePlayerId = response.gamePlayerId;
      },
      error: (err) => console.error('Failed to create game', err)
    });
}
```

## Joining a Game

```typescript
joinExistingGame(gameId: string) {
  this.socketService.joinGame({ 
    gameId, 
    username: 'Player2' 
  })
    .subscribe({
      next: (response) => {
        console.log('Joined game:', response.gameId);
        this.gameId = response.gameId;
        this.gamePlayerId = response.gamePlayerId;
      },
      error: (err) => console.error('Failed to join game', err)
    });
}
```

## Sending Player State Updates (60fps)

In your game loop (Phaser `update()` or similar):

```typescript
private update(): void {
  // Your game logic...
  
  // Build your current player state
  const myPlayerState: PlayerState = {
    gameId: this.gameId,
    gamePlayerId: this.gamePlayerId,
    playerId: this.playerId,
    username: 'Player1',
    position: { x: this.player.x, y: this.player.y },
    velocity: { x: this.player.body.velocity.x, y: this.player.body.velocity.y },
    health: this.playerHealth,
    isAlive: this.playerHealth > 0,
    rotation: this.player.rotation
  };
  
  // Send to server (rate-limited to 60fps internally)
  this.socketService.emitPlayerUpdate(myPlayerState);
}
```

## Receiving Player State Updates from Others

```typescript
ngOnInit() {
  this.socketService.connect('http://localhost:3000');
  
  // Listen for other players' state updates
  this.socketService.playerStateUpdates$.subscribe((playerState: PlayerState) => {
    console.log(`${playerState.username} moved to:`, playerState.position);
    this.updateOtherPlayerPosition(playerState);
  });
  
  // Listen for new players joining
  this.socketService.playerJoined$.subscribe((data) => {
    console.log('New player joined:', data.gamePlayer.player.username);
  });
}
```

## Listening to Connection Status

```typescript
ngOnInit() {
  this.socketService.connected$.subscribe((isConnected) => {
    console.log('Connected to server:', isConnected);
    // Update UI to show connection status
  });
}
```

## Error Handling

```typescript
this.socketService.error$.subscribe((error) => {
  console.error('Socket error:', error);
  // Show error message to user
});
```

## Complete Example Component

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameSocketService } from './services/game-socket.service';
import type { PlayerState } from '@shared/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-multiplayer-game',
  template: `
    <div>
      <button (click)="createGame()">Create Game</button>
      <button (click)="joinGame()">Join Game</button>
      <button (click)="disconnect()">Disconnect</button>
      <p>Status: {{ connected$ | async ? 'Connected' : 'Disconnected' }}</p>
    </div>
  `
})
export class MultiplayerGameComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  connected$ = this.socketService.connected$;
  
  gameId: string = '';
  gamePlayerId: string = '';
  playerId: string = '';
  
  constructor(private socketService: GameSocketService) {}
  
  ngOnInit() {
    this.socketService.connect('http://localhost:3000');
    
    this.socketService.playerStateUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: PlayerState) => {
        this.updateRemotePlayer(state);
      });
  }
  
  createGame() {
    this.socketService.createGame({ username: 'Me' })
      .subscribe(response => {
        this.gameId = response.gameId;
        this.gamePlayerId = response.gamePlayerId;
        this.playerId = response.playerId;
      });
  }
  
  joinGame() {
    const gameId = prompt('Enter game ID:');
    if (gameId) {
      this.socketService.joinGame({ gameId, username: 'Guest' })
        .subscribe(response => {
          this.gameId = response.gameId;
          this.gamePlayerId = response.gamePlayerId;
          this.playerId = response.playerId;
        });
    }
  }
  
  disconnect() {
    this.socketService.disconnect();
  }
  
  private updateRemotePlayer(state: PlayerState) {
    console.log('Remote player updated:', state);
    // Update your game renderer with this player's state
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketService.disconnect();
  }
}
```

## Server Endpoint Reference

**Event: `createGame`**
- Send: `{ username: string }`
- Receive: `{ gameId, gamePlayerId, playerId }`

**Event: `joinGame`**
- Send: `{ username: string; gameId: uuid }`
- Receive: `{ gameId, gamePlayerId, playerId }`

**Event: `playerUpdate`**
- Send: `PlayerState` (60fps)
- Receive: broadcast to all other players in room

**Event: `error`**
- Server sends: `{ message: string; error?: any }`
