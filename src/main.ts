import { MyStack } from "@/stacks";
import { App } from "aws-cdk-lib";

const app = new App();

new MyStack(app, "cloudformation-hooks-custom-lambda");

app.synth();
