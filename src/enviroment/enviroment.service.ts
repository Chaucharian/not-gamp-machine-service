import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';
import { CronManager } from './crons/CronManager';
import { SensorsService } from './sensors/sensors.service';
import { HttpService } from '@nestjs/axios';
import firebase from 'firebase-admin';

@Injectable()
export class EnviromentService {
  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
    private http: HttpService,
  ) {}

  setEnviromentCycle(state: string) {
    // setLights();
    // setWaterPump()
  }

  public async getHistory(enviromentId: string) {
    return await firebase
      .database()
      .ref(`history/${enviromentId}`)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
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
