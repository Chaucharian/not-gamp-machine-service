import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase from 'firebase-admin';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    firebase.initializeApp({
      credential: firebase.credential.cert(configService.get('firebase')),
      databaseURL: 'https://not-gamp-machine.firebaseio.com',
    });

    // this.writeSensorData(100, 100);
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

  getHello(): string {
    return 'Hello World!';
  }
}
