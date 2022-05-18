import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { SensorCron } from '../crons/sensor.cron';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/configuration';
import { CronManager } from '../crons/CronManager';
import { CronModule } from '../crons/cron.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    HttpModule,
    CronModule,
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
