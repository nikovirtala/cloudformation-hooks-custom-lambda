# Project Structure

## Root Directory Organization

```
├── src/                    # Source code
├── test/                   # Test files
├── .projen/               # Projen configuration files
├── cdk.out/               # CDK synthesis output
├── coverage/              # Test coverage reports
└── node_modules/          # Dependencies
```

## Source Code Structure (`src/`)

```
src/
├── main.ts                # CDK app entry point
├── handlers/              # Lambda function handlers
│   ├── change-set.ts     # Change set validation handler
│   └── template.ts       # Template validation handler
├── stacks/               # CDK stack definitions
│   └── index.ts         # Main stack implementation
└── types/               # TypeScript type definitions
    └── index.ts        # CloudFormation Hook types
```

## Key Architectural Patterns

### CDK Stack Organization
- Single main stack (`MyStack`) containing all resources
- Lambda functions defined with NodejsFunction construct
- IAM roles and policies defined inline
- CloudFormation hooks configured with proper targeting

### Lambda Handler Pattern
- Each handler exports a `handler` function with proper typing
- Structured logging using Pino logger
- Consistent error handling and response format
- Type guards for payload validation

### Type System
- Custom types defined in `src/types/index.ts`
- Strong typing for CloudFormation Hook requests/responses
- Handler type definitions for Lambda functions

## File Naming Conventions

- **Kebab-case**: For file names (`change-set.ts`, `template.ts`)
- **PascalCase**: For class names (`MyStack`)
- **camelCase**: For function and variable names

## Import Path Aliases

Use configured path aliases for cleaner imports:
- `@/custom-types` for type definitions
- `@/handlers/*` for handler functions
- `@/stacks` for stack definitions

## Test Organization

- Tests located in `test/` directory
- Snapshot testing enabled for CDK stacks
- Coverage reports generated in `coverage/` directory