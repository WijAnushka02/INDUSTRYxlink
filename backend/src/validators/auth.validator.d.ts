import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodEnum<{
            STUDENT: "STUDENT";
            LECTURER: "LECTURER";
            UNIVERSITY_COORDINATOR: "UNIVERSITY_COORDINATOR";
            COMPANY_COORDINATOR: "COMPANY_COORDINATOR";
            ADMIN: "ADMIN";
        }>;
        orgName: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=auth.validator.d.ts.map