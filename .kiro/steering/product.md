# Product Overview

This is a CloudFormation Hooks custom Lambda implementation that provides proactive validation of AWS CloudFormation templates using AWS Lambda functions.

## Purpose

The project implements CloudFormation Hooks that can intercept and validate CloudFormation operations (stack and change set operations) before they are executed. This allows for:

- Proactive validation of CloudFormation templates
- Custom compliance checks during stack operations
- Prevention of non-compliant resource deployments

## Key Features

- **Change Set Hooks**: Validate individual resource changes before they are applied
- **Template Hooks**: Validate entire CloudFormation templates during stack operations
- **Configurable Failure Modes**: Can be set to WARN or FAIL based on validation results
- **Stack Filtering**: Can target specific stacks or exclude certain stacks from validation

## References

- [AWS CloudFormation Hooks Documentation](https://docs.aws.amazon.com/cloudformation-cli/latest/hooks-userguide/lambda-hooks.html)
- [AWS Blog: Proactive CloudFormation Template Validation](https://aws.amazon.com/blogs/devops/proactively-validate-your-aws-cloudformation-templates-with-aws-lambda/)