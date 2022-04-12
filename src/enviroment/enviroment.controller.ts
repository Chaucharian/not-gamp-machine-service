import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class EnviromentController {
  constructor() {}

  @Get()
  getAllStatus(@Res() res: Response) {
    return res.send({ message: 'Enviroment service working' });
  }
}
