import { HttpModule, Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnviromentModule } from './enviroment/enviroment.module';
import { ImagesModule } from './enviroment/images/images.module';
import { SensorsModule } from './enviroment/sensors/sensors.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { PowerModule } from './enviroment/power/power.module';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './enviroment/crons/cron.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [config],
    }),
    AuthModule,
    SensorsModule,
    PowerModule,
    ImagesModule,
    RouterModule.register([
      {
        path: '/enviroment',
        module: EnviromentModule,
        children: [
          {
            path: '/sensors',
            module: SensorsModule,
          },
          {
            path: '/power',
            module: PowerModule,
          },
          {
            path: '/images',
            module: ImagesModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
