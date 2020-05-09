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
  { beam: 1, beemColor: Beam.Color.White, center: { tilt: 128, pan:  10},  radius: 2, step: 0, frost: 0, prism: 0, focus: 128 },
  { beam: 2, beemColor: Beam.Color.Blue,  center: { tilt: 60,  pan: 106},  radius: 5, step: 30, frost: 255, prism: 255, focus: 255 },
  { beam: 3, beemColor: Beam.Color.Blue,  center: { tilt: 70,  pan: 112},  radius: 5, step: -30, frost: 255, prism: 255, focus: 255 },
  { beam: 4, beemColor: Beam.Color.Blue,  center: { tilt: 75,  pan: 118},  radius: 5, step: 30, frost: 255, prism: 255, focus: 255 },
  { beam: 5, beemColor: Beam.Color.Blue,  center: { tilt: 75,  pan: 136},  radius: 5, step: -30, frost: 255, prism: 255, focus: 255 },
  { beam: 6, beemColor: Beam.Color.Blue,  center: { tilt: 70,  pan: 142},  radius: 5, step: 30, frost: 255, prism: 255, focus: 255 },
  { beam: 7, beemColor: Beam.Color.Blue,  center: { tilt: 60,  pan: 148},  radius: 5, step: -30, frost: 255, prism: 255, focus: 255 },
  { beam: 8, beemColor: Beam.Color.White, center: { tilt: 128, pan: 10},   radius: 2, step: 0, frost: 0, prism: 0, focus: 128 },
];

/////////////////////////////////////////////////////////////////////////////

const beamStartTime = "20:00:00";
const beamStopTime  = "23:30:00";

// time between beam movements in milliseconds
let stepInterval = 500;

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
    //const beamIndex = Math.round(Math.random()*6.1) + 1;
    for (let beamIndex=0; beamIndex < 8; beamIndex++)
    {
      if (Math.random() > 0.3) {
        moveBeam(beamIndex);
        message += beamIndex;
      }
      else
      {
        message += " ";
      }
    }
    //process.stdout.write('\x1b[0G');
    process.stdout.write(message + '\x1b[0G');
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

  let angle = (status) ? (status.angle + config.step) : 0;
  if (angle >= 360) {
    angle = 0;
  }

  status = { angle };
  beamStatus[beamNumber] = status;

  const angleInRadians = (angle*Math.PI)/180;
  const pan = Math.round(config.center.pan + Math.cos(angleInRadians) * config.radius);
  const tilt = Math.round(config.center.tilt + Math.sin(angleInRadians) * config.radius);

  // console.log(`   - offset x=${pan - config.center.pan}  y=${tilt - config.center.tilt}`); 

  beamChannelData[Beam.Channel.Pan] = pan;
  beamChannelData[Beam.Channel.Tilt] = tilt;

  beamChannelData[Beam.Channel.ColorWheel] = config.beemColor;
  beamChannelData[Beam.Channel.Focus] = config.focus;
  beamChannelData[Beam.Channel.Prism] = config.prism;
  beamChannelData[Beam.Channel.Frost] = config.frost;

  sendBeamChannelData(beamNumber, beamChannelData);
}
