import { addMinutes, format } from 'date-fns';

export class DeviceController {
  private state = {
    activeTime: 0,
    inactiveTime: 0,
    expirationTime: 0,
    isOn: false,
  };
  private conditions = [];

  constructor(activeTime: number, inactiveTime: number, isOn = false) {
    this.state.isOn = isOn;
    this.state.activeTime = activeTime;
    this.state.inactiveTime = inactiveTime;
    this.state.expirationTime = inactiveTime;
  }

  public addCondition(condition) {
    this.conditions.push(condition);
  }

  public getState() {
    const { expirationTime, activeTime, inactiveTime } = this.state;
    const currentTime = Date.now();
    let newState = null;

    this.conditions.forEach((condition) => {
      newState = condition(this.state);
    });

    if (newState === null) {
      newState = { ...this.state };
      if (currentTime >= expirationTime) {
        if (newState.isOn) {
          const expirationTime = new Date(
            addMinutes(currentTime, inactiveTime),
          ).getTime();
          newState.expirationTime = expirationTime;
          newState.isOn = false;
          console.log(
            `Stoping irrigation, next irrigation cycle at ${format(
              expirationTime,
              'pp',
            )}`,
          );
          return;
        }
        if (!newState.isOn) {
          const expirationTime = new Date(
            addMinutes(currentTime, activeTime),
          ).getTime();
          newState.expirationTime = expirationTime;
          newState.isOn = true;
          console.log(
            `Starting irrigation, finishind at ${format(expirationTime, 'pp')}`,
          );
          return;
        }
      }
    }

    return newState;
  }
}
