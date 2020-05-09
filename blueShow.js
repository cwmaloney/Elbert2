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
  { beam: 1, beemColor: Beam.Color.White, center: { tilt: 128, pan:  10},  radius: 2, speed: 0, frost: 0, prism: 0, focus: 128 },
  { beam: 2, beemColor: Beam.Color.Blue,  center: { tilt: 60,  pan: 106},  radius: 4, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 3, beemColor: Beam.Color.Blue,  center: { tilt: 70,  pan: 112},  radius: 4, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 4, beemColor: Beam.Color.Blue,  center: { tilt: 75,  pan: 118},  radius: 4, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 5, beemColor: Beam.Color.Blue,  center: { tilt: 75,  pan: 136},  radius: 4, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 6, beemColor: Beam.Color.Blue,  center: { tilt: 70,  pan: 142},  radius: 4, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 7, beemColor: Beam.Color.Blue,  center: { tilt: 60,  pan: 148},  radius: 4, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 8, beemColor: Beam.Color.White, center: { tilt: 128, pan: 10},   radius: 2, speed: 0, frost: 0, prism: 0, focus: 128 },
];

/////////////////////////////////////////////////////////////////////////////

const beamStartTime = "20:30:00";
const beamStopTime  = "22:01:00";

// time between beam movements in milliseconds
let stepInterval = 1000;

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
    setTimeout(loop, timeout);
  }
  else
  {
    const beamIndex = Math.round(Math.random()*6.1) + 1;
    //moveBeam(beamIndex);
    // for (let beamIndex=0; beamIndex < 8; beamIndex++)
    // {
    //   moveBeam(beamIndex);
    // }
    //setTimeout(loop, stepInterval);
  }
}

/////////////////////////////////////////////////////////////////////////////

function logScene() {
  console.log("--", Date.now()/1000,
    " scene=", sceneIndex,
    " color=", beamChannelData[Beam.Channel.ColorWheel],
    " tilt=", beamChannelData[Beam.Channel.Tilt],
    " pan=", beamChannelData[Beam.Channel.Tilt],
    " lamp=", beamChannelData[Beam.Channel.Lamp]);
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
 
  let status = beamStatus[beamNumber];
  if (!status) {
    status = { angle:0 };
  }
  const config = beamConfig[beamNumber];

  let angle = status.angle + config.speed;

  if (angle >= 360) {
    angle = 0;
  }
  status.angle = angle;

  beamStatus[beamNumber] = status;

  const pan = config.center.pan + Math.cos(angle) * config.radius;
  const tilt = config.center.tilt + Math.sin(angle) * config.radius;

  beamChannelData[Beam.Channel.Pan] = pan;
  beamChannelData[Beam.Channel.Tilt] = tilt;

  beamChannelData[Beam.Channel.ColorWheel] = config.beemColor;
  beamChannelData[Beam.Channel.Focus] = config.focus;
  beamChannelData[Beam.Channel.Prism] = config.prism;
  beamChannelData[Beam.Channel.Frost] = config.frost;

  //sendBeamChannelData(0, beamChannelData);
  sendBeamChannelData(beamNumber, beamChannelData);
}
