import type { CloudFormationHookHandler, CloudFormationHookRequest, CloudFormationHookResponse } from "@/custom-types";
import { pino } from "pino";

interface TemplateHookPayload {
    template?: string;
    previousTemplate?: string;
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

        if (isTemplateHookPayload(payload)) {
            if (payload.template) {
                // Do something with the template payload.template
                // JSON or YAML
                logger.debug({ template: payload.template });
            }
            if (payload.previousTemplate) {
                // Do something with the template payload.previousTemplate
                // JSON or YAML
                logger.debug({ previousTemplate: payload.previousTemplate });
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
function isTemplateHookPayload(payload: any): payload is TemplateHookPayload {
    return payload && (typeof payload.template === "string" || typeof payload.previousTemplate === "string");
}
