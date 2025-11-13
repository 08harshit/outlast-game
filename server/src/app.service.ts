import { Injectable } from '@nestjs/common';
import type { PlayerState } from '@shared/types';

@Injectable()
export class AppService {
  private readonly players = new Map<string, PlayerState>();

  getHello(): string {
    return 'Hello World!';
  }

  updatePlayerState(state: PlayerState): { status: 'ok' } {
    const isNewPlayer = !this.players.has(state.id);
    this.players.set(state.id, state);
    
    console.log(`📊 Game Frame Update:`, {
      playerId: state.id,
      action: isNewPlayer ? 'NEW PLAYER JOINED' : 'UPDATE',
      position: `(${Math.round(state.x)}, ${Math.round(state.y)})`,
      rotation: `${(state.rotation * 180 / Math.PI).toFixed(1)}°`,
      health: `${state.health}/100`,
      isAlive: state.isAlive ? '✅' : '❌',
      velocity: `(${Math.round(state.velocityX)}, ${Math.round(state.velocityY)})`,
      totalPlayers: this.players.size,
      timestamp: new Date().toISOString()
    });
    
    return { status: 'ok' };
  }

  getPlayerStates(): PlayerState[] {
    return Array.from(this.players.values());
  }
}
