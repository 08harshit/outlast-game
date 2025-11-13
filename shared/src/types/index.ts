// Core game state types

export interface PlayerState {
  id: string;
  x: number;
  y: number;
  rotation: number;
  health: number;
  isAlive: boolean;
  velocityX: number;
  velocityY: number;
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

