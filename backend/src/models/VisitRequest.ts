import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitRequest extends Document {
  universityId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  requestedDate: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  studentCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const VisitRequestSchema: Schema = new Schema(
  {
    universityId: { type: Schema.Types.ObjectId, ref: 'University', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'VisitOpportunity', required: true },
    requestedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    studentCount: { type: Number },
  },
  { timestamps: true }
);

VisitRequestSchema.index({ universityId: 1 });
VisitRequestSchema.index({ companyId: 1 });

export default mongoose.model<IVisitRequest>('VisitRequest', VisitRequestSchema);
