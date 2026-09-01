import { z } from 'zod';
export declare const createOpportunitySchema: z.ZodObject<{
    body: z.ZodObject<{
        visitDate: z.ZodString;
        durationHours: z.ZodNumber;
        capacity: z.ZodNumber;
        topic: z.ZodString;
        eligibleDegrees: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=opportunity.validator.d.ts.map