import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { SensorCron } from '../crons/sensor.cron';

@Module({
  imports: [],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
