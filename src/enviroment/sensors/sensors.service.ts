import {
  HttpException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { CronManager } from '../crons/CronManager';
import { CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { DeviceController } from './DeviceController';
import { addMinutes, format } from 'date-fns';

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

interface Devices {
  irrigation: DeviceController | null;
}

@Injectable()
export class SensorsService implements OnModuleInit {
  private sensors = {
    conditions: {
      temperature: 0,
      humidity: 0,
      distance: 0,
    },
  };
  private devices: Devices = {
    irrigation: null,
  };
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    private configService: ConfigService,
    private cronManager: CronManager,
    private http: HttpService,
  ) {}
  onModuleInit() {
    this.init();
  }

  private async init() {
    await this.initializeDevices();
    this.initializeCrons();
  }

  private async initializeDevices() {
    const { activeTime, inactiveTime, isOn, minWaterLevel } = await firebase
      .database()
      .ref('environment/irrigation')
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });

    this.devices.irrigation = new DeviceController({
      deviceName: 'Irrigation',
      activeTime,
      inactiveTime,
      isOn,
    });
    const initialState = this.devices.irrigation.getState();

    await firebase
      .database()
      .ref(`environment/irrigation`)
      .set({
        minWaterLevel,
        ...initialState,
      });
  }

  private initializeCrons() {
    this.cronManager.addCronJob(
      'save_current_conditions',
      CronExpression.EVERY_5_SECONDS,
      () => this.storeConditions(),
    );
    this.cronManager.addCronJob(
      'save_history_conditions',
      CronExpression.EVERY_2_HOURS,
      () => this.storeConditionsHistory(),
    );
    this.cronManager.addCronJob(
      'check_irrigation',
      // CronExpression.EVERY_MINUTE,
      CronExpression.EVERY_5_SECONDS,
      async () => await this.checkIrrigation(),
    );
    // this.cronManager.addCronJob(
    //   'check_lights',
    //   CronExpression.EVERY_HOUR,
    //   async () => {
    //     // check current cycle (vegetative/ )
    //     const URL = `${process.env.API_URL}/api/${process.env.API_VERSION}`;
    //     // const response: any = await this.http
    //     //   .post(`${URL}/enviroment/power/1`, { status: 1 })
    //     //   .toPromise()
    //     //   .then(({ data }) => console.log('eee', data))
    //     //   .catch((error) => {
    //     //     console.log('ERROR', error);
    //     //     const data = error?.response?.data;
    //     //     throw new HttpException(data?.message, data?.statusCode ?? 500);
    //     //   });
    //     // }
    //   },
    // );
    this.logger.log(`Crons initialized`);
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
    const { distance: waterLevel } = this.sensors.conditions;
    const irrigationResponse = await firebase
      .database()
      .ref('environment/irrigation')
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });

    const newIrrigationState = this.devices.irrigation.getState(
      irrigationResponse,
      function onValidateCondition() {
        if (waterLevel >= irrigationResponse.minWaterLevel) {
          console.log(
            `minimum water level reached shutting down! ${format(
              new Date().getTime(),
              'pp',
            )}, please fill it up asshole!`,
          );
          return false;
        }
        return true;
      },
    );

    await firebase
      .database()
      .ref(`environment/irrigation`)
      .set({
        ...irrigationResponse,
        expirationTime: newIrrigationState.expirationTime,
        isOn: newIrrigationState.isOn,
      });
  }

  private minutesToMillisecons(data) {
    return 1000 * 60 * data;
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
    const environmentId = await this.getCurrentEnviromentId();

    firebase
      .database()
      .ref(`environment/conditions`)
      .set({
        ...this.sensors.conditions,
      });

    this.logger.log(`Current conditions stored on enviroment ${environmentId}`);
  }

  private async storeConditionsHistory() {
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
