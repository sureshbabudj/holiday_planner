# Development Setup Guide

This project includes a comprehensive development experience with automated formatting, linting, and code organization.

## 🚀 Features

- ✨ **Auto format on save** with Prettier
- 📦 **Auto import organization** (grouped and sorted)
- 🧹 **Auto removal of unused imports**
- 🔧 **ESLint** with Next.js and TypeScript rules
- 📋 **TypeScript strict linting**
- 🎯 **Separate rules for client/server components**
- 🔄 **Git hooks** for consistent code quality
- 📝 **Auto-ordering of package.json**

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix auto-fixable linting issues
npm run format           # Format all files with Prettier
npm run format:check     # Check if files are formatted
npm run type-check       # Run TypeScript type checking

# Build
npm run build            # Build for production
npm start                # Start production server
```

## 📋 What's Included

### Prettier Configuration

- Automatic code formatting on save
- Import organization and unused import removal
- Consistent code style across the project
- Custom rules for React/TypeScript projects

### ESLint Configuration

- Next.js core web vitals and TypeScript rules
- Import sorting and organization
- Unused imports detection and removal
- Separate rules for client and server components
- TypeScript strict linting rules

### VS Code Integration

- Auto-format on save enabled
- Import organization on save
- ESLint auto-fix on save
- Recommended extensions for optimal experience

### Git Hooks (Husky + lint-staged)

- Pre-commit hooks that run:
  - ESLint auto-fix
  - Prettier formatting
- Ensures consistent code quality before commits

## 🔧 VS Code Setup

### Recommended Extensions

The project includes extension recommendations in `.vscode/extensions.json`:

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer
- Error Lens
- And more...

### Settings

VS Code settings are configured for:

- Auto-format on save
- Import organization on save
- ESLint auto-fix on save
- TypeScript strict mode

## 📁 Configuration Files

- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore during formatting
- `eslint.config.mjs` - ESLint configuration (Flat Config)
- `.vscode/settings.json` - VS Code workspace settings
- `.vscode/extensions.json` - Recommended extensions
- `.husky/pre-commit` - Git pre-commit hook
- `package.json` - lint-staged configuration

## 🎯 Import Organization

**ESLint handles all import organization** (not Prettier) to avoid conflicts.

Imports are automatically organized in this order:

1. Side effect imports
2. Node.js built-in modules (prefixed with `node:`)
3. React and external packages
4. Internal packages/components (starting with `@` or `components`)
5. Relative imports (parent directories first with `../`)
6. Same directory imports (starting with `./`)
7. CSS/style imports

**How it works:**

- **Prettier**: Handles code formatting (spacing, quotes, etc.)
- **ESLint**: Handles import organization and unused import removal
- **VS Code**: Runs ESLint auto-fix on save to organize imports
- **Git hooks**: Ensure both formatting and import organization before commit

## 💡 Development Tips

1. **Save files frequently** - Auto-formatting happens on save
2. **Let ESLint fix issues** - Many issues are auto-fixable
3. **Check the Problems panel** - VS Code will show linting errors
4. **Use the type-check script** - Catches TypeScript errors early
5. **Commit often** - Git hooks ensure consistent quality

## 🚨 Troubleshooting

If you encounter issues:

1. **ESLint errors**: Run `npm run lint:fix`
2. **Formatting issues**: Run `npm run format`
3. **TypeScript errors**: Run `npm run type-check`
4. **Git hook failures**: Fix linting/formatting issues first
5. **VS Code not formatting**: Check if Prettier extension is installed and enabled
6. **Import organization conflicts**: The setup uses ESLint for import organization (not Prettier). Run `npm run lint:fix` to organize imports properly

## 🔄 Manual Commands

If you need to run commands manually:

```bash
# Format specific files
npx prettier --write "src/**/*.{ts,tsx}"

# Lint specific files
npx eslint "src/**/*.{ts,tsx}" --fix

# Type check
npx tsc --noEmit

# Skip pre-commit hooks (not recommended)
git commit --no-verify -m "commit message"
```

## 📦 Package.json Organization

The package.json is configured to maintain alphabetical order of:

- Scripts
- Dependencies
- DevDependencies

This happens automatically during the build process and git hooks.
