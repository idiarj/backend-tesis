import { z } from "zod";
import { getLogger } from "./logger.js";

const logger = getLogger('ZOD');

export function validateSchema({schema, data}: {schema: z.ZodSchema, data: any})  {
    const result = schema.safeParse(data);
    if (!result.success) {
        const firstError = result.error.issues[0].message;
        logger.debug(`Validation failed: ${JSON.stringify(result.error.issues)}`);
        return {
            success: result.success,
            error: firstError
        }
    }
    return result;
}