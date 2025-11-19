import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { PlayerState } from '@shared/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('player-state')
  updatePlayerState(@Body() state: PlayerState) {
    console.log(`🎮 [${new Date().toISOString()}] Received game frame from player: ${state.gamePlayerId} (${state.username})`);
    return this.appService.updatePlayerState(state);
  }

  @Get('player-state')
  getPlayerStates() {
    return this.appService.getPlayerStates();
  }
}
