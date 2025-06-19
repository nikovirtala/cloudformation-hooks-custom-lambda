import { AwsCdkApp } from "@nikovirtala/projen-aws-cdk-app";

const project = new AwsCdkApp({
    autoApproveOptions: {
        allowedUsernames: ["nikovirtala"],
        secret: "GITHUB_TOKEN",
    },
    cdkVersion: "2.201.0",
    defaultReleaseBranch: "main",
    deps: ["@types/aws-lambda", "pino"],
    depsUpgradeOptions: {
        workflowOptions: {
            labels: ["auto-approve", "auto-merge"],
        },
    },
    devDeps: ["@nikovirtala/projen-aws-cdk-app"],
    name: "cloudformation-hooks-custom-lambda",
    tsconfig: {
        compilerOptions: {
            paths: {
                "@/custom-types": ["./src/types/index.ts"],
                "@/handlers/*": ["./src/handlers/*"],
                "@/stacks": ["./src/stacks/index.ts"],
            },
        },
    },
});

project.synth();
