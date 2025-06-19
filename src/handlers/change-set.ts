import type { CloudFormationHookHandler, CloudFormationHookRequest, CloudFormationHookResponse } from "@/custom-types";
import { pino } from "pino";

interface ChangeSetHookPayload {
    changedResources: Array<{
        beforeContext?: string;
        afterContext?: string;
    }>;
}

const logger = pino();

export const handler: CloudFormationHookHandler = async (
    event: CloudFormationHookRequest,
): Promise<CloudFormationHookResponse> => {
    logger.debug({ event: event });

    const payloadUrl = event?.requestData?.payload;

    const response: CloudFormationHookResponse = {
        hookStatus: "SUCCESS",
        message: "Operation is compliant",
        clientRequestToken: event.clientRequestToken,
    };

    try {
        // biome-ignore lint/style/noNonNullAssertion:
        const payloadRequest = await fetch(payloadUrl!);
        const payload: unknown = await payloadRequest.json();

        if (isChangeSetHookPayload(payload)) {
            const changes = payload.changedResources || [];

            for (const change of changes) {
                let beforeContext = {};
                let afterContext = {};

                if (change.beforeContext) {
                    beforeContext = JSON.parse(change.beforeContext);
                }
                if (change.afterContext) {
                    afterContext = JSON.parse(change.afterContext);
                }

                // Evaluate Change here
                logger.debug(beforeContext);
                logger.debug(afterContext);
            }
        } else {
            throw new Error("Invalid payload structure");
        }
    } catch (e) {
        logger.error({ error: e });
        response.hookStatus = "FAILED";
        response.message = "Failed to evaluate operation.";
        response.errorCode = "InternalFailure";
    }

    return response;
};

// biome-ignore lint/suspicious/noExplicitAny:
function isChangeSetHookPayload(payload: any): payload is ChangeSetHookPayload {
    return payload && Array.isArray(payload.changedResources);
}
