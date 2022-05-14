import { Body, Controller, Get, Param, Query, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { SensorsService } from './sensors.service';

@Controller()
export class SensorsController {
  private data = { distance: 0 };
  constructor(private sensorService: SensorsService) {}

  @Get('/range')
  async getRawData(@Res() res: Response, @Query() params) {
    const { from, to } = params;
    const response = await this.sensorService.readSensorRange(from, to);
    return res.send(response);
  }

  @Get('/')
  getMeasurements(@Res() res) {
    return res.send(this.data);
    // return res.send(this.sensorService.getMeasurements());
  }

  @Post('/')
  setMeasurements(@Res() res, @Body() payload) {
    const { temperature, humidity, distance } = payload;
    this.data = { distance };
    // console.log('DATA', payload);
    // return res.send(
    //   this.sensorService.setMeasurements({ temperature, humidity }),
    // );
  }
}
