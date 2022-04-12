import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class SensorsController {
  constructor() {}

  @Get('/')
  getAllStatus(@Res() res: Response) {
    return res.send({ ok: 'sensors' });
  }
}
