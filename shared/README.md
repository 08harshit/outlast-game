# @outlast/shared

Shared TypeScript types and interfaces for the Outlast Battle Royale game.

## Installation

```bash
npm install @outlast/shared
```

## Usage

### Import Types

```typescript
import { PlayerState, BulletState, GameState } from '@outlast/shared';
import { CreateGameDto, JoinGameDto } from '@outlast/shared';
import { LivePlayerState, GameLiveState } from '@outlast/shared';
```

### Available Exports

#### Core Types
- `PlayerState` - Player position, health, and state
- `BulletState` - Bullet position and trajectory
- `ObstacleState` - Obstacle/barrier information
- `GameState` - Complete game state snapshot

#### DTOs
- `CreateGameDto` - Create new game
- `JoinGameDto` - Join existing game
- `UpdatePlayerPositionDto` - Update player position
- `ShootBulletDto` - Fire bullet
- `EndGameDto` - End game

#### Live State
- `LivePlayerState` - Real-time player state
- `LiveBulletState` - Real-time bullet state
- `GameLiveState` - Complete live game state
- `Barrier` - Game barrier/obstacle

## Development

```bash
# Build the package
npm run build

# Lint
npm run lint
```

## Publishing

```bash
# Version bump
npm version patch|minor|major

# Publish
npm publish --access public
```

## License

MIT

