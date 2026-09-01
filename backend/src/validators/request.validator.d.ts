import { z } from 'zod';
export declare const createRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        opportunityId: z.ZodString;
        requestedDate: z.ZodString;
        studentCount: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateRequestStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<{
            CANCELLED: "CANCELLED";
            PENDING: "PENDING";
            ACCEPTED: "ACCEPTED";
            REJECTED: "REJECTED";
            COMPLETED: "COMPLETED";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=request.validator.d.ts.map