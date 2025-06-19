import type { Handler } from "aws-lambda";

export interface CloudFormationHookRequest {
    awsAccountId: string;
    stackId: string;
    changeSetId?: string;
    hookTypeName: string;
    hookTypeVersion: string;
    hookModel: {
        LambdaFunction: string;
    };
    actionInvocationPoint: "CREATE_PRE_PROVISION" | "UPDATE_PRE_PROVISION" | "DELETE_PRE_PROVISION";
    requestData: {
        targetName: string;
        targetType: string;
        targetLogicalId: string;
        targetModel?: {
            // biome-ignore lint/suspicious/noExplicitAny:
            resourceProperties: Record<string, any>;
            // biome-ignore lint/suspicious/noExplicitAny:
            previousResourceProperties?: Record<string, any>;
        };
        payload?: string; // S3 Presigned URL for stack and change set operations
    };
    requestContext: {
        invocation: number;
        // biome-ignore lint/suspicious/noExplicitAny:
        callbackContext?: any;
    };
    clientRequestToken: string;
}

export interface CloudFormationHookResponse {
    hookStatus: "SUCCESS" | "FAILED" | "IN_PROGRESS";
    errorCode?: "NonCompliant" | "InternalFailure";
    message: string;
    clientRequestToken: string;
    // biome-ignore lint/suspicious/noExplicitAny:
    callbackContext?: any;
    callbackDelaySeconds?: number;
}

export type CloudFormationHookHandler = Handler<CloudFormationHookRequest, CloudFormationHookResponse>;
