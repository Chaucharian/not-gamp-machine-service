import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { CronModule } from './crons/cron.module';
import { CronManager } from './crons/CronManager';
import { SensorsService } from './sensors/sensors.service';

@Controller('enviroment')
export class EnviromentController {
  constructor(
    private sensorService: SensorsService,
    private cronService: CronManager,
  ) {}

  @Get('/')
  getAllStatus(@Res() res: Response) {
    console.log('asdsad');
    return res.send({ message: 'Enviroment service working' });
  }
}
