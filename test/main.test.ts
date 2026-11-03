import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { beforeAll, describe, test } from "vitest";
import { MyStack } from "#stacks";

describe("MyStack", () => {
    let template: Template;

    beforeAll(() => {
        /* Skip bundling: the tests check the resources, not the asset hashes of the bundles, which
         * change with the handlers, their dependencies and even the node_modules layout. */
        const app = new App({ context: { "aws:cdk:bundling-stacks": [] } });
        template = Template.fromStack(new MyStack(app, "test"));
    });

    test("creates the change set and stack hook functions", () => {
        template.resourceCountIs("AWS::Lambda::Function", 2);
        template.allResourcesProperties("AWS::Lambda::Function", {
            Architectures: ["arm64"],
            Runtime: "nodejs22.x",
            LoggingConfig: { ApplicationLogLevel: "DEBUG", LogFormat: "JSON" },
        });
    });

    test("registers a change set hook and a stack hook that skip this stack", () => {
        const hooks = [
            { id: "ChangeSetHook", fn: "ChangeSetFunction", operation: "CHANGE_SET" },
            { id: "StackHook", fn: "TemplateFunction", operation: "STACK" },
        ];

        for (const { id, fn, operation } of hooks) {
            template.hasResource("AWS::CloudFormation::LambdaHook", {
                Properties: {
                    Alias: `Test::Lambda::${id}`,
                    ExecutionRole: { "Fn::GetAtt": [Match.stringLikeRegexp("^HooksRole"), "Arn"] },
                    FailureMode: "WARN",
                    HookStatus: "ENABLED",
                    LambdaFunction: { "Fn::GetAtt": [Match.stringLikeRegexp(`^${fn}`), "Arn"] },
                    StackFilters: { FilteringCriteria: "ALL", StackNames: { Exclude: ["test"] } },
                    TargetOperations: [operation],
                },
            });
        }
    });

    test("lets CloudFormation hooks invoke both functions", () => {
        template.hasResourceProperties("AWS::IAM::Role", {
            AssumeRolePolicyDocument: {
                Statement: [
                    Match.objectLike({
                        Action: "sts:AssumeRole",
                        Principal: { Service: "hooks.cloudformation.amazonaws.com" },
                    }),
                ],
            },
            Policies: [
                {
                    PolicyName: "LambdaInvokerHookPolicy",
                    PolicyDocument: {
                        Statement: [
                            Match.objectLike({
                                Action: "lambda:InvokeFunction",
                                Resource: [
                                    { "Fn::GetAtt": [Match.stringLikeRegexp("^ChangeSetFunction"), "Arn"] },
                                    { "Fn::GetAtt": [Match.stringLikeRegexp("^TemplateFunction"), "Arn"] },
                                ],
                            }),
                        ],
                    },
                },
            ],
        });
    });
});
