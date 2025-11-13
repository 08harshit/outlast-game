// TypeScript interfaces for Outlast Live State

export interface LivePlayerState {
  playerId: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  health: number;
  isAlive: boolean;
  currentWeaponId?: string;
}

export interface LiveBulletState {
  bulletId: string;
  ownerId: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  damage: number;
}

export type BarrierType = 'wall' | 'tree' | 'rock';

export interface Barrier {
  id: string;
  gameId: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  type: BarrierType;
  isDestructible: boolean;
}

export interface GameLiveState {
  gameId: string;
  players: Record<string, LivePlayerState>;
  bullets: Record<string, LiveBulletState>;
  barriers: Barrier[];
  status: 'waiting' | 'in_progress' | 'finished';
}
