import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];

    if (!bearerToken) {
      throw new UnauthorizedException('token is missing');
    }

    const [, token] = bearerToken.split('Bearer ');
    try {
      const client = await this.authService.getClient(token);
      request.client = client;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
