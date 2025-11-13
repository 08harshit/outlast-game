// DTOs for Outlast server-client API communication

export interface CreateGameDto {
  creatorPlayerId: string;
}

export interface JoinGameDto {
  gameId: string;
  playerId: string;
}

export interface UpdatePlayerPositionDto {
  gameId: string;
  playerId: string;
  position: { x: number; y: number };
  velocity?: { x: number; y: number };
}

export interface ShootBulletDto {
  gameId: string;
  playerId: string;
  weaponId: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

export interface EndGameDto {
  gameId: string;
  winnerPlayerId?: string;
}
