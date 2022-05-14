import { Body, Controller, Get, Param, Query, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PowerService } from './power.service';

@Controller()
export class PowerController {
  private powerStatus = { outlet1: 0, outlet2: 0, outlet3: 0, outlet4: 0 };
  constructor(private sensorService: PowerService) {}

  @Get('/')
  async getPowerStatus(@Res() res: Response, @Query() params) {
    // const { from, to } = params;
    // const response = await this.sensorService.readSensorRange(from, to);
    console.log('asdsd');
    return res.send(this.powerStatus);
  }

  @Post('/')
  setPowerStatus(@Res() res, @Body() payload) {
    this.powerStatus = payload;
    return res.send('ok');
    // console.log('DATA', payload);
    // return res.send(
    //   this.sensorService.setMeasurements({ temperature, humidity }),
    // );
  }
}
