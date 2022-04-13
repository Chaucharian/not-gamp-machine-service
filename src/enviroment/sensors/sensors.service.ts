import { Injectable, Logger } from '@nestjs/common';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { CronManager } from '../crons/CronManager';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class SensorsService {
  private measurements = {
    temperature: '0%',
    humidity: '0%',
  };
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(configService.get('firebase')),
      databaseURL: 'https://not-gamp-machine.firebaseio.com',
    });

    cronManager.addCronJob(
      'save_conditions',
      CronExpression.EVERY_2_HOURS,
      () => this.writeSensorData(),
    );
  }

  public getMeasurements() {
    return this.measurements;
  }
  public setMeasurements({ temperature, humidity }) {
    this.measurements = { temperature, humidity };
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
    const { temperature, humidity } = this.measurements;

    firebase.database().ref('sensordata/data').push({
      temperature,
      humidity,
      timestamp,
    });

    this.logger.log(`Data sent to FireBase correctly at ${timestamp}`);
  }
}
