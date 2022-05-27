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
  constructor(private sensorService: SensorsService) {}

  @Get('/')
  getMeasurements(@Res() res) {
    return res.send(this.sensorService.getMeasurements());
  }

  // This endpoint is to persist every sensor data by passing a clientId (sensor identifier) as Bearer
  @UseAuth()
  @Post('/')
  setMeasurements(@Req() req: any, @Res() res, @Body() payload) {
    // ideally using the clientId the payload data is mapped out  (i.e sensors[clientId] = payload)
    return this.sensorService.setConditions(payload);
  }

  @Get('/range')
  async getRawData(@Res() res: Response, @Query() params) {
    const { from, to } = params;
    const response = await this.sensorService.readSensorRange(from, to);
    return res.send(response);
  }
}
