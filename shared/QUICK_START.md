# @outlast/shared - Quick Start Guide

## 🎯 Complete Strategy Summary

### Package Overview
`@outlast/shared` is a TypeScript library containing shared types, interfaces, and DTOs for the Outlast Battle Royale game. It's designed to be used by both the Angular client and NestJS server.

## 📁 Package Structure

```
outlast-shared/
├── src/
│   ├── types/          # Core game state types
│   │   └── index.ts    # PlayerState, BulletState, GameState, etc.
│   ├── dto/            # Data Transfer Objects
│   │   └── index.ts    # Re-exports from dtos.ts
│   └── interfaces/     # Additional interfaces
│       └── index.ts    # Re-exports from live-state.ts
├── dist/               # Built output (JS + .d.ts)
├── index.ts           # Main entry point
├── package.json       # Package configuration
└── tsconfig.*.json    # TypeScript configs
```

## 🔧 Local Development (Current Setup)

### Step 1: Build the Package
```bash
cd outlast-shared
npm run build
```

### Step 2: Install in Projects
Already configured via `file:../outlast-shared` in:
- `outlast/package.json`
- `outlastserver/package.json`

Just run:
```bash
# From project root
npm install
```

### Step 3: Use in Code
```typescript
// Server (NestJS)
import { PlayerState, GameState, CreateGameDto } from '@outlast/shared';

// Client (Angular)
import { PlayerState, BulletState } from '@outlast/shared';
```

## 📦 Publishing to NPM

### Prerequisites
1. NPM account: https://www.npmjs.com
2. Login: `npm login`

### Publishing Steps

#### 1. Build
```bash
cd outlast-shared
npm run build
```

#### 2. Test Locally (Optional)
```bash
# Link package
npm link

# In another project
npm link @outlast/shared

# Test, then unlink
npm unlink @outlast/shared
```

#### 3. Version Bump
```bash
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm version major   # 0.1.0 → 1.0.0
```

#### 4. Publish
```bash
npm publish --access public
```

#### 5. Use Published Version
Update `package.json` in client/server:
```json
{
  "dependencies": {
    "@outlast/shared": "^0.1.0"
  }
}
```

Then: `npm install`

## 🔄 Development Workflow

### Making Changes
1. Edit types in `outlast-shared/src/` or `outlast-shared/index.ts`
2. Build: `cd outlast-shared && npm run build`
3. Changes automatically available in client/server (file: link)

### Adding New Types
1. Add to appropriate folder:
   - Core game types → `src/types/index.ts`
   - API DTOs → `src/dtos.ts`
   - Live state → `src/live-state.ts`
2. Export from `index.ts`
3. Build and use

## 📋 Available Exports

### Core Types
- `PlayerState` - Player position, health, rotation
- `BulletState` - Bullet position, velocity, owner
- `ObstacleState` - Obstacle/barrier info
- `GameState` - Complete game snapshot

### DTOs
- `CreateGameDto`
- `JoinGameDto`
- `UpdatePlayerPositionDto`
- `ShootBulletDto`
- `EndGameDto`

### Live State
- `LivePlayerState`
- `LiveBulletState`
- `GameLiveState`
- `Barrier`

## ✅ Current Status

- ✅ Package structure created
- ✅ Build system working
- ✅ Types organized
- ✅ Client linked (file: path)
- ✅ Server linked (file: path)
- ✅ Imports updated
- ✅ Ready for local development
- ⏳ Ready for publishing when needed

## 🚀 Next Steps

1. **Continue Development**: Use `@outlast/shared` in both projects
2. **Add More Types**: Extend as game features grow
3. **Publish When Ready**: Follow publishing guide when stable
4. **CI/CD**: Set up auto-publish on version bump (optional)

## 📚 Documentation Files

- `STRATEGY.md` - Complete strategy overview
- `PUBLISHING.md` - Detailed publishing guide
- `README.md` - Package documentation
- `QUICK_START.md` - This file

