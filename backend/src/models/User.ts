import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'STUDENT' | 'LECTURER' | 'UNIVERSITY_COORDINATOR' | 'COMPANY_COORDINATOR' | 'ADMIN';
  universityId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

import bcrypt from 'bcrypt';

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

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

export default mongoose.model<IUser>('User', UserSchema);
