import { injectable } from 'tsyringe';
import { IUser } from "../../interfaces/user.interface";
import { User } from "../../schemas/user.schema";

@injectable()
export class UserService {
  async findByEmail(email: string) {
    return await User.findOne({ email })
  }

  async findById(id: string) {
    return await User.findById(id)
  }

  async createUser(data: Omit<IUser, '_id' | 'comparePassword' >) {
    const user = new User(data);
    return await user.save();
  }

   async updateUser(id: string, updateData: Partial<IUser>) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }
} 