import { join } from "node:path";
import { Stack, type StackProps, aws_cloudformation, aws_iam, aws_lambda, aws_lambda_nodejs } from "aws-cdk-lib";
import type { Construct } from "constructs";

export class MyStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const c = new aws_lambda_nodejs.NodejsFunction(this, "ChangeSetFunction", {
            applicationLogLevelV2: aws_lambda.ApplicationLogLevel.DEBUG,
            architecture: aws_lambda.Architecture.ARM_64,
            bundling: {
                format: aws_lambda_nodejs.OutputFormat.ESM,
                target: "esnext",
            },
            entry: join(import.meta.dirname, "../handlers/change-set.ts"),
            loggingFormat: aws_lambda.LoggingFormat.JSON,
            runtime: aws_lambda.Runtime.NODEJS_22_X,
        });

        const t = new aws_lambda_nodejs.NodejsFunction(this, "TemplateFunction", {
            applicationLogLevelV2: aws_lambda.ApplicationLogLevel.DEBUG,
            architecture: aws_lambda.Architecture.ARM_64,
            bundling: {
                format: aws_lambda_nodejs.OutputFormat.ESM,
                target: "esnext",
            },
            entry: join(import.meta.dirname, "../handlers/template.ts"),
            loggingFormat: aws_lambda.LoggingFormat.JSON,
            runtime: aws_lambda.Runtime.NODEJS_22_X,
        });

        const hooksRole = new aws_iam.Role(this, "HooksRole", {
            assumedBy: new aws_iam.ServicePrincipal("hooks.cloudformation.amazonaws.com"),
            path: "/",
            inlinePolicies: {
                LambdaInvokerHookPolicy: new aws_iam.PolicyDocument({
                    statements: [
                        new aws_iam.PolicyStatement({
                            effect: aws_iam.Effect.ALLOW,
                            actions: ["lambda:InvokeFunction"],
                            resources: [c.functionArn, t.functionArn],
                        }),
                    ],
                }),
            },
        });

        new aws_cloudformation.CfnLambdaHook(this, "ChangeSetHook", {
            alias: "Test::Lambda::ChangeSetHook",
            executionRole: hooksRole.roleArn,
            failureMode: "WARN",
            hookStatus: "ENABLED",
            lambdaFunction: c.functionArn,
            stackFilters: {
                filteringCriteria: "ALL",
                stackNames: {
                    exclude: [this.stackName],
                },
            },
            targetOperations: ["CHANGE_SET"],
        });

        new aws_cloudformation.CfnLambdaHook(this, "StackHook", {
            alias: "Test::Lambda::StackHook",
            executionRole: hooksRole.roleArn,
            failureMode: "WARN",
            hookStatus: "ENABLED",
            lambdaFunction: t.functionArn,
            stackFilters: {
                filteringCriteria: "ALL",
                stackNames: {
                    exclude: [this.stackName],
                },
            },
            targetOperations: ["STACK"],
        });
    }
}
