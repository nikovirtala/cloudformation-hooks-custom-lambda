import { pino } from "pino";
import type { CloudFormationHookHandler, CloudFormationHookRequest, CloudFormationHookResponse } from "@/custom-types";

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
        if (!payloadUrl) {
            throw new Error("Payload URL is required");
        }
        const payloadRequest = await fetch(payloadUrl);
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

function isChangeSetHookPayload(payload: unknown): payload is ChangeSetHookPayload {
    return (
        typeof payload === "object" &&
        payload !== null &&
        "changedResources" in payload &&
        Array.isArray((payload as { changedResources: unknown }).changedResources)
    );
}
