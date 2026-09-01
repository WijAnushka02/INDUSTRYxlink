"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatusSchema = exports.createRequestSchema = void 0;
const zod_1 = require("zod");
exports.createRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        opportunityId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Opportunity ID'),
        requestedDate: zod_1.z.string().datetime({ message: 'Invalid date format (must be ISO-8601)' }),
        studentCount: zod_1.z.number().int().positive('Student count must be a positive integer'),
    }),
});
exports.updateRequestStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']),
    }),
});
//# sourceMappingURL=request.validator.js.map