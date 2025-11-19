import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import type { PlayerState, GameState } from '@shared/types';
import { CreateGameDto, JoinGameDto } from '@shared/dto';

/**
 * GameSocketService
 * Manages real-time WebSocket communication with the NestJS GameGateway.
 * 
 * Usage:
 *   this.socketService.connect('http://localhost:3000');
 *   
 *   // Create a game room
 *   this.socketService.createGame({ username: 'Player1' }).subscribe(gameId => {
 *     console.log('Game created:', gameId);
 *   });
 *   
 *   // Or join an existing game
 *   this.socketService.joinGame({ gameId, username: 'Player2' }).subscribe(...);
 *   
 *   // Subscribe to player state updates from other players
 *   this.socketService.playerStateUpdates$.subscribe(state => {
 *     console.log('Other player moved:', state);
 *   });
 *   
 *   // Send your own player state at ~60fps
 *   this.socketService.emitPlayerUpdate(myPlayerState);
 */
@Injectable({
  providedIn: 'root'
})
export class GameSocketService {
  private socket: Socket | null = null;
  private ngZone = new NgZone({});

  // Observable streams for component consumption
  private gameCreatedSubject = new Subject<{ gameId: string; gamePlayerId: string; playerId: string }>();
  private joinedGameSubject = new Subject<{ gameId: string; gamePlayerId: string; playerId: string }>();
  private playerJoinedSubject = new Subject<any>();
  private playerStateUpdateSubject = new Subject<PlayerState>();
  private errorSubject = new Subject<any>();
  private connectedSubject = new BehaviorSubject<boolean>(false);

  gameCreated$ = this.gameCreatedSubject.asObservable();
  joinedGame$ = this.joinedGameSubject.asObservable();
  playerJoined$ = this.playerJoinedSubject.asObservable();
  playerStateUpdates$ = this.playerStateUpdateSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  connected$ = this.connectedSubject.asObservable();

  private playerUpdateFrameRate = 60; // 60 fps
  private playerUpdateInterval = 1000 / this.playerUpdateFrameRate;
  private lastUpdateTime = 0;

  constructor() {}

  /**
   * Connect to the WebSocket server
   */
  connect(serverUrl?: string): void {
    if (this.socket?.connected) {
      console.log('Already connected');
      return;
    }

    // Auto-detect server URL from current window location if not provided
    if (!serverUrl) {
      const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
      const hostname = window.location.hostname;
      const port = 3000;
      serverUrl = `${protocol}://${hostname}:${port}`;
    }

    console.log(`📡 Connecting to server at: ${serverUrl}`);

    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Set up event listeners
    this.setupEventListeners();

    this.socket.on('connect', () => {
      console.log('✅ Connected to game server');
      this.connectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from game server');
      this.connectedSubject.next(false);
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      this.ngZone.run(() => this.errorSubject.next(error));
    });
  }

  /**
   * Create a new game room
   */
  createGame(payload: CreateGameDto): Observable<{ gameId: string; gamePlayerId: string; playerId: string }> {
    return new Observable((observer) => {
      if (!this.socket?.connected) {
        observer.error('Not connected to server');
        return;
      }

      this.socket.emit('createGame', payload, (response: any) => {
        this.ngZone.run(() => {
          if (response?.gameId) {
            observer.next(response);
            observer.complete();
            this.gameCreatedSubject.next(response);
          } else {
            observer.error('Failed to create game');
          }
        });
      });
    });
  }

  /**
   * Join an existing game room
   */
  joinGame(payload: JoinGameDto): Observable<{ gameId: string; gamePlayerId: string; playerId: string }> {
    return new Observable((observer) => {
      if (!this.socket?.connected) {
        observer.error('Not connected to server');
        return;
      }

      this.socket.emit('joinGame', payload, (response: any) => {
        this.ngZone.run(() => {
          if (response?.gameId) {
            observer.next(response);
            observer.complete();
            this.joinedGameSubject.next(response);
          } else {
            observer.error('Failed to join game');
          }
        });
      });
    });
  }

  /**
   * Emit player state update at ~60fps
   * This should be called from your game loop, but rate-limited
   */
  emitPlayerUpdate(playerState: PlayerState): void {
    if (!this.socket?.connected) {
      return;
    }

    const now = Date.now();
    if (now - this.lastUpdateTime >= this.playerUpdateInterval) {
      this.lastUpdateTime = now;
      this.socket.emit('playerUpdate', playerState);
    }
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Set up listeners for server events
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Server responds to createGame
    this.socket.on('gameCreated', (data: any) => {
      this.ngZone.run(() => {
        console.log('Game created:', data);
        this.gameCreatedSubject.next(data);
      });
    });

    // Server responds to joinGame
    this.socket.on('joinedGame', (data: any) => {
      this.ngZone.run(() => {
        console.log('Joined game:', data);
        this.joinedGameSubject.next(data);
      });
    });

    // Other players joined the room
    this.socket.on('playerJoined', (data: any) => {
      this.ngZone.run(() => {
        console.log('Player joined:', data);
        this.playerJoinedSubject.next(data);
      });
    });

    // Real-time player state updates from other players
    this.socket.on('playerStateUpdate', (playerState: PlayerState) => {
      this.ngZone.run(() => {
        this.playerStateUpdateSubject.next(playerState);
      });
    });

    // Server errors
    this.socket.on('error', (errorData: any) => {
      this.ngZone.run(() => {
        console.error('Server error:', errorData);
        this.errorSubject.next(errorData);
      });
    });
  }
}
