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
            resourceProperties: Record<string, unknown>;
            previousResourceProperties?: Record<string, unknown>;
        };
        payload?: string; // S3 Presigned URL for stack and change set operations
    };
    requestContext: {
        invocation: number;
        callbackContext?: unknown;
    };
    clientRequestToken: string;
}

export interface CloudFormationHookResponse {
    hookStatus: "SUCCESS" | "FAILED" | "IN_PROGRESS";
    errorCode?: "NonCompliant" | "InternalFailure";
    message: string;
    clientRequestToken: string;
    callbackContext?: unknown;
    callbackDelaySeconds?: number;
}

export type CloudFormationHookHandler = Handler<CloudFormationHookRequest, CloudFormationHookResponse>;
