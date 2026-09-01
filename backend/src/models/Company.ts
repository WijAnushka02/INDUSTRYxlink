import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry?: string;
  location?: string;
  website?: string;
  coordinators: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    location: { type: String },
    website: { type: String },
    coordinators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);
