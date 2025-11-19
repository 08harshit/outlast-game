import { Injectable } from '@nestjs/common';
import type { PlayerState } from '@shared/types';

@Injectable()
export class AppService {
  private readonly players = new Map<string, PlayerState>();

  getHello(): string {
    return 'Hello World!';
  }

  updatePlayerState(state: PlayerState): { status: 'ok' } {
    const isNewPlayer = !this.players.has(state.gamePlayerId);
    this.players.set(state.gamePlayerId, state);
    
    console.log(`📊 Game Frame Update:`, {
      gamePlayerId: state.gamePlayerId,
      username: state.username,
      action: isNewPlayer ? 'NEW PLAYER JOINED' : 'UPDATE',
      position: `(${Math.round(state.position.x)}, ${Math.round(state.position.y)})`,
      rotation: `${(state.rotation ? state.rotation * 180 / Math.PI : 0).toFixed(1)}°`,
      health: `${state.health}/100`,
      isAlive: state.isAlive ? '✅' : '❌',
      velocity: `(${Math.round(state.velocity.x)}, ${Math.round(state.velocity.y)})`,
      totalPlayers: this.players.size,
      timestamp: new Date().toISOString()
    });
    
    return { status: 'ok' };
  }

  getPlayerStates(): PlayerState[] {
    return Array.from(this.players.values());
  }
}
