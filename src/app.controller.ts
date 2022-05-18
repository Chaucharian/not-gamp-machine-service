import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('app')
export class AppController {
  constructor() {}

  @Get('/')
  getHi(@Res() res: Response) {
    console.log('asdsad');
    return res.send({ message: 'Enviroment service working' });
  }
}
