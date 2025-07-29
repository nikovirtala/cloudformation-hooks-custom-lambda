# Technology Stack

## Build System & Project Management

- **Projen**: Project configuration and build system management
- **Package Manager**: pnpm (with lockfile)
- **Node.js**: Version 22.16.0+ required

## Core Technologies

- **AWS CDK**: v2.201.0 - Infrastructure as Code
- **TypeScript**: v5.8.3 - Primary language
- **AWS Lambda**: Node.js 22.x runtime with ARM64 architecture
- **ESM Modules**: Modern ES module format

## Key Dependencies

- `aws-cdk-lib`: AWS CDK core library
- `constructs`: CDK constructs framework
- `@types/aws-lambda`: Lambda function type definitions
- `pino`: Structured logging library

## Development Tools

- **Biome**: Code formatting and linting (replaces ESLint/Prettier)
- **Vitest**: Testing framework with coverage
- **esbuild**: Fast bundling for Lambda functions
- **tsx**: TypeScript execution

## Common Commands

```bash
# Build the project
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test

# Watch mode for development
npm run watch

# Deploy to AWS
npm run deploy

# Synthesize CDK templates
npm run synth

# Format and lint code
npm run biome

# Bundle Lambda functions
npm run bundle
```

## Code Style Configuration

- **Formatter**: 4-space indentation, 120 character line width
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Linting**: Biome recommended rules enabled
- **Import Paths**: Custom path aliases configured:
  - `@/custom-types` → `./src/types/index.ts`
  - `@/handlers/*` → `./src/handlers/*`
  - `@/stacks` → `./src/stacks/index.ts`