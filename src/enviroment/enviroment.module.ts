import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SensorsModule } from './sensors/sensors.module';
import { ImagesModule } from './images/images.module';
import { EnviromentController } from './enviroment.controller';
import { PowerModule } from './power/power.module';
import { EnviromentService } from './enviroment.service';
import { ConfigModule } from '@nestjs/config';
import config from '../config/configuration';
import { CronModule } from './crons/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    // ImagesModule,
    PowerModule,
    HttpModule,
    CronModule,
    SensorsModule,
  ],
  providers: [EnviromentService],
  controllers: [EnviromentController],
})
export class EnviromentModule {}
