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
  sendOrnamentChannelData,
  sendSpiderChannelData

  } = require("./config-farmstead.js");


// if pan has a step property, it is the size of each pan movement - the default is 1
const testScenes = [
  { beamTilt: 25, beemColor: Beam.Color.White,  pan: { start: 80, stop: 150, step:  1 }, pixelColor1: "Black", pixelColor2: "White" },
  { beamTilt: 25, beemColor: Beam.Color.Red,    pan: { start: 80, stop: 150, step:  2 }, pixelColor1: "Black", pixelColor2: "Red" },
  { beamTilt: 25, beemColor: Beam.Color.Orange, pan: { start: 80, stop: 150, step:  4 }, pixelColor1: "Black", pixelColor2: "Orange" },
  { beamTilt: 25, beemColor: Beam.Color.Yellow, pan: { start: 80, stop: 150, step:  8 }, pixelColor1: "Black", pixelColor2: "Yellow" },
  { beamTilt: 25, beemColor: Beam.Color.Green,  pan: { start: 80, stop: 1500 }, pixelColor1: "Black", pixelColor2: "Green" },
  { beamTilt: 25, beemColor: Beam.Color.Blue,   pan: { start: 80, stop: 1503 }, pixelColor1: "Black", pixelColor2: "Blue" },
  { beamTilt: 25, beemColor: Beam.Color.Violet, pan: { start: 80, stop: 1506 }, pixelColor1: "Black", pixelColor2: "Violet" },
  { beamTilt: 25, beemColor: Beam.Color.Magenta,pan: { start: 80, stop: 1509 }, pixelColor1: "Black", pixelColor2: "Magenta" },
  { beamTilt: 25, beemColor: Beam.Color.Pink,   pan: { start: 80, stop: 150, step: 22 }, pixelColor1: "Black", pixelColor2: "Pink" },

  // confirmed - single color
  // { beamTilt: 25, beemColor:  0,  pan: { start: 50, stop: 80 }, pixelColor: "White" },
  // { beamTilt: 25, beemColor: 10,  pan: { start: 50, stop: 80 }, pixelColor: "Red" },
  // { beamTilt: 25, beemColor: 20,  pan: { start: 50, stop: 80 }, pixelColor: "Orange" },
  // { beamTilt: 25, beemColor: 27,  pan: { start: 50, stop: 80 }, pixelColor: "Blue" }, // very pale blue
  // { beamTilt: 25, beemColor: 35,  pan: { start: 50, stop: 80 }, pixelColor: "Green" },
  // { beamTilt: 25, beemColor: 45,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // pale yellow
  // { beamTilt: 25, beemColor: 55,  pan: { start: 50, stop: 80 }, pixelColor: "Lavender" },
  // { beamTilt: 25, beemColor: 60,  pan: { start: 50, stop: 80 }, pixelColor: "Pink"  },
  // { beamTilt: 25, beemColor: 70,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow"  },
  // { beamTilt: 25, beemColor: 80,  pan: { start: 50, stop: 80 }, pixelColor: "Magenta"  },
  // { beamTilt: 25, beemColor: 87,  pan: { start: 50, stop: 80 }, pixelColor: "Cyan" }, // Cyan
  // { beamTilt: 25, beemColor: 120, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  },

  // confirmed - two color
  // { beamTilt: 25, beemColor:  5,  pan: { start: 50, stop: 80 }, pixelColor: "Red" }, // white & red
  // { beamTilt: 25, beemColor: 15,  pan: { start: 50, stop: 80 }, pixelColor: "Red" }, // red & orange
  // { beamTilt: 25, beemColor: 25,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // orange & pale blue
  // { beamTilt: 25, beemColor: 30,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // pale blue & green
  // { beamTilt: 25, beemColor: 40,  pan: { start: 50, stop: 80 }, pixelColor: "Green" }, // green & yellow
  // { beamTilt: 25, beemColor: 50,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // yellow & lavender
  // { beamTilt: 25, beemColor: 65,  pan: { start: 50, stop: 80 }, pixelColor: "Lavender" }, // pink & yellow 
  // { beamTilt: 25, beemColor: 75,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // yellow & magenta 
  // { beamTilt: 25, beemColor: 85,  pan: { start: 50, stop: 80 }, pixelColor: "Magenta" }, // magenta & cyan
  // { beamTilt: 25, beemColor: 90,  pan: { start: 50, stop: 80 }, pixelColor: "Cyan"  }, // cyan & yellow

  // yuck
  // { beamTilt: 25, beemColor: 95,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" },  // yellow
  // { beamTilt: 25, beemColor: 100, pan: { start: 50, stop: 80 }, pixelColor: "Yellow"  }, // yellow & pale brown
  // { beamTilt: 25, beemColor: 105, pan: { start: 50, stop: 80 }, pixelColor: "Brown"  },  // pale brown
  // { beamTilt: 25, beemColor: 110, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // pale brown & ?
  // { beamTilt: 25, beemColor: 115, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beemColor: 120, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beemColor: 125, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beemColor: 130, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beemColor: 135, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beemColor: 140, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beemColor: 145, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
];

const halloweenScenes = [
  { beamTilt: 25, beemColor: Beam.Color.Magenta,  pan: { start: 120, stop: 170 }, pixelColor1: "Orange", pixelColor2: "Magenta" },
  { beamTilt: 72, beemColor: Beam.Color.Orange,   pan: { start: 120, stop: 170 }, pixelColor1: "Magenta", pixelColor2: "Orange"  },
  { beamTilt: 36, beemColor: Beam.Color.Red,      pan: { start: 120, stop: 170 }, pixelColor1: "Orange", pixelColor2: "Red" },
//  { beamTilt: 48, beemColor: Beam.Color.Blue,     pan: { start: 120, stop: 170 }, pixelColor1: "Red", pixelColor2: "Dark Blue" },
  { beamTilt: 30, beemColor: Beam.Color.Violet,   pan: { start: 120, stop: 170 }, pixelColor1: "Dark Blue", pixelColor2: "Violet" },
  { beamTilt: 40, beemColor: Beam.Color.Green,    pan: { start: 120, stop: 170 }, pixelColor1: "Violet", pixelColor2: "Green"  },
  { beamTilt: 84, beemColor: Beam.Color.White,    pan: { start: 120, stop: 170 }, pixelColor1: "Black", pixelColor2: "Orange"  },
];

const valentineScenes = [
  { beamTilt: 36, beemColor: Beam.Color.Red,      pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Red" },
  { beamTilt: 75, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Red", pixelColor2: "White"  },
  { beamTilt: 48, beemColor: Beam.Color.Magenta,  pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Magenta" },
  { beamTilt: 90, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Magenta", pixelColor2: "White"  },
  { beamTilt: 28, beemColor: Beam.Color.Pink,     pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Pink" },
  { beamTilt: 75, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Pink", pixelColor2: "White"  },
  { beamTilt: 72, beemColor: Beam.Color.Violet,   pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Violet"  },
  { beamTilt: 90, beemColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Violet", pixelColor2: "White"  },
];


/////////////////////////////////////////////////////////////////////////////
// all data that changes to choose a show should be in this section

const beamStartTime = "17:00:00";
const beamStopTime  = "21:40:00";

const runBeams = false;
const runOutline = false;
const runWashers = false;
const runOrnaments = false;
const runSpiders = true;

const scenes = halloweenScenes;

const sceneStartTimeout = 2000;

// time between beam movements in milliseconds
const stepInterval = 125;
//let stepInterval = 50;
//let stepInterval = 1000;

/////////////////////////////////////////////////////////////////////////////

const beamStartMinute = parseTimeToMinutes(beamStartTime);
const beamStopMinute = parseTimeToMinutes(beamStopTime);

/////////////////////////////////////////////////////////////////////////////

// current step index
let sceneIndex = -1;

// track data for for current scene
let scene = null;

let beamChannelData = [];

// are beems on or off
let beamState = "unknown";

/////////////////////////////////////////////////////////////////////////////

function setScene(newScene) {

  let stepCount = (newScene.pan.step)
    ? (newScene.pan.stop - newScene.pan.start + 1) / newScene.pan.step
    : (newScene.pan.stop - newScene.pan.start + 1);

  scene = {
    stepIndex: 0,
    stepCount,

    beamPanIndex: newScene.pan.start,
    beamPanIncrement: (newScene.pan.stop - newScene.pan.start + 1) / stepCount,

    ...newScene,
   };
}

/////////////////////////////////////////////////////////////////////////////

function loop() {

  const checkBeamLampStateResults = checkBeamLampState(beamState, beamStartMinute, beamStopMinute);
  beamState = checkBeamLampStateResults.beamState;
  if (checkBeamLampStateResults.timeout > 0) {
    console.log("   waiting for beam lamp to turn " + beamState + "...");
    setTimeout(loop, checkBeamLampStateResults.timeout);
  }
  else if (sceneIndex == -1)
  {
    nextScene();
    setTimeout(loop, sceneStartTimeout);
  }
  else
  {
    scene.stepIndex++;
    scene.beamPanIndex += scene.beamPanIncrement;
    
    if (scene.stepIndex >= scene.stepCount) {
      nextScene();
      setTimeout(loop, sceneStartTimeout);
    } else {
      beamChannelData[Beam.Channel.Pan] = scene.beamPanIndex;
      logStep()
      updateShow();
      setTimeout(loop, stepInterval);
    }
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

  setScene(scenes[sceneIndex]);

  beamChannelData[Beam.Channel.Tilt] = scene.beamTilt;
  beamChannelData[Beam.Channel.ColorWheel] = scene.beemColor;
  beamChannelData[Beam.Channel.Pan] = scene.beamPanIndex;

  updateShow();
  logScene();
}

/////////////////////////////////////////////////////////////////////////////

function updateShow() {
  if (runBeams)     { sendBeamsChannelData(beamChannelData); }
  if (runWashers)   { sendWasherChannelData(scene.pixelColor2); }
  if (runOutline)   { sendOutlineChannelData(scene.pixelColor1, scene.pixelColor2, scene.stepCount, scene.stepIndex); }
  if (runOrnaments) { sendOrnamentChannelData(scene.pixelColor1, scene.pixelColor2, scene.stepCount, scene.stepIndex); }
  if (runSpiders)   { sendSpiderChannelData(scene.pixelColor2); }
}

/////////////////////////////////////////////////////////////////////////////

function logScene() {
  const now = new Date();
  console.log("--", now.toLocaleTimeString('en-US'), (now % 60) /1000,
    "scene="+sceneIndex,
    "steps="+scene.stepCount,
    "time="+(scene.stepCount * stepInterval)/1000,
    "beam color="+beamChannelData[Beam.Channel.ColorWheel],
    "tilt="+beamChannelData[Beam.Channel.Tilt],
    "lamp="+beamChannelData[Beam.Channel.Lamp]
  );
}

/////////////////////////////////////////////////////////////////////////////

function logStep() {
  const msg = " " + scene.stepIndex + "/" + scene.beamPanIndex;
  //console.log(msg);
}

/////////////////////////////////////////////////////////////////////////////
// start the "show"

sceneIndex = -1;

loop();
