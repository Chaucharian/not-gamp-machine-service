import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class SensorsController {
  private humedity = '0%';
  private temperature = '0%';
  constructor() {}

  @Get('/')
  getRawData(@Res() res: Response) {
    return res.send({ humedity: this.humedity, temperature: this.temperature });
  }

  @Post('/')
  setRawData(@Res() res, @Body() payload: any) {
    const { h, t } = payload;
    this.humedity = h;
    this.temperature = t;
    return res.send({ message: 'ok' });
  }
}
