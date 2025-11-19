# Outlast Game - Project Documentation

## Project Overview
**Outlast Game** is a full-stack multiplayer game application built as a TypeScript monorepo. It features a real-time game engine on the client side with a NestJS backend for server-side logic.

**Repository:** https://github.com/08harshit/outlast-game

---

## Technology Stack

### Frontend (Client)
- **Framework:** Angular 20.3.0
- **Game Engine:** Phaser 3.90.0
- **Language:** TypeScript
- **Styling:** SCSS
- **Build Tool:** Angular CLI with Vite

### Backend (Server)
- **Framework:** NestJS 11.0.1
- **Language:** TypeScript
- **Database Driver:** Prisma
- **Port:** 3000
- **Development:** ts-node-dev for hot reload

### Shared
- **Location:** `/shared/src/`
- **Contents:** 
  - Type definitions (`types/`)
  - DTOs (Data Transfer Objects)
  - Interfaces
  - Prisma schema

---

## Project Structure

```
outlastproject/
├── client/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Game components (game-board, bullet, player, etc.)
│   │   │   ├── services/       # GameStateService
│   │   │   └── app.routes.ts
│   │   └── main.ts
│   ├── angular.json
│   └── tsconfig.json
│
├── server/                 # NestJS application
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── tsconfig.json
│
├── shared/                 # Shared code (types, DTOs)
│   ├── src/
│   │   ├── types/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   └── dtos.ts
│   └── prisma/
│
├── package.json            # Root package with workspace config
├── tsconfig.base.json      # Base TypeScript configuration
└── README.md
```

---

## Key Concepts

### Path Aliases
The monorepo uses TypeScript path aliases for clean imports:
- `@shared/*` → Points to `/shared/src/*`
- Available in both client and server via `tsconfig.base.json`

### Shared Types
Core game types defined in `/shared/src/types/`:
- `PlayerState` - Player position, health, velocity
- `BulletState` - Bullet state and movement
- `ObstacleState` - Obstacle/terrain information
- `GameState` - Global game state

### Game Architecture
- **Client:** Real-time game loop using Phaser
- **Server:** REST API for player state updates
- **Communication:** HTTP requests from client to server

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm 8+

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/08harshit/outlast-game.git
   cd outlast-game
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This automatically installs dependencies for all workspaces (root, client, server).

3. **Environment Setup** (if needed)
   - Create `.env` file in server directory for database configuration

---

## Running the Application

### Development Mode

**Terminal 1 - Start Server:**
```bash
npm run dev:server
```
- Runs on `http://localhost:3000`
- Hot reload enabled with ts-node-dev
- Serves REST API endpoints

**Terminal 2 - Start Client:**
```bash
npm run dev:client
```
- Runs on `http://localhost:4200`
- Angular development server with hot reload
- Accessible in browser

### Production Build

**Build All:**
```bash
npm run build:all
```

**Individual Builds:**
```bash
npm run build:client
npm run build:server
```

### Other Scripts

```bash
# Root level commands
npm run dev:client        # Start client
npm run dev:server        # Start server
npm run build:all         # Build client and server
npm run build:client      # Build client only
npm run build:server      # Build server only

# Server commands (from server/ directory)
npm run start:dev         # Development mode
npm run build             # Build for production
npm run start             # Run production build
npm run test              # Run tests

# Client commands (from client/ directory)
npm start                 # Development server
npm run build             # Build for production
npm run test              # Run tests
```

---

## Configuration Files

### Root Configuration
- **`package.json`** - Workspace definition, root scripts
- **`tsconfig.base.json`** - Base TypeScript config with path aliases
- **`.gitignore`** - Git ignore rules

### Server Configuration
- **`server/tsconfig.json`** - Server-specific TypeScript settings
- **`server/nest-cli.json`** - NestJS CLI configuration
- **`server/prisma/schema.prisma`** - Database schema

### Client Configuration
- **`client/angular.json`** - Angular CLI configuration
- **`client/tsconfig.json`** - Client TypeScript settings
- **`client/tsconfig.app.json`** - Application-specific config

---

## API Endpoints

### Server Endpoints (Base URL: `http://localhost:3000`)

**GET `/`**
- Returns: `"Hello World!"`
- Purpose: Health check

**POST `/player-state`**
- Body: `PlayerState` object
- Returns: Updated player state
- Purpose: Update player position and status

**GET `/player-state`**
- Returns: Current game state snapshot
- Purpose: Retrieve game state for debugging

---

## Important Files

### Core Game Files
- **`client/src/app/components/game-board/`** - Main game canvas and loop
- **`client/src/app/services/game-state.service.ts`** - Game state management
- **`server/src/app.controller.ts`** - API endpoints
- **`server/src/app.service.ts`** - Game logic service

### Shared Types
- **`shared/src/types/index.ts`** - All game type definitions
- **`shared/src/dtos.ts`** - Data transfer objects

---

## Development Workflow

1. **Update Types** in `shared/src/types/` or `shared/src/dtos.ts`
2. **Import via path alias** `@shared/types` or `@shared/dtos`
3. **Server changes** auto-reload with ts-node-dev
4. **Client changes** auto-reload with Angular dev server
5. **Git workflow** - commit and push to GitHub

---

## Troubleshooting

### Port Already in Use
- **Error:** `EADDRINUSE: address already in use :::3000`
- **Solution:** Kill existing process or use different port:
  ```bash
  PORT=3001 npm run dev:server
  ```

### Module Not Found
- **Error:** `Cannot find module '@shared/...'`
- **Solution:** Verify path aliases in tsconfig.json files

### Build Failures
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## Performance Notes

- Client bundle: ~1.52 MB (includes Phaser game library)
- Server startup: ~2-3 seconds
- Hot reload: <1 second for most changes

---

## Future Enhancements

- [ ] WebSocket support for real-time multiplayer
- [ ] Player authentication system
- [ ] Database integration with Prisma
- [ ] Advanced game physics
- [ ] Score/leaderboard system
- [ ] Mobile responsiveness

---

## Git Workflow

**Repository:** https://github.com/08harshit/outlast-game

```bash
# View changes
git status

# Commit changes
git add .
git commit -m "Descriptive message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main
```

---

## Notes

- The project uses npm workspaces for monorepo management
- Shared code in `/shared/src/` is NOT published as a separate package
- All imports use `@shared/*` path aliases for clean code
- TypeScript strict mode enabled for type safety
- CORS enabled on server for client-server communication

---

## Contact & Support

**Author:** Harshit  
**Repository:** https://github.com/08harshit/outlast-game  
**Issues:** Use GitHub Issues for bug reports and feature requests

---

*Last Updated: November 13, 2025*
