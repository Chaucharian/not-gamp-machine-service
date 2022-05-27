import { HttpException, Injectable, Logger } from '@nestjs/common';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { CronManager } from '../crons/CronManager';
import { CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SensorsService {
  private sensors = {
    conditions: {
      temperature: 0,
      humidity: 0,
    },
    waterPump: {
      distance: 0,
    },
  };
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
    private http: HttpService,
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(configService.get('firebase')),
      databaseURL: 'https://not-gamp-machine.firebaseio.com',
    });

    // cronManager.addCronJob(
    //   'save_conditions',
    //   CronExpression.EVERY_2_HOURS,
    //   () => this.writeSensorData(),
    // );
    cronManager.addCronJob(
      'check_water_pump',
      CronExpression.EVERY_5_SECONDS,
      async () => {
        const { distance } = this.getSensor('waterPump');
        if (distance <= 30) {
          const URL = `${process.env.API_URL}/api/${process.env.API_VERSION}`;
          // const response: any = await this.http
          //   .post(`${URL}/enviroment/power/1`, { status: 1 })
          //   .toPromise()
          //   .then(({ data }) => console.log('eee', data))
          //   .catch((error) => {
          //     console.log('ERROR', error);
          //     const data = error?.response?.data;
          //     throw new HttpException(data?.message, data?.statusCode ?? 500);
          //   });
        }
      },
    );
  }

  public getMeasurements() {
    return this.sensors;
  }

  public getSensor(type: string) {
    return this.sensors[type];
  }

  public setConditions({ temperature, humidity }) {
    this.sensors.conditions = { temperature, humidity };
  }

  public setWaterPump({ distance }) {
    this.sensors.waterPump = { distance };
  }

  public readSensorRange(from, to) {
    let chartData = [];
    return firebase
      .database()
      .ref('sensordata/data')
      .once('value')
      .then(function (snapshot) {
        const responseArray = Object.keys(snapshot.val());
        const filteredData = [];
        for (const index of responseArray) {
          filteredData.push(snapshot.val()[String(index)]);
        }
        chartData = filteredData.filter(
          (entry) => from <= entry.timestamp && entry.timestamp <= to,
        );
        return chartData;
      });
  }

  private writeSensorData() {
    const timestamp = Date.now();
    const { temperature, humidity } = this.sensors.conditions;

    firebase.database().ref('sensordata/data').push({
      temperature,
      humidity,
      timestamp,
    });

    this.logger.log(`Data sent to FireBase correctly at ${timestamp}`);
  }
}
