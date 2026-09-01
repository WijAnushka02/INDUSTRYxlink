"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpportunitySchema = void 0;
const zod_1 = require("zod");
exports.createOpportunitySchema = zod_1.z.object({
    body: zod_1.z.object({
        visitDate: zod_1.z.string().datetime({ message: 'Invalid date format (must be ISO-8601)' }),
        durationHours: zod_1.z.number().positive('Duration must be a positive number'),
        capacity: zod_1.z.number().int().positive('Capacity must be a positive integer'),
        topic: zod_1.z.string().min(3, 'Topic must be at least 3 characters'),
        eligibleDegrees: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
//# sourceMappingURL=opportunity.validator.js.map