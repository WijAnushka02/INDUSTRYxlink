import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    opportunityId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Opportunity ID'),
    requestedDate: z.string().datetime({ message: 'Invalid date format (must be ISO-8601)' }),
    studentCount: z.number().int().positive('Student count must be a positive integer'),
  }),
});

export const updateRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']),
  }),
});
