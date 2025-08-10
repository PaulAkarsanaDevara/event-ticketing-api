/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'tsyringe';
import { AuthService } from "./auth.service";
import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';

@injectable()
export class AuthController {
  constructor(@inject('AuthService') private readonly authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const data = await this.authService.register(req.body);
      console.log({data})
      res.status(201).json({ message: "User registered", data });
    } catch (err: any) {
       res.status(400).json({ error: err.message });
    }
  }

   async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
      res.json({ message: "Login success", data });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const data = await this.authService.refresh(refreshToken);
      res.json({ message: "Token refreshed", data });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }
  
  async logout(req: AuthRequest, res: Response) {
    try {
      const data = await this.authService.logout(req.user.userId);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

}