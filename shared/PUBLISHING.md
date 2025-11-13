# Publishing @outlast/shared to NPM

## Prerequisites

1. **NPM Account**: Create account at https://www.npmjs.com
2. **Login**: `npm login` (or `npm adduser`)
3. **Verify**: `npm whoami`

## Publishing Steps

### 1. Build the Package
```bash
cd outlast-shared
npm run build
```

### 2. Test Locally (Optional but Recommended)
```bash
# In outlast-shared directory
npm link

# In outlast or outlastserver directory
npm link @outlast/shared

# Test imports work
# Then unlink when done
npm unlink @outlast/shared
```

### 3. Version Bump
```bash
# Patch version (0.1.0 → 0.1.1)
npm version patch

# Minor version (0.1.0 → 0.2.0)
npm version minor

# Major version (0.1.0 → 1.0.0)
npm version major
```

### 4. Publish
```bash
# Public package
npm publish --access public

# Private package (requires paid npm account)
npm publish
```

### 5. Verify
```bash
npm view @outlast/shared
```

## Using in Projects

### After Publishing

**Install in client/server:**
```bash
cd outlast
npm install @outlast/shared

cd ../outlastserver
npm install @outlast/shared
```

**Use in code:**
```typescript
import { PlayerState, GameState } from '@outlast/shared';
```

## Local Development (Before Publishing)

### Option 1: NPM Workspaces (Recommended)
Already set up in root `package.json`:
```bash
# From project root
npm install
# Workspaces automatically link packages
```

### Option 2: NPM Link
```bash
# In outlast-shared
npm link

# In outlast or outlastserver
npm link @outlast/shared
```

### Option 3: File Path (Current)
```typescript
// Use relative path
import { PlayerState } from '../../outlast-shared/dist/index';
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Publish Package
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          registry-url: 'https://registry.npmjs.org'
      - run: cd outlast-shared && npm ci && npm run build
      - run: cd outlast-shared && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Version Strategy

- **0.x.x**: Development/Alpha
- **1.x.x**: Stable/Production
- Use semantic versioning: MAJOR.MINOR.PATCH

## Troubleshooting

### "Package name already exists"
- Change package name in `package.json`
- Or use scoped name: `@yourusername/outlast-shared`

### "You do not have permission"
- Check npm account
- Verify you're logged in: `npm whoami`
- Check package name availability

### Build fails
- Run `npm run build` manually
- Check TypeScript errors
- Verify all dependencies installed

