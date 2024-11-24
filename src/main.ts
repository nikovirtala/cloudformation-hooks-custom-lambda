import { App } from "aws-cdk-lib";
import { MyStack } from "@/stacks";

const app = new App();

new MyStack(app, "cloudformation-hooks-custom-lambda");

app.synth();
