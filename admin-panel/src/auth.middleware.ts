import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

interface CustomRequest extends Request {
  user: any; // Adjust the type of the `user` property accordingly
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }
      const decoded = this.jwtService.verify(token);
      const admin = await this.userService.validateAdmin(
        decoded.username,
        decoded.password,
      );
      if (!admin) {
        throw new UnauthorizedException('Invalid token');
      }
      req.user = admin;
      next();
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }
}
