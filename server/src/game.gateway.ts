

import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import type { CreateGameDto, JoinGameDto, PlayerState } from '@outlast/shared';

// @UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger('GameGateway');

  constructor(private prisma: PrismaService) {
    this.logger.log('🎮 Constructor called - gateway instantiating...');
    this.logger.log('✅ PrismaService injected:', !!this.prisma);
    this.logger.log('🔍 PrismaService type:', typeof this.prisma);
    this.logger.log('🔍 PrismaService methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.prisma)).slice(0, 5));
  }

  afterInit(server: Server) {
    this.logger.log('✅ afterInit - Socket.IO server initialized');
    this.logger.log('📡 Path: /socket.io');
    this.logger.log('📡 Ready to accept WebSocket and polling connections');
  }

  handleConnection(client: Socket) {
    this.logger.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client disconnected: ${client.id}`);
    // TODO: find which game the client was in and emit 'playerLeft'
  }

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @MessageBody() payload: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`📨 [GameGateway] createGame event received from ${client.id}:`, payload);
    try {
      const player = await this.prisma.player.upsert({
        where: { username: payload.username },
        update: {},
        create: { username: payload.username },
      });

      const game = await this.prisma.game.create({
        data: {
          status: 'waiting',
        },
      });

      const gamePlayer = await this.prisma.gamePlayer.create({
        data: {
          gameId: game.id,
          playerId: player.id,
          health: 100,
          isAlive: true,
        },
      });

      client.join(game.id);

      client.emit('gameCreated', {
        gameId: game.id,
        gamePlayerId: gamePlayer.id,
        playerId: player.id,
      });
    } catch (error) {
      client.emit('error', { message: 'Could not create game.', error });
    }
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() payload: JoinGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const game = await this.prisma.game.findFirst({
        where: {
          id: payload.gameId,
          status: 'waiting',
        },
      });

      if (!game) {
        client.emit('error', { message: 'Game not found or is already in progress.' });
        return;
      }

      const player = await this.prisma.player.upsert({
        where: { username: payload.username },
        update: {},
        create: { username: payload.username },
      });

      const gamePlayer = await this.prisma.gamePlayer.create({
        data: {
          gameId: game.id,
          playerId: player.id,
          health: 100,
          isAlive: true,
        },
        include: { player: true },
      });

      client.join(game.id);

      client.emit('joinedGame', {
        gameId: game.id,
        gamePlayerId: gamePlayer.id,
        playerId: player.id,
      });

      client.to(game.id).emit('playerJoined', {
        gamePlayer,
      });
    } catch (error) {
      client.emit('error', { message: 'Could not join game.', error });
    }
  }

  @SubscribeMessage('playerUpdate')
  async handlePlayerUpdate(
    @MessageBody() payload: PlayerState,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(payload.gameId).emit('playerStateUpdate', payload);

    this.prisma.gamePlayer
      .update({
        where: { id: payload.gamePlayerId },
        data: {
          lastPositionX: payload.position.x,
          lastPositionY: payload.position.y,
          health: payload.health,
          isAlive: payload.isAlive,
        },
      })
      .catch((err) => console.error('Failed to update player state in DB', err));
  }
}
