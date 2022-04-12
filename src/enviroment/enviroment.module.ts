import { Module } from '@nestjs/common';
import { SensorsModule } from './sensors/sensors.module';
import { ImagesModule } from './images/images.module';
import { EnviromentController } from './enviroment.controller';

@Module({
  imports: [SensorsModule, ImagesModule],
  controllers: [EnviromentController],
})
export class EnviromentModule {}
