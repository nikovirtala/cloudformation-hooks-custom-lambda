import { AwsCdkTypeScriptAppProject } from "@nikovirtala/projen-constructs";

const project = new AwsCdkTypeScriptAppProject({
    cdkVersion: "2.201.0",
    defaultReleaseBranch: "main",
    deps: ["@types/aws-lambda", "pino"],
    devDeps: ["@nikovirtala/projen-constructs"],
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
