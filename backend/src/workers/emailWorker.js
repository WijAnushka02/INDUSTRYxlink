"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
// Start the worker to listen to the 'emailQueue'
const emailWorker = new bullmq_1.Worker('emailQueue', async (job) => {
    const { to, subject, body } = job.data;
    console.log(`[EmailWorker] 📧 Starting job ${job.id}`);
    console.log(`[EmailWorker] Sending email to: ${to}`);
    console.log(`[EmailWorker] Subject: ${subject}`);
    // Simulate network delay for sending email (e.g., via SendGrid/AWS SES)
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[EmailWorker] ✅ Successfully sent email to ${to}`);
}, { connection: redis_1.connection });
emailWorker.on('completed', (job) => {
    console.log(`[EmailWorker] Job ${job.id} has completed!`);
});
emailWorker.on('failed', (job, err) => {
    console.log(`[EmailWorker] ❌ Job ${job?.id} has failed with ${err.message}`);
});
exports.default = emailWorker;
//# sourceMappingURL=emailWorker.js.map