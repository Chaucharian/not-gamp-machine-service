import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';
import { CronManager } from './crons/CronManager';
import { SensorsService } from './sensors/sensors.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EnviromentService {
  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
    private sensors: SensorsService,
    private http: HttpService,
  ) {}

  setEnviromentCycle(state: string) {
    // setLights();
    // setWaterPump()
  }
}

// CREATE ENV SETTING SCHEMA
// {

//   environment: {

//       cycle: "vegetive" | "flowering",
//   lights: {
//       range: ["07:00", "18:00"]
//   },
//   notifications: [{ message: "add nutrients", type: "urgent"}];
//   }

//   }
