import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CronModule } from './crons/cron.module';
import { CronManager } from './crons/CronManager';
import { EnviromentModule } from './enviroment.module';
import { EnviromentService } from './enviroment.service';
import { SensorsService } from './sensors/sensors.service';

@Controller()
export class EnviromentController {
  constructor(
    private enviromentService: EnviromentService,
    private cronService: CronManager,
  ) {}

  @Get('/')
  getAllStatus(@Res() res: Response) {
    return res.send({ message: 'Enviroment service working' });
  }

  @Get('/history/:id')
  async getHistory(@Res() res: Response, @Param('id') environmentId: string) {
    const response = await this.enviromentService.getHistory(environmentId);
    return res.send(response);
  }
}
