import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

const UserSchema  = new Schema<IUser>({
  name: { type: String, required: true  },
  email: { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshToken: { type: String } 
}, { timestamps: true });

// Method untuk compare password
UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hash password sebelum disimpan
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<IUser>('User', UserSchema);
