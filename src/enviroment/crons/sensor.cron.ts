import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { SensorsService } from '../sensors/sensors.service';

@Injectable()
export class SensorCron {
  private readonly logger = new Logger(SensorCron.name);

  //   @Interval(900 * 1000 * 8) // 2hs
  @Interval(1000) // 2hs
  writeData(data) {
    this.logger.debug('EEE', data);
  }
}
