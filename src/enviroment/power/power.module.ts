import { Module } from '@nestjs/common';
import { PowerService } from './power.service';
import { PowerController } from './power.controller';
import { SensorCron } from '../crons/sensor.cron';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/configuration';
import { CronManager } from '../crons/CronManager';
import { CronModule } from '../crons/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CronModule,
  ],
  controllers: [PowerController],
  providers: [PowerService],
})
export class PowerModule {}
