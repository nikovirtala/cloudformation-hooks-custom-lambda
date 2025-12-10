import { AwsCdkTypeScriptAppProject } from "@nikovirtala/projen-constructs";

const project = new AwsCdkTypeScriptAppProject({
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
    devDeps: ["@nikovirtala/projen-constructs"],
    homebrew: false,
    mise: false,
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
