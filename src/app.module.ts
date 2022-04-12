import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnviromentModule } from './enviroment/enviroment.module';
import { ImagesModule } from './enviroment/images/images.module';
import { SensorsModule } from './enviroment/sensors/sensors.module';

@Module({
  imports: [
    ImagesModule,
    SensorsModule,
    EnviromentModule,
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
            path: '/images',
            module: ImagesModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
