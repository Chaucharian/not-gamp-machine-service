// import { addMinutes, format } from 'date-fns';

// const waterPump = new DeviceRunner(123, 131);

// waterPump.addCondition((state) => {
//   let newState = state;
//   if (waterLevel >= minWaterLevel) {
//     console.log(
//       `minimum water level reached shutting down! ${format(
//         expirationTime,
//         'pp',
//       )}, please fill it up asshole!`,
//     );
//     irrigation.isOn = false;
//     return;
//   }
// });
// waterPump.onChange((newState) => request(newState));

// export class DeviceRunner {
//   private activeTime = 0;
//   private inactiveTime = 0;

//   onChange(newState) {}

//   constructor(activeTime, inactiveTime) {
//     // be able to change state on/off
//     // be able to run on intervals
//     // initial off

//     const irrigation = {
//       waterLevel: 5, // 27 = close to water pump
//       isOn: false,
//       expirationTime: new Date(addMinutes(Date.now(), 1)).getTime(), // next time to change state
//       minWaterLevel: 27, // min level allowed, this triggres system shutdown
//       intervalTime: 1, // how much time to wait
//       workingTime: 1, // how much time it must run
//     };

//     function shouldRunIrrigation() {
//       const {
//         isOn,
//         waterLevel,
//         minWaterLevel,
//         expirationTime,
//         workingTime,
//         intervalTime,
//       } = irrigation;
//       const currentTime = Date.now();

//       if (waterLevel >= minWaterLevel) {
//         console.log(
//           `minimum water level reached shutting down! ${format(
//             expirationTime,
//             'pp',
//           )}, please fill it up asshole!`,
//         );
//         irrigation.isOn = false;
//         return;
//       }

//       // 60min off  / 5min on
//       if (currentTime >= expirationTime) {
//         if (isOn) {
//           const expirationTime = new Date(
//             addMinutes(currentTime, intervalTime),
//           ).getTime();
//           irrigation.expirationTime = expirationTime;
//           irrigation.isOn = false;
//           console.log(
//             `Stoping irrigation, next irrigation cycle at ${format(
//               expirationTime,
//               'pp',
//             )}`,
//           );
//           return;
//         }
//         if (!isOn) {
//           const expirationTime = new Date(
//             addMinutes(currentTime, workingTime),
//           ).getTime();
//           irrigation.expirationTime = expirationTime;
//           irrigation.isOn = true;
//           console.log(
//             `Starting irrigation, finishind at ${format(expirationTime, 'pp')}`,
//           );
//           return;
//         }
//       }
//     }

//     setInterval(() => {
//       shouldRunIrrigation();
//       console.log(irrigation.isOn);
//       console.log(irrigation.waterLevel);
//     }, 5000);

//     setInterval(() => {
//       irrigation.waterLevel += 1;
//     }, 10000);
//   }
// }
