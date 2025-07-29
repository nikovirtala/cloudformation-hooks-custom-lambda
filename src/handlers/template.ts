import { pino } from "pino";
import type { CloudFormationHookHandler, CloudFormationHookRequest, CloudFormationHookResponse } from "@/custom-types";

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
        if (!payloadUrl) {
            throw new Error("Payload URL is required");
        }
        const payloadRequest = await fetch(payloadUrl);
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

function isTemplateHookPayload(payload: unknown): payload is TemplateHookPayload {
    return (
        typeof payload === "object" &&
        payload !== null &&
        (("template" in payload && typeof (payload as { template: unknown }).template === "string") ||
            ("previousTemplate" in payload &&
                typeof (payload as { previousTemplate: unknown }).previousTemplate === "string"))
    );
}
