import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGameDto {
	@IsString()
	@IsNotEmpty()
	username!: string;
}

export class JoinGameDto {
	@IsString()
	@IsNotEmpty()
	username!: string;

	@IsUUID()
	gameId!: string;
}

// Keep a compatibility re-export for any existing dtos.ts interfaces
export * from '../dtos';

