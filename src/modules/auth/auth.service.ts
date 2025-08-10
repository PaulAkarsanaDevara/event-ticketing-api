import jwt, { SignOptions } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { UserService } from "../users/user.service";
import { IUser } from "../../interfaces/user.interface";

@injectable()
export class AuthService {
  constructor(@inject('UserService') private readonly userService: UserService) {}

  async generateTokens(payload: object): Promise<{ accessToken: string; refreshToken: string }> {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured in environment variables");
    }

    const accessOptions: SignOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    };

    const refreshOptions: SignOptions = {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, accessOptions);
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, refreshOptions);

    return { accessToken, refreshToken };
  }

  async register(data: Omit<IUser, '_id' | 'comparePassword'>) {
    const { email } = data;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new Error('Email already registered');

    return this.userService.createUser(data);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await user.comparePassword(password);    
    if (!isMatch) throw new Error('Invalid credentials');
    
    const { accessToken, refreshToken } = await this.generateTokens({ userId: user._id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };

  }

  async refresh(token: string) {
    if (!token) throw new Error("No refresh token provided");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch {
      throw new Error("Invalid refresh token");
    }

    const user = await this.userService.findById(payload.userId);
    if (!user || user.refreshToken !== token) throw new Error("Invalid refresh token");

    const { accessToken, refreshToken } = await this.generateTokens({ userId: user._id, role: user.role });
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.userService.updateUser(userId, { refreshToken: null });
    return { message: "Logged out successfully" };
  }

}