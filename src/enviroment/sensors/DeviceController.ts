import { Logger } from '@nestjs/common';
import { addMinutes, format } from 'date-fns';

export interface DeviceState {
  isOn?: boolean;
  /**
   * activeTime: a number representing minutes.
   */
  activeTime: number;
  inactiveTime: number;
  expirationTime: Date | number;
  startAt?: Date | number;
}

export interface DeviceControllerProps
  extends Omit<DeviceState, 'expirationTime'> {
  deviceName: string;
}

type ConditionCallback = () => boolean;

export class DeviceController {
  private state: DeviceState = {
    activeTime: 0,
    inactiveTime: 0,
    expirationTime: 0,
    isOn: false,
  };
  private deviceName: string;
  private conditions = [];
  private readonly logger = new Logger(DeviceController.name);

  constructor({
    deviceName,
    activeTime,
    inactiveTime,
    isOn = false,
    startAt,
  }: DeviceControllerProps) {
    if (!deviceName) {
      this.logger.error('DeviceController is missing deviceName');
      throw new Error('DeviceController is missing deviceName');
    }
    this.deviceName = deviceName;
    this.state.isOn = isOn;
    this.state.activeTime = activeTime;
    this.state.inactiveTime = inactiveTime;
    // Add this props to generate a range
    // this.state.startAt = startAt;
    // this.state.finishAt = finishAt;
    this.state.expirationTime = new Date(
      isOn
        ? addMinutes(Date.now(), activeTime)
        : addMinutes(Date.now(), inactiveTime),
    ).getTime();

    this.logger.log(
      `Device ${this.deviceName} setted up with this config ${JSON.stringify(
        this.state,
      )}`,
    );
  }

  public addCondition(condition: ConditionCallback) {
    this.conditions.push(condition);
  }

  public setStartingTime(startAt: Date | number) {
    this.state.expirationTime = new Date(
      addMinutes(startAt, this.state.inactiveTime),
    ).getTime();
  }

  public getState(
    currentState?: DeviceState,
    onValidateCondition?: ConditionCallback,
  ): DeviceState {
    const state = currentState ?? this.state;
    const { expirationTime, activeTime, inactiveTime } = state;
    const currentTime = Date.now();
    let newState = state;

    // this.conditions.forEach((condition) => {
    //   newState = condition(this.state);
    // });

    if (typeof onValidateCondition === 'function' && !onValidateCondition()) {
      newState.isOn = false;
      return newState;
    }

    if (currentTime >= expirationTime) {
      if (newState.isOn) {
        const expirationTime = new Date(
          addMinutes(currentTime, inactiveTime),
        ).getTime();
        newState.expirationTime = expirationTime;
        newState.isOn = false;
        this.logger.log(
          `Stoping ${this.deviceName}, next cycle at ${format(
            expirationTime,
            'pp',
          )}`,
        );
        return newState;
      }
      if (!newState.isOn) {
        const expirationTime = new Date(
          addMinutes(currentTime, activeTime),
        ).getTime();
        newState.expirationTime = expirationTime;
        newState.isOn = true;
        this.logger.log(
          `Starting ${this.deviceName}, finishind at ${format(
            expirationTime,
            'pp',
          )}`,
        );
        return newState;
      }
    }
    return newState;
  }
}
