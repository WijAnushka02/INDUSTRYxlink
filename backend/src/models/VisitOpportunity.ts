import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitOpportunity extends Document {
  companyId: mongoose.Types.ObjectId;
  visitDate: Date;
  durationHours?: number;
  capacity: number;
  topic?: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  eligibleDegrees: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VisitOpportunitySchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    visitDate: { type: Date, required: true },
    durationHours: { type: Number },
    capacity: { type: Number, required: true },
    topic: { type: String },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'CANCELLED'],
      default: 'OPEN',
    },
    eligibleDegrees: [{ type: String }],
  },
  { timestamps: true }
);

VisitOpportunitySchema.index({ status: 1 });
VisitOpportunitySchema.index({ companyId: 1 });

export default mongoose.model<IVisitOpportunity>('VisitOpportunity', VisitOpportunitySchema);
