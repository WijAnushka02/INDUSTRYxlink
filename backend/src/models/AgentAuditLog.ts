import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentAuditLog extends Document {
  pipelineId: string;
  agentName: string;
  action: string;
  timestamp: Date;
  status: string;
  input?: string;
  output?: string;
  error?: string;
  createdAt: Date;
}

const AgentAuditLogSchema: Schema = new Schema(
  {
    pipelineId: { type: String, required: true, index: true },
    agentName: { type: String, required: true, index: true },
    action: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ['IDLE', 'RUNNING', 'COMPLETED', 'FAILED'],
      required: true,
    },
    input: { type: String },
    output: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

AgentAuditLogSchema.index({ pipelineId: 1, timestamp: 1 });

export default mongoose.model<IAgentAuditLog>('AgentAuditLog', AgentAuditLogSchema);
