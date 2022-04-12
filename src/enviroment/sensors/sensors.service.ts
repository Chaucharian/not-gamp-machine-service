import { Injectable } from '@nestjs/common';
import { SensorCron } from '../crons/sensor.cron';

@Injectable()
export class SensorsService {
  constructor() {
    console.log(new SensorCron());
  }

  getHello(): string {
    return 'Hello World!';
  }
}
