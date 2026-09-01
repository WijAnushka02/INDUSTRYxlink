import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'STUDENT' | 'LECTURER' | 'UNIVERSITY_COORDINATOR' | 'COMPANY_COORDINATOR' | 'ADMIN';
  universityId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['STUDENT', 'LECTURER', 'UNIVERSITY_COORDINATOR', 'COMPANY_COORDINATOR', 'ADMIN'],
      default: 'STUDENT',
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
