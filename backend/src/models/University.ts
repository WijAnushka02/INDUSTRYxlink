import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  location?: string;
  website?: string;
  coordinators: mongoose.Types.ObjectId[];
  degreePrograms: { name: string; field: string }[];
  academicCalendar: {
    semesterStart?: Date;
    semesterEnd?: Date;
    internshipStart?: Date;
    internshipDurationMonths?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UniversitySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    website: { type: String },
    coordinators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    degreePrograms: [
      {
        name: { type: String },
        field: { type: String },
      },
    ],
    academicCalendar: {
      semesterStart: { type: Date },
      semesterEnd: { type: Date },
      internshipStart: { type: Date },
      internshipDurationMonths: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUniversity>('University', UniversitySchema);
