import { Body, Controller, Get, Param, Query, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PowerService } from './power.service';

@Controller()
export class PowerController {
  private powerStatus = { outlet1: 0, outlet2: 0, outlet3: 0, outlet4: 0 };
  constructor(private sensorService: PowerService) {}

  @Get('/')
  getPowerStatus(@Res() res: Response) {
    console.log('EEEEEE');
    return res.send(this.powerStatus);
  }

  @Post(':outledId')
  setPowerStatus(
    @Res() res,
    @Param('outledId') outledId: string,
    @Body() payload,
  ) {
    console.log('EE');
    const newStatus = {
      ...this.powerStatus,
      [`outlet${outledId}`]: payload.status,
    };
    this.powerStatus = newStatus;
    return res.send(newStatus);
  }
}
