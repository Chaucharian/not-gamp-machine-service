import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { send } from 'process';
import { UseAuth } from 'src/decorators/UseAuth';
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

  // This endpoint is to persist every sensor data by passing a clientId (sensor identifier) as Bearer
  @UseAuth()
  @Post('/')
  setMeasurements(@Req() req: any, @Res() res, @Body() payload) {
    this.data = { ...this.data, ...payload };
    return res.send(this.data);
    // console.log('DATA', payload);
    // return res.send(
    //   this.sensorService.setMeasurements({ temperature, humidity }),
    // );
  }
}
