import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitReport extends Document {
  visitId: string;
  generatedAt: Date;
  universityName: string;
  companyName: string;
  visitDate: Date;
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  noShows: number;
  summary: string;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VisitReportSchema: Schema = new Schema(
  {
    visitId: { type: String, required: true, index: true },
    generatedAt: { type: Date, required: true, default: Date.now },
    universityName: { type: String, required: true },
    companyName: { type: String, required: true },
    visitDate: { type: Date, required: true },
    totalRegistered: { type: Number, required: true },
    totalAttended: { type: Number, required: true },
    attendanceRate: { type: Number, required: true },
    noShows: { type: Number, required: true },
    summary: { type: String, required: true },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IVisitReport>('VisitReport', VisitReportSchema);
