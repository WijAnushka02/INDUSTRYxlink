import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'STUDENT' | 'LECTURER' | 'UNIVERSITY_COORDINATOR' | 'COMPANY_COORDINATOR' | 'ADMIN';
  profileId?: mongoose.Types.ObjectId;
  profileModel?: 'University' | 'Company';
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
    profileId: { type: Schema.Types.ObjectId, refPath: 'profileModel' },
    profileModel: { type: String, enum: ['University', 'Company'] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
