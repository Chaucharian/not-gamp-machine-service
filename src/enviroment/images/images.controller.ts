import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ImagesController {
  constructor() {}

  @Get('/')
  getAllStatus(@Res() res: Response) {
    return res.send({ ok: 'images' });
  }
}
