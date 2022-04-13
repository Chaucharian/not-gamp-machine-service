import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { SensorCron } from '../crons/sensor.cron';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/conifg';
import { CronManager } from '../crons/CronManager';
import { CronModule } from '../crons/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CronModule,
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
