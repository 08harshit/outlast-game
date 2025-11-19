// Core game state types

export interface PlayerState {
  // IDs
  gameId: string;
  gamePlayerId: string; // The unique ID from the GamePlayer model
  playerId: string; // The unique ID from the Player model
  username: string;

  // Game State
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  health: number;
  isAlive: boolean;

  // Additional optional realtime fields
  rotation?: number;
  isShooting?: boolean;
}

export interface BulletState {
  id: string;
  x: number;
  y: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  ownerId: string;
  timestamp: number;
}

export interface ObstacleState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  timestamp: number;
  players: PlayerState[];
  bullets: BulletState[];
  obstacles: ObstacleState[];
  worldWidth: number;
  worldHeight: number;
}

