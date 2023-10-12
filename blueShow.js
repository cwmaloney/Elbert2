"use strict";

const { E131 } = require("./E131.js");
const { Beam, Washer, OutlinePixel } = require("./config.js");
const
  {
  parseTimeToMinutes,
  isTimeToShowBeams,
  checkBeamLampState,

  setDefaultBeamChannelData,
  sendBeamChannelData,
  sendBeamsChannelData,
  sendBeamsOn,
  sendBeamsOff,

  sendWasherChannelData,
  sendOutlineChannelData,

  } = require("./config-farmstead.js");

const beamConfig = [
  { beam: 1, beamColor: Beam.Color.White, center: { tilt: 100, pan: 127}, radius: 120, step:  0, frost:   0, prism:   0, prismRotation: Beam.PrismRotation.Off, focus: 128 },
  { beam: 2, beamColor: Beam.Color.Blue,  center: { tilt: 53,  pan: 123}, radius: 120, step:  1, frost: 255, prism: 255, prismRotation: Beam.PrismRotation.Fast, focus: 255 },
  { beam: 3, beamColor: Beam.Color.Blue,  center: { tilt: 60,  pan: 117}, radius: 120, step: -1, frost: 255, prism: 255, prismRotation: Beam.PrismRotation.Fast, focus: 255 },
  { beam: 4, beamColor: Beam.Color.Blue,  center: { tilt: 80,  pan: 120}, radius: 120, step:  1, frost: 255, prism: 255, prismRotation: Beam.PrismRotation.Fast, focus: 255 },
  { beam: 5, beamColor: Beam.Color.Blue,  center: { tilt: 70,  pan: 134}, radius: 120, step: -1, frost: 255, prism: 255, prismRotation: Beam.PrismRotation.Fast, focus: 255 },
  { beam: 6, beamColor: Beam.Color.Blue,  center: { tilt: 54,  pan: 138}, radius: 120, step:  1, frost: 255, prism: 255, prismRotation: Beam.PrismRotation.Fast, focus: 255 },
  { beam: 7, beamColor: Beam.Color.Blue,  center: { tilt: 50,  pan: 132}, radius: 120, step: -1, frost: 255, prism: 255, prismRotation: Beam.PrismRotation.Fast, focus: 255 },
  { beam: 8, beamColor: Beam.Color.White, center: { tilt: 100, pan: 127}, radius: 120, step:  0, frost:   0, prism:   0, prismRotation: Beam.PrismRotation.Off, focus: 128 },
];

/////////////////////////////////////////////////////////////////////////////

const beamStartTime = "20:30:00";
const beamStopTime  = "22:10:00";

// time between beam movements in milliseconds
let stepInterval = 2000;

/////////////////////////////////////////////////////////////////////////////

let beamState = "unknown";

const beamStartMinute = parseTimeToMinutes(beamStartTime);
const beamStopMinute = parseTimeToMinutes(beamStopTime);

/////////////////////////////////////////////////////////////////////////////

function loop()
{
  const temp = checkBeamLampState(beamState, beamStartMinute, beamStopMinute);
  beamState = temp.beamState;
  const timeout = temp.timeout;
  if (timeout)
  {
    console.log("Waiting for lamp...");
    setTimeout(loop, timeout);
  }
  else if (beamState == "off") {
    console.log("Sleeping...");
    setTimeout(loop, 10000);
  }
  else
  {
    let message = "";
    for (let beamIndex=0; beamIndex < 8; beamIndex++)
    {
      // if (Math.random() > 0.5)
      {
        moveBeam(beamIndex);
        message += beamIndex;
      }
      // else
      // {
      //   message += " ";
      // }
    }
    //console.log(message);
    //process.stdout.write(message + '\x1b[0G');
    setTimeout(loop, stepInterval);
  }
}

/////////////////////////////////////////////////////////////////////////////
// start the "show"

loop();

/////////////////////////////////////////////////////////////////////////////

let beamStatus = [];
// const directions = { N: 1, NE: 2, E: 3, SE: 4, S: 5, SW: 6, W: 7, NW: 8 };

// function setBeamStatus(beamNumber, status) {
//   beamsStatus[beamNumber] = status;
// }

// function getBeamStatus(beamNumber, status) {
//   return beamsStatus[beamNumber];
// }

function moveBeam(beamNumber)
{
  const beamChannelData = [];
  setDefaultBeamChannelData(beamChannelData);
  const config = beamConfig[beamNumber];

  let status = beamStatus[beamNumber];

  // let angle = (status) ? (status.angle + config.step) : 0;
  // if (angle >= 360) {
  //   angle = 0;
  // }
  //status = { angle };

  let step = (status) ? (status.step + 1) : 0;
  if (step > 3) {
    step = 0;
  }
  status = { step };

  beamStatus[beamNumber] = status;

  // const angleInRadians = (angle*Math.PI)/180;
  // const pan = Math.round(config.center.pan + Math.cos(angleInRadians) * config.radius);
  // const tilt = Math.round(config.center.tilt + Math.sin(angleInRadians) * config.radius);

  let pan = config.center.pan;
  let tilt = config.center.tilt;

  switch (step)
  {
    case 0:
      tilt += config.step;
      break;
    case 1:
      pan -= config.step;
      break;
    case 2:
      tilt -= config.step;
      break;
    case 3:
      pan += config.step;
      break
  }
  // console.log(`   - offset x=${pan - config.center.pan}  y=${tilt - config.center.tilt}`); 

  // const panFine = Math.round(127 + Math.cos(angleInRadians) * config.radius);
  // const tiltFine = Math.round(127 + Math.sin(angleInRadians) * config.radius);
  // console.log(`   - offset x=${panFine - 127}  y=${tiltFine - 127}`); 

  beamChannelData[Beam.Channel.Pan] = pan;
  beamChannelData[Beam.Channel.Tilt] = tilt;

  // beamChannelData[Beam.Channel.PanFine] = panFine;
  // beamChannelData[Beam.Channel.TiltFine] = tiltFine;

  beamChannelData[Beam.Channel.ColorWheel] = config.beamColor;
  beamChannelData[Beam.Channel.Focus] = config.focus;
  beamChannelData[Beam.Channel.Prism] = config.prism;
  beamChannelData[Beam.Channel.PrismRotation] = config.prismRotation;
  beamChannelData[Beam.Channel.Frost] = config.frost;

  sendBeamChannelData(beamNumber, beamChannelData);
}
