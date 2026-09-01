import { z } from 'zod';

export const createOpportunitySchema = z.object({
  body: z.object({
    visitDate: z.string().datetime({ message: 'Invalid date format (must be ISO-8601)' }),
    durationHours: z.number().positive('Duration must be a positive number'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    topic: z.string().min(3, 'Topic must be at least 3 characters'),
    eligibleDegrees: z.array(z.string()).optional(),
  }),
});
