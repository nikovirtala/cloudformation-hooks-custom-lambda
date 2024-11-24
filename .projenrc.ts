import { AwsCdkApp } from "@nikovirtala/projen-aws-cdk-app";
const project = new AwsCdkApp({
    cdkVersion: "2.170.0",
    defaultReleaseBranch: "main",
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

    // deps: [],                /* Runtime dependencies of this module. */
    // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
    // packageName: undefined,  /* The "name" in package.json. */
});

project.synth();
