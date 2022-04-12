import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class SensorsController {
  constructor() {}

  // @Get('/conditions')
  // getAllStatus(@Res() res: Response) {
  //   return res.send({ humedity, temperature });
  // }
}
