
# @outlast/shared - NPM Package Strategy

## Overview
This package contains shared TypeScript types, interfaces, and DTOs for the Outlast Battle Royale game, usable by both the Angular client and NestJS server.

## Package Structure

```
outlast-shared/
├── src/
│   ├── types/          # Core game types (PlayerState, BulletState, etc.)
│   ├── dto/            # Data Transfer Objects for API
│   ├── interfaces/     # Additional interfaces
│   └── index.ts        # Main entry point (re-exports everything)
├── dist/               # Built output (JS + .d.ts)
├── package.json
├── tsconfig.json
└── README.md
```

## Build Strategy

### Dual Module Support
- **CommonJS** (for NestJS server)
- **ESM** (for Angular client)
- Both outputs generated from single TypeScript source

### Build Output
```
dist/
├── index.js           # CommonJS entry
├── index.mjs          # ESM entry
├── index.d.ts         # TypeScript definitions
└── types/             # Compiled type files
```

## Development Strategy

### Option 1: NPM Workspaces (Recommended)
- Root `package.json` with workspaces
- Local development without publishing
- Automatic linking

### Option 2: NPM Link
- `npm link` for local development
- Manual linking process

### Option 3: File Path (Current)
- Relative imports
- Works but not ideal for publishing

## Publishing Strategy

### Versioning
- Semantic versioning (0.1.0 → 0.1.1 → 0.2.0)
- Use `npm version patch/minor/major`

### Publishing Steps
1. Build the package: `npm run build`
2. Test locally: `npm link` in shared, `npm link @outlast/shared` in projects
3. Version bump: `npm version patch`
4. Publish: `npm publish --access public` (or private registry)

### NPM Registry
- **Public**: `npm publish --access public`
- **Private**: Use private npm registry or GitHub Packages
- **Scoped**: `@outlast/shared` (recommended)

## Usage in Projects

### Server (NestJS)
```typescript
import { PlayerState, GameState } from '@outlast/shared';
```

### Client (Angular)
```typescript
import { PlayerState, GameState } from '@outlast/shared';
```

## CI/CD Integration
- Auto-build on changes
- Auto-publish on version bump
- GitHub Actions workflow

