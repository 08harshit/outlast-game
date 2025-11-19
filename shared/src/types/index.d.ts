export interface PlayerState {
    gameId: string;
    gamePlayerId: string;
    playerId: string;
    username: string;
    position: {
        x: number;
        y: number;
    };
    velocity: {
        x: number;
        y: number;
    };
    health: number;
    isAlive: boolean;
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
//# sourceMappingURL=index.d.ts.map