import { AwsCdkApp } from "@nikovirtala/projen-aws-cdk-app";
const project = new AwsCdkApp({
    cdkVersion: "2.170.0",
    defaultReleaseBranch: "main",
    deps: ["@types/aws-lambda", "pino"],
    devDeps: ["@nikovirtala/projen-aws-cdk-app"],
    name: "cloudformation-hooks-custom-lambda",
    projenrcTs: true,
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
