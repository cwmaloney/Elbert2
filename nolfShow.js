"use strict";

const { E131 } = require("./E131.js");
const { Beam, Washer, OutlinePixel, OrnamentPixel } = require("./config.js");
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
  sendPumpkinChannelData,
  sendSpiderChannelData,

  sendSpookyTreeChannelData

  } = require("./config-farmstead.js");


// if pan has a step property, it is the size of each pan movement - the default is 1
const testScenes = [
  { beamTilt: 25, beamColor: Beam.Color.White,  pan: { start: 80, stop: 150, step:  1 }, pixelColor1: "Black", pixelColor2: "White" },
  { beamTilt: 25, beamColor: Beam.Color.Red,    pan: { start: 80, stop: 150, step:  2 }, pixelColor1: "Black", pixelColor2: "Red" },
  { beamTilt: 25, beamColor: Beam.Color.Orange, pan: { start: 80, stop: 150, step:  4 }, pixelColor1: "Black", pixelColor2: "Orange" },
  { beamTilt: 25, beamColor: Beam.Color.Yellow, pan: { start: 80, stop: 150, step:  8 }, pixelColor1: "Black", pixelColor2: "Yellow" },
  { beamTilt: 25, beamColor: Beam.Color.Green,  pan: { start: 80, stop: 1500 }, pixelColor1: "Black", pixelColor2: "Green" },
  { beamTilt: 25, beamColor: Beam.Color.Blue,   pan: { start: 80, stop: 1503 }, pixelColor1: "Black", pixelColor2: "Blue" },
  { beamTilt: 25, beamColor: Beam.Color.Violet, pan: { start: 80, stop: 1506 }, pixelColor1: "Black", pixelColor2: "Violet" },
  { beamTilt: 25, beamColor: Beam.Color.Magenta,pan: { start: 80, stop: 1509 }, pixelColor1: "Black", pixelColor2: "Magenta" },
  { beamTilt: 25, beamColor: Beam.Color.Pink,   pan: { start: 80, stop: 150, step: 22 }, pixelColor1: "Black", pixelColor2: "Pink" },

  // confirmed - single color
  // { beamTilt: 25, beamColor:  0,  pan: { start: 50, stop: 80 }, pixelColor: "White" },
  // { beamTilt: 25, beamColor: 10,  pan: { start: 50, stop: 80 }, pixelColor: "Red" },
  // { beamTilt: 25, beamColor: 20,  pan: { start: 50, stop: 80 }, pixelColor: "Orange" },
  // { beamTilt: 25, beamColor: 27,  pan: { start: 50, stop: 80 }, pixelColor: "Blue" }, // very pale blue
  // { beamTilt: 25, beamColor: 35,  pan: { start: 50, stop: 80 }, pixelColor: "Green" },
  // { beamTilt: 25, beamColor: 45,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // pale yellow
  // { beamTilt: 25, beamColor: 55,  pan: { start: 50, stop: 80 }, pixelColor: "Lavender" },
  // { beamTilt: 25, beamColor: 60,  pan: { start: 50, stop: 80 }, pixelColor: "Pink"  },
  // { beamTilt: 25, beamColor: 70,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow"  },
  // { beamTilt: 25, beamColor: 80,  pan: { start: 50, stop: 80 }, pixelColor: "Magenta"  },
  // { beamTilt: 25, beamColor: 87,  pan: { start: 50, stop: 80 }, pixelColor: "Cyan" }, // Cyan
  // { beamTilt: 25, beamColor: 120, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  },

  // confirmed - two color
  // { beamTilt: 25, beamColor:  5,  pan: { start: 50, stop: 80 }, pixelColor: "Red" }, // white & red
  // { beamTilt: 25, beamColor: 15,  pan: { start: 50, stop: 80 }, pixelColor: "Red" }, // red & orange
  // { beamTilt: 25, beamColor: 25,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // orange & pale blue
  // { beamTilt: 25, beamColor: 30,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // pale blue & green
  // { beamTilt: 25, beamColor: 40,  pan: { start: 50, stop: 80 }, pixelColor: "Green" }, // green & yellow
  // { beamTilt: 25, beamColor: 50,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // yellow & lavender
  // { beamTilt: 25, beamColor: 65,  pan: { start: 50, stop: 80 }, pixelColor: "Lavender" }, // pink & yellow 
  // { beamTilt: 25, beamColor: 75,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" }, // yellow & magenta 
  // { beamTilt: 25, beamColor: 85,  pan: { start: 50, stop: 80 }, pixelColor: "Magenta" }, // magenta & cyan
  // { beamTilt: 25, beamColor: 90,  pan: { start: 50, stop: 80 }, pixelColor: "Cyan"  }, // cyan & yellow

  // yuck
  // { beamTilt: 25, beamColor: 95,  pan: { start: 50, stop: 80 }, pixelColor: "Yellow" },  // yellow
  // { beamTilt: 25, beamColor: 100, pan: { start: 50, stop: 80 }, pixelColor: "Yellow"  }, // yellow & pale brown
  // { beamTilt: 25, beamColor: 105, pan: { start: 50, stop: 80 }, pixelColor: "Brown"  },  // pale brown
  // { beamTilt: 25, beamColor: 110, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // pale brown & ?
  // { beamTilt: 25, beamColor: 115, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beamColor: 120, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beamColor: 125, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beamColor: 130, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beamColor: 135, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beamColor: 140, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
  // { beamTilt: 25, beamColor: 145, pan: { start: 50, stop: 80 }, pixelColor: "Purple"  }, // yuck
];

const halloweenScenes = [
  { beamTilt: 25, beamColor: Beam.Color.Magenta,  pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Magenta" },
  { beamTilt: 72, beamColor: Beam.Color.Orange,   pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Orange"  },
  { beamTilt: 36, beamColor: Beam.Color.Red,      pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Red" },
  { beamTilt: 48, beamColor: Beam.Color.Blue,     pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Dark Blue" },
  { beamTilt: 30, beamColor: Beam.Color.Violet,   pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Violet" },
  { beamTilt: 40, beamColor: Beam.Color.Green,    pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Green"  },
  { beamTilt: 84, beamColor: Beam.Color.White,    pan: { start: 85, stop: 170, step:  1 }, pixelColor1: "Dark Violet", pixelColor2: "Orange"  },
];

const valentineScenes = [
  { beamTilt: 36, beamColor: Beam.Color.Red,      pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Red" },
  { beamTilt: 75, beamColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Red", pixelColor2: "White"  },
  { beamTilt: 48, beamColor: Beam.Color.Magenta,  pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Magenta" },
  { beamTilt: 90, beamColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Magenta", pixelColor2: "White"  },
  { beamTilt: 28, beamColor: Beam.Color.Pink,     pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Pink" },
  { beamTilt: 75, beamColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Pink", pixelColor2: "White"  },
  { beamTilt: 72, beamColor: Beam.Color.Violet,   pan: { start: 90, stop: 150 }, pixelColor1: "White", pixelColor2: "Violet"  },
  { beamTilt: 90, beamColor: Beam.Color.White,    pan: { start: 30, stop: 160 }, pixelColor1: "Violet", pixelColor2: "White"  },
];


/////////////////////////////////////////////////////////////////////////////
// all data that changes to choose a show should be in this section

const beamStartTime = "17:15:00";
const beamStopTime  = "21:05:00";
// const beamStartTime = "19:20:00";
// const beamStopTime  = "19:22:00";

const runBeams = true;
const runOutline = true;
const runWashers = true;
const runOrnaments = false;
const runPumpkins = true;
const runSpiders = true;
const runSpookyTrees = true;

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

// are beams on or off
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
  beamChannelData[Beam.Channel.ColorWheel] = scene.beamColor;
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
  if (runPumpkins)  { sendPumpkinChannelData(scene.pixelColor1, scene.pixelColor2, scene.stepCount, scene.stepIndex); }
  if (runSpiders)   { sendSpiderChannelData(scene.pixelColor2, scene.stepCount, scene.stepIndex); }

  if (runSpookyTrees) { sendSpookyTreeChannelData(scene.pixelColor2, scene.stepCount, scene.stepIndex); }
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
