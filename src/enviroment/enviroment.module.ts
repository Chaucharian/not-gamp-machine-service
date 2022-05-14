import { Module } from '@nestjs/common';
import { SensorsModule } from './sensors/sensors.module';
import { ImagesModule } from './images/images.module';
import { EnviromentController } from './enviroment.controller';
import { PowerModule } from './power/power.module';

@Module({
  imports: [SensorsModule, ImagesModule, PowerModule],
  controllers: [EnviromentController],
})
export class EnviromentModule {}
