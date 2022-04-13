import { Injectable } from '@nestjs/common';
import { SensorCron } from '../crons/sensor.cron';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SensorsService {
  constructor(private configService: ConfigService) {
    console.log(new SensorCron());
    firebase.initializeApp({
      credential: firebase.credential.cert(configService.get('firebase')),
      databaseURL: 'https://not-gamp-machine.firebaseio.com',
    });
  }

  readSensorRange(from, to) {
    let chartData = [];
    return firebase
      .database()
      .ref('sensordata/data')
      .once('value')
      .then(function (snapshot) {
        const responseArray = Object.keys(snapshot.val());
        let filteredData = [];
        for (let index of responseArray) {
          filteredData.push(snapshot.val()[String(index)]);
        }
        chartData = filteredData.filter(
          (entry) => from <= entry.timestamp && entry.timestamp <= to,
        );
        return chartData;
      });
  }

  writeSensorData(temperature, humedity) {
    const timestamp = Date.now();
    firebase.database().ref('sensordata/data').push({
      temperature,
      humedity,
      timestamp,
    });
    console.log(`Data sent to FireBase correctly at ${timestamp}`);
  }
}
