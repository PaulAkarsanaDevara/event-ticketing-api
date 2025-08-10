import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  refreshToken?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}