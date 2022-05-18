import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Query,
  Delete,
  Put,
  UsePipes,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseAuth()
  // @Get('/login')
  // async token(@Req() req: any) {
  //   return { ...req?.user };
  // }
}
