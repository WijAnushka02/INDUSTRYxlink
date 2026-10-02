import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceRecord extends Document {
  visitId: string;
  studentId: string;
  present: boolean;
  checkInTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema: Schema = new Schema(
  {
    visitId: { type: String, required: true, index: true },
    studentId: { type: String, required: true },
    present: { type: Boolean, required: true, default: false },
    checkInTime: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

AttendanceRecordSchema.index({ visitId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);
