import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];

    if (!bearerToken) {
      throw new UnauthorizedException('token is missing');
    }

    const [, token] = bearerToken.split('Bearer ');
    try {
      // const user = await this.authService.getDecive(token);
      request.client = token;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
