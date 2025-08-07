import { z } from "zod";

export function validateSchema({schema, data}: {schema: z.ZodSchema, data: any})  {
    const result = schema.safeParse(data);
    if (!result.success) {
        const firstError = result.error.issues[0].message;
        return {
            success: result.success,
            error: firstError
        }
    }
    return result;
}