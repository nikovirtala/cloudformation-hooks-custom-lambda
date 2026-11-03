import { AwsCdkTypeScriptAppProject } from "@nikovirtala/projen-constructs";

const project = new AwsCdkTypeScriptAppProject({
    cdkVersion: "2.201.0",
    defaultReleaseBranch: "main",
    deps: ["@types/aws-lambda", "pino"],
    devDeps: ["@nikovirtala/projen-constructs"],
    name: "cloudformation-hooks-custom-lambda",
});

/* Node.js subpath imports instead of tsconfig `paths`, which Node.js's native TypeScript support doesn't read.
 * TypeScript, Vitest and esbuild resolve them too. */
project.package.addField("imports", {
    "#custom-types": "./src/types/index.ts",
    "#stacks": "./src/stacks/index.ts",
});

project.synth();
