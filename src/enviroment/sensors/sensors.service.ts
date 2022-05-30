import { HttpException, Injectable, Logger } from '@nestjs/common';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { CronManager } from '../crons/CronManager';
import { CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';

enum POWER_OUTLET_IDS {
  IRRIGATION = 1,
  LIGHTS = 2,
  FANS = 3,
  OTHER = 4,
}
enum POWER_OUTLET_STATUS {
  ON = 1,
  OFF = 0,
}
@Injectable()
export class SensorsService {
  private sensors = {
    irrigation: {
      lastStartTime: 0,
      runEveryMinutes: 60,
      workingTime: 5,
      distance: 0,
      minWaterLevel: 0,
      isOn: false,
    },
    conditions: {
      temperature: 0,
      humidity: 0,
    },
  };
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
    private http: HttpService,
  ) {
    this.initializeCrons();
    this.logger.log(`Crons initialized`);
  }

  private initializeCrons() {
    this.cronManager.addCronJob(
      'save_conditions',
      CronExpression.EVERY_2_HOURS,
      () => this.storeConditions(),
    );
    this.cronManager.addCronJob(
      'check_irrigation',
      // CronExpression.EVERY_MINUTE,
      CronExpression.EVERY_5_SECONDS,
      async () => await this.checkIrrigation(),
    );
    this.cronManager.addCronJob(
      'check_lights',
      CronExpression.EVERY_HOUR,
      async () => {
        // check current cycle (vegetative/ )
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
        // }
      },
    );
  }

  public getMeasurements() {
    return this.sensors;
  }

  public setConditions({ client, payload }) {
    this.sensors[client.clientName] = {
      ...this.sensors[client.clientName],
      ...payload,
    };
    return this.sensors[client.clientName];
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

  private async checkIrrigation() {
    const { lastStartTime, runEveryMinutes, workingTime, minWaterLevel, isOn } =
      await firebase
        .database()
        .ref('environment/irrigation')
        .once('value')
        .then((snapshot) => {
          return snapshot.val();
        });

    const { distance: waterLevel } = this.sensors.irrigation;

    if (isOn) {
      if (Number(waterLevel) <= minWaterLevel) {
        this.changePowerOutletState(
          POWER_OUTLET_IDS.IRRIGATION,
          POWER_OUTLET_STATUS.OFF,
        );
      } else {
        const currentTime = Date.now();
        const shouldTurnOff =
          currentTime - lastStartTime >= this.minutesToMillisecons(workingTime);

        if (shouldTurnOff) {
          this.changePowerOutletState(
            POWER_OUTLET_IDS.IRRIGATION,
            POWER_OUTLET_STATUS.OFF,
          );
        }
        const newIrrigationData = {
          ...this.sensors.irrigation,
          lastStartTime: currentTime,
          isOn: false,
        };
        this.sensors.irrigation = newIrrigationData;

        await firebase
          .database()
          .ref(`environment/irrigation`)
          .set(newIrrigationData);
      }
    } else {
      const currentTime = Date.now();
      const shouldTurnOn =
        currentTime - lastStartTime >=
        this.minutesToMillisecons(runEveryMinutes);

      if (shouldTurnOn) {
        const newIrrigationData = {
          ...this.sensors.irrigation,
          lastStartTime: currentTime,
          isOn: true,
        };
        this.sensors.irrigation = newIrrigationData;

        await firebase
          .database()
          .ref(`environment/irrigation`)
          .set(newIrrigationData);

        this.changePowerOutletState(
          POWER_OUTLET_IDS.IRRIGATION,
          POWER_OUTLET_STATUS.ON,
        );
      }
    }
  }

  private minutesToMillisecons(data) {
    return 1000 / 60 / data;
  }

  private async changePowerOutletState(outledId: number, status = 0) {
    const URL = `${process.env.API_URL}/api/${process.env.API_VERSION}`;
    return await this.http
      .post(`${URL}/enviroment/power/${outledId}`, { status })
      .toPromise()
      .then(({ data }) => console.log('response', data))
      .catch((error) => {
        console.log('ERROR', error);
        const data = error?.response?.data;
        throw new HttpException(data?.message, data?.statusCode ?? 500);
      });
  }

  private async getCurrentEnviromentId() {
    let id = null;
    await firebase
      .database()
      .ref('environment')
      .once('value')
      .then((snapshot) => {
        const { id: ID } = snapshot.val();
        id = ID;
      });
    return id;
  }

  private async storeConditions() {
    const timestamp = Date.now();
    const { temperature, humidity } = this.sensors.conditions;
    const environmentId = await this.getCurrentEnviromentId();

    firebase.database().ref(`history/${environmentId}`).push({
      temperature,
      humidity,
      timestamp,
    });

    this.logger.log(
      `Conditions stored on enviroment ${environmentId} correctly at ${timestamp}`,
    );
  }
}
