"use strict";

const { E131 } = require("./E131.js");
const { Beam, Washer, OutlinePixel } = require("./config.js");
const
  {
  parseTimeToMinutes,
  isTimeToShowBeams,
  checkBeamLampState,

  setDefaultBeamChannelData,
  sendBeamsChannelData,
  sendBeamsOn,
  sendBeamsOff,

  sendWasherChannelData,
  sendOutlineChannelData,

  } = require("./config-farmstead.js");


const testScenes = [
  { tilt: 25, beemColor: Beam.Color.White,  pan: { start: 80, stop: 150, step:  1 }, pixelColor1: "Black", pixelColor2: "White" },
  { tilt: 25, beemColor: Beam.Color.Red,    pan: { start: 80, stop: 150, step:  2 }, pixelColor1: "Black", pixelColor2: "Red" },
  { tilt: 25, beemColor: Beam.Color.Orange, pan: { start: 80, stop: 150, step:  4 }, pixelColor1: "Black", pixelColor2: "Orange" },
  { tilt: 25, beemColor: Beam.Color.Yellow, pan: { start: 80, stop: 150, step:  8 }, pixelColor1: "Black", pixelColor2: "Yellow" },
  { tilt: 25, beemColor: Beam.Color.Green,  pan: { start: 80, stop: 150, step: 10 }, pixelColor1: "Black", pixelColor2: "Green" },
  { tilt: 25, beemColor: Beam.Color.Blue,   pan: { start: 80, stop: 150, step: 13 }, pixelColor1: "Black", pixelColor2: "Blue" },
  { tilt: 25, beemColor: Beam.Color.Violet, pan: { start: 80, stop: 150, step: 16 }, pixelColor1: "Black", pixelColor2: "Violet" },
  { tilt: 25, beemColor: Beam.Color.Magenta,pan: { start: 80, stop: 150, step: 19 }, pixelColor1: "Black", pixelColor2: "Magenta" },
  { tilt: 25, beemColor: Beam.Color.Pink,   pan: { start: 80, stop: 150, step: 22 }, pixelColor1: "Black", pixelColor2: "Pink" },

  // confirmed - single color
  // { tilt: 25, beemColor:  0,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "White" },
  // { tilt: 25, beemColor: 10,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Red" },
  // { tilt: 25, beemColor: 20,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Orange" },
  // { tilt: 25, beemColor: 27,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Blue" }, // very pale blue
  // { tilt: 25, beemColor: 35,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Green" },
  // { tilt: 25, beemColor: 45,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow" }, // pale yellow
  // { tilt: 25, beemColor: 55,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Lavender" },
  // { tilt: 25, beemColor: 60,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Pink"  },
  // { tilt: 25, beemColor: 70,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow"  },
  // { tilt: 25, beemColor: 80,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Magenta"  },
  // { tilt: 25, beemColor: 87,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Cyan" }, // Cyan
  // { tilt: 25, beemColor: 120, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  },

  // confirmed - two color
  // { tilt: 25, beemColor:  5,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Red" }, // white & red
  // { tilt: 25, beemColor: 15,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Red" }, // red & orange
  // { tilt: 25, beemColor: 25,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow" }, // orange & pale blue
  // { tilt: 25, beemColor: 30,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow" }, // pale blue & green
  // { tilt: 25, beemColor: 40,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Green" }, // green & yellow
  // { tilt: 25, beemColor: 50,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow" }, // yellow & lavender
  // { tilt: 25, beemColor: 65,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Lavender" }, // pink & yellow 
  // { tilt: 25, beemColor: 75,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow" }, // yellow & magenta 
  // { tilt: 25, beemColor: 85,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Magenta" }, // magenta & cyan
  // { tilt: 25, beemColor: 90,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Cyan"  }, // cyan & yellow

  // yuck
  // { tilt: 25, beemColor: 95,  pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow" },  // yellow
  // { tilt: 25, beemColor: 100, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Yellow"  }, // yellow & pale brown
  // { tilt: 25, beemColor: 105, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Brown"  },  // pale brown
  // { tilt: 25, beemColor: 110, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // pale brown & ?
  // { tilt: 25, beemColor: 115, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
  // { tilt: 25, beemColor: 120, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
  // { tilt: 25, beemColor: 125, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
  // { tilt: 25, beemColor: 130, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
  // { tilt: 25, beemColor: 135, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
  // { tilt: 25, beemColor: 140, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
  // { tilt: 25, beemColor: 145, pan: { start: 50, stop: 80, step: 1 }, pixelColor: "Purple"  }, // yuck
];

const halloweenScenes = [
  { tilt: 25, beemColor: Beam.Color.Magenta,  pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Orange", pixelColor2: "Magenta" },
  { tilt: 72, beemColor: Beam.Color.Orange,   pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Magenta", pixelColor2: "Orange"  },
  { tilt: 36, beemColor: Beam.Color.Red,      pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Orange", pixelColor2: "Red" },
  { tilt: 48, beemColor: Beam.Color.Blue,     pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Red", pixelColor2: "Blue" },
  { tilt: 30, beemColor: Beam.Color.Violet,   pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Blue", pixelColor2: "Violet" },
  { tilt: 40, beemColor: Beam.Color.Green,    pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Violet", pixelColor2: "Green"  },
  { tilt: 84, beemColor: Beam.Color.White,    pan: { start: 5, stop: 190, step: 1 }, pixelColor1: "Black", pixelColor2: "Orange"  },
];


const valentineScenes = [
  { tilt: 36, beemColor: Beam.Color.Red,      pan: { start: 90, stop: 150, step: 1 }, pixelColor1: "White", pixelColor2: "Red" },
  { tilt: 75, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160, step: 1 }, pixelColor1: "Red", pixelColor2: "White"  },
  { tilt: 48, beemColor: Beam.Color.Magenta,  pan: { start: 90, stop: 150, step: 1 }, pixelColor1: "White", pixelColor2: "Magenta" },
  { tilt: 90, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160, step: 1 }, pixelColor1: "Magenta", pixelColor2: "White"  },
  { tilt: 28, beemColor: Beam.Color.Pink,     pan: { start: 90, stop: 150, step: 1 }, pixelColor1: "White", pixelColor2: "Pink" },
  { tilt: 75, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160, step: 1 }, pixelColor1: "Pink", pixelColor2: "White"  },
  { tilt: 72, beemColor: Beam.Color.Violet,   pan: { start: 90, stop: 150, step: 1 }, pixelColor1: "White", pixelColor2: "Violet"  },
  { tilt: 90, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160, step: 1 }, pixelColor1: "Violet", pixelColor2: "White"  },
];


const blueScene = [
  { beam: 1, beemColor: Beam.Color.White, center: { tilt: 90, pan: 150}, radius: 10, speed: 1, frost: 255, prism: 255, focus: 255 },
  { beam: 2, beemColor: Beam.Color.Blue,  center: { tilt: 50, pan: 90}, radius: 10, speed: 1, frost: 255, prism: 255, focus: 255 },
];

/////////////////////////////////////////////////////////////////////////////
// all data that changes to choose a show should be in this section

const beamStartTime = "19:30:00";
const beamStopTime  = "22:00:00";

const runBeams = true;
const runOutline = true;
const runWashers = true;

let scenes = valentineScenes;

let sceneStartTimeout = 2000;
// time between beam movements in milliseconds
let stepInterval = 125;

/////////////////////////////////////////////////////////////////////////////

// current step index
let sceneIndex = -1;

// pan limits for current scene
let panStart = 0;
let panStop = 160;
let panStep = 1;

let panValue = panStart;
let panCount = 0;

let beamChannelData = [];

let beamState = "unknown";

const beamStartMinute = parseTimeToMinutes(beamStartTime);
const beamStopMinute = parseTimeToMinutes(beamStopTime);

/////////////////////////////////////////////////////////////////////////////

function setPanLimits(pan) {
  panStart = pan.start;
  panStop = pan.stop;
  panStep = pan.step;

  panValue = panStart;
  panCount = 0;

  beamChannelData[Beam.Channel.Pan] = panValue;
}

/////////////////////////////////////////////////////////////////////////////

function loop() {

  const temp = checkBeamLampState(beamState, beamStartMinute, beamStopMinute);
  beamState = temp.beamState;
  const timeout = temp.timeout;
  if (timeout)
  {
    setTimeout(loop, timeout);
  }
  else if (sceneIndex == -1)
  {
    nextScene();
    setTimeout(loop, sceneStartTimeout);
  }
  else
  {
    panCount++;
    panValue += panStep;
    
    if (panValue >= panStop) {
      nextScene();
      setTimeout(loop, sceneStartTimeout);
    } 

    beamChannelData[Beam.Channel.Pan] = panValue;
    updateShow();
    setTimeout(loop, stepInterval);
  }
}

/////////////////////////////////////////////////////////////////////////////

function nextScene() {
  if (++sceneIndex >= scenes.length) {
    sceneIndex = 0;
  }
  startScene();
}

/////////////////////////////////////////////////////////////////////////////

function startScene() {
  setDefaultBeamChannelData(beamChannelData);

  const sceneData = scenes[sceneIndex];
  setPanLimits(sceneData.pan);
  beamChannelData[Beam.Channel.Tilt] = sceneData.tilt;
  beamChannelData[Beam.Channel.ColorWheel] = sceneData.beemColor;

  updateShow();
  logScene();
}

/////////////////////////////////////////////////////////////////////////////

function updateShow() {
  const sceneData = scenes[sceneIndex];

  if (runBeams)   { sendBeamsChannelData(beamChannelData); }
  if (runWashers) { sendWasherChannelData(sceneData.pixelColor2); }
  if (runOutline) { sendOutlineChannelData(sceneData.pixelColor1, sceneData.pixelColor2, panCount); }
}

/////////////////////////////////////////////////////////////////////////////

function logScene(timeout) {
  console.log("--", Date.now()/1000,
    " scene=", sceneIndex,
    " beams color=", beamChannelData[Beam.Channel.ColorWheel],
    " tilt=", beamChannelData[Beam.Channel.Tilt],
    " lamp=", beamChannelData[Beam.Channel.Lamp]);
}

/////////////////////////////////////////////////////////////////////////////
// start the "show"

sceneIndex = -1;

loop();

/////////////////////////////////////////////////////////////////////////////

//  ====== Rotate =====

// let beamStatus = [];
// const directions = { N: 1, NE: 2, E: 3, SE: 4, S: 5, SW: 6, W: 7, NW: 8 };

// function setBeamStatus(beamNumber, status) {
//   beamsStatus[beamNumber] = status;
// }

// function getBeamStatus(beamNumber, status) {
//   return beamsStatus[beamNumber];
// }

// function moveBeam(beamNumber)
// {
//   let status = beamStatus[beamNumber];
//   const config = blueScene[beamnumber];

//   status.angle += config.speed;

//   if (angle >= Math.PI*2) {
//     angle = 0;
//   }

//   status.pan = config.center.pan + cos(status.angle) * config.radius;
//   status.tilt = config.center.pan + sin(status.angle) * config.radius;

//   beamsChannelData[Beam.Channel.Pan] = status.pan;
//   beamsChannelData[Beam.Channel.Tilt] = status.tilt;
// }
