"use strict";

const { E131 } = require("./E131.js");
const { Beam, Washer, OutlinePixel } = require("./config.js");
const { colorNameToRgb } = require("./config-colors.js");

const standardColors = [
  Beam.Color.White,
  Beam.Color.Red,
  Beam.Color.Orange,
  Beam.Color.Yellow,
  Beam.Color.Green,
  Beam.Color.Blue,
  Beam.Color.Magenta,
  Beam.Color.Pink,
  Beam.Color.Lavender
];

const testColorsScenes = [
  { tilt: 25, beemColor: Beam.Color.White,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "White" },
  { tilt: 25, beemColor: Beam.Color.Red,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Red" },
  { tilt: 25, beemColor: Beam.Color.Orange,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Orange" },
  { tilt: 25, beemColor: Beam.Color.Yellow,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Yellow" },
  { tilt: 25, beemColor: Beam.Color.Green,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Green" },
  { tilt: 25, beemColor: Beam.Color.Blue,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Blue" },
  { tilt: 25, beemColor: Beam.Color.Violet,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Violet" },
  { tilt: 25, beemColor: Beam.Color.Magenta,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Magenta" },
  { tilt: 25, beemColor: Beam.Color.Pink,  pan: { start: 50, stop: 80, step: 1 }, pixelColor1: "Black", pixelColor2: "Pink" },

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
  { tilt: 48, beemColor: Beam.Color.Magenta,  pan: { start: 90, stop: 150, step: 1 }, pixelColor1: "Red", pixelColor2: "Magenta" },
  { tilt: 24, beemColor: Beam.Color.Pink,     pan: { start: 90, stop: 150, step: 1 }, pixelColor1: "Magenta", pixelColor2: "Pink" },
  { tilt: 72, beemColor: Beam.Color.Violet,   pan: { start: 30, stop: 190, step: 1 }, pixelColor1: "Pink", pixelColor2: "Violet"  },
  { tilt: 84, beemColor: Beam.Color.Lavender, pan: { start:  5, stop: 190, step: 1 }, pixelColor1: "Violet", pixelColor2: "Lavender"  },
  { tilt: 90, beemColor: Beam.Color.White,    pan: { start:  5, stop: 190, step: 1 }, pixelColor1: "Lavender", pixelColor2: "White"  },
];

const beamStartTime = "17:30:00";
const beamStopTime  = "21:30:00";

const runBeams = false;
const runOutline = false;
const runWashers = false;

/////////////////////////////////////////////////////////////////////////////

function parseTimeToMinutes(timeString) {
  const timestamp = new Date('1970-01-01T' + timeString);
  return timestamp.getHours()* 60 + timestamp.getMinutes();
}

const beamStartMinute = parseTimeToMinutes(beamStartTime);
const beamStopMinute = parseTimeToMinutes(beamStopTime);

/////////////////////////////////////////////////////////////////////////////

// This is the IP address of the moving lights controller
const beamsAddress = "192.168.1.70";
// This is the universe of the moving lights 
const beamsUniverse = 121;


// This is the IP address of the washers controller
const washersAddress = "192.168.1.72";
// This is the universe of the washers 
const washersUniverse = 122;
// number of washers
const washerCount = 25;


// These are the IP addresses of the building outline pixel controllers
const outlineAddresses = [ "192.168.1.60", "192.168.1.61", "192.168.1.62" ];
// This is the universe of the outline pixels
const outlineUniverses = [ [ 100, 101, 102 ], [ 104, 105, 106], [ 108, 109, 110] ];
// number of pixels per controller
const outlinePixelCount = [ [170, 170, 170], [170, 170, 170], [170, 170, 170] ];

const horizontalStringMap = [
  { start:    0, end:  169, controller: 0, universe: 0},
  { start:  170, end:  335, controller: 0, universe: 1},
  { start:  336, end:  505, controller: 2, universe: 0},
  { start:  506, end:  675, controller: 2, universe: 1}
];

const centerlStringMap = [
  { start:    0, end:  169, controller: 1, universe: 0},
  { start:  170, end:  339, controller: 1, universe: 1},
  { start:  340, end:  355, controller: 1, universe: 2}
];

/////////////////////////////////////////////////////////////////////////////

function getOutlinePixelAddress(pixelNumber, map) {
  for (let segment of map) {
    if (pixelNumber >= segment.start && pixelNumber <= segment.end) {
      return { address: outlineAddresses[segment.controller],
               universe: outlineUniverses[segment.controller][segment.universe],
               pixelIndex: (pixelNumber - segment.start) };
    }
  }
  return null;
}

function getOutlineStringLength(map) {
  return map[map.length-1].end;
}

/////////////////////////////////////////////////////////////////////////////
// Configure E.131 Universes
      
const e131 = new E131();

// configure beams universe
e131.configureUniverse({
  "address": beamsAddress,
  "universe": beamsUniverse,
  "sourcePort": 5568,
  "sendOnlyChangeData": false,
  "sendSequenceNumbers": true,
  "refreshInterval": 1000
});

// configure washers universe
e131.configureUniverse({
  "address": washersAddress,
  "universe": washersUniverse,
  "sourcePort": 5568,
  "sendOnlyChangeData": false,
  "sendSequenceNumbers": false,
  "refreshInterval": 1000
});


// configure pixel universes
for (let addressIndex = 0; addressIndex < outlineAddresses.length; addressIndex++) {
  const outlineAddress = outlineAddresses[addressIndex];
  for (let universeIndex = 0; universeIndex < outlineUniverses[addressIndex].length; universeIndex++) {
    const outlineUniverse = outlineUniverses[addressIndex][universeIndex];
    e131.configureUniverse({
      "address": outlineAddress,
      "universe": outlineUniverse,
      "sourcePort": 5568,
      "sendOnlyChangeData": false,
      "sendSequenceNumbers": false,
      "refreshInterval": 1000
    });
  }
}


/////////////////////////////////////////////////////////////////////////////

const beams = [
  { address: beamsAddress, universe: beamsUniverse, channel: ( 0 * Beam.ChannelCount)+1, on: false },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 1 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 2 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 3 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 4 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 5 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 6 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 7 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 8 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 9 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (10 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (11 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (12 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (13 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (14 * Beam.ChannelCount)+1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (15 * Beam.ChannelCount)+1, on: false }
];

const washers = [
  { address: washersAddress, universe: washersUniverse, channel: ( 0 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 1 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 2 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 3 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 4 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 5 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 6 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 7 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 8 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: ( 9 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (10 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (11 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (12 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (13 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (14 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (15 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (16 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (17 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (18 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (19 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (20 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (21 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (22 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (23 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (24 * Washer.ChannelCount)+1 },
  { address: washersAddress, universe: washersUniverse, channel: (25 * Washer.ChannelCount)+1 },
];

/////////////////////////////////////////////////////////////////////////////

let beamsChannelData = [];

const defaultbeamsChannelData = {
  ColorWheel: Beam.Color.White,
  Strobe: Beam.Strobe.Open,
  Dimmer: Beam.Dimmer.Off,
  Gobo: Beam.Gobo.Off,
  Prism: Beam.Prism.Off,
  PrismRotation: Beam.PrismRotation.Off,
  EffectsMovement: Beam.Unused,
  Frost: Beam.Frost.Off,
  Focus: 127,
  Pan: 0,
  PanFine: 0,
  Tilt: 45,
  TiltFine: 0,
  Macro: Beam.Unused,
  Reset: Beam.Reset.None,
  Lamp: Beam.Lamp.On
};

function setDefaultBeamChannelData() {
  beamsChannelData[Beam.Channel.ColorWheel]      = defaultbeamsChannelData.ColorWheel;
  beamsChannelData[Beam.Channel.Strobe]          = defaultbeamsChannelData.Strobe;
  beamsChannelData[Beam.Channel.Dimmer]          = defaultbeamsChannelData.Dimmer;
  beamsChannelData[Beam.Channel.Gobo]            = defaultbeamsChannelData.Gobo;
  beamsChannelData[Beam.Channel.Prism]           = defaultbeamsChannelData.Prism;
  beamsChannelData[Beam.Channel.PrismRotation]   = defaultbeamsChannelData.PrismRotation;
  beamsChannelData[Beam.Channel.EffectsMovement] = defaultbeamsChannelData.EffectsMovement;
  beamsChannelData[Beam.Channel.Frost]           = defaultbeamsChannelData.Frost;
  beamsChannelData[Beam.Channel.Focus]           = defaultbeamsChannelData.Focus;
  beamsChannelData[Beam.Channel.Pan]             = defaultbeamsChannelData.Pan;
  beamsChannelData[Beam.Channel.PanFine]         = defaultbeamsChannelData.PanFine;
  beamsChannelData[Beam.Channel.Tilt]            = defaultbeamsChannelData.Tilt;
  beamsChannelData[Beam.Channel.TiltFine]        = defaultbeamsChannelData.TiltFine;
  beamsChannelData[Beam.Channel.Macro]           = defaultbeamsChannelData.Macro;
  beamsChannelData[Beam.Channel.Reset]           = defaultbeamsChannelData.Reset;
  beamsChannelData[Beam.Channel.Lamp]            = defaultbeamsChannelData.Lamp;
}

/////////////////////////////////////////////////////////////////////////////

// let pixelColor = [ 100, 100, 100 ];

/////////////////////////////////////////////////////////////////////////////

//  ====== Pan =====

let panStart = 0;
let panStop = 160;
let panStep = 1;
let panValue = panStart;

function setPans(pan) {
  panStart = pan.start;
  panStop = pan.stop;
  panStep = pan.step;
  panValue = panStart;
  beamsChannelData[Beam.Channel.Pan] = panValue;
}

function nextPan() {
  let done = false;
  panValue += panStep;
  if (panValue >= panStop) {
    panValue = panStart;
    done = true;
  }
  if (panValue == 0) {
    stepInterval = 2000;
  } else {
    stepInterval = 125;
  }
  beamsChannelData[Beam.Channel.Pan] = panValue;
  return done;
}

/////////////////////////////////////////////////////////////////////////////
let scenes = halloweenScenes;

let sceneIndex = -1;

// current step in scene
let sceneStep = 0;

function nextScene() {
  if (++sceneIndex >= scenes.length) {
    sceneIndex = 0;
  }
  sceneStep = 0;
  setScene();
}
 
function setScene() {
  setDefaultBeamChannelData();

  if (sceneIndex < 100) {
    const sceneData = scenes[sceneIndex];
    setPans(sceneData.pan);
    beamsChannelData[Beam.Channel.Tilt] = sceneData.tilt;
    beamsChannelData[Beam.Channel.ColorWheel] = sceneData.beemColor;
    // pixelColor = colorNameToRgb[ sceneData.pixelColor ];
  }

  logScene();
}

/////////////////////////////////////////////////////////////////////////////

// time until next step
let stepInterval = 1000;

function nextStep() {

  switch (sceneIndex)
  {
    // used by "off" command
    case 100:
      if (++sceneStep > 10)
        process.exit(0);
        logScene();
      break;

    // used by scene that pan the beams
    default:
      sceneStep++;
      if (nextPan()) {
          nextScene()
      }
      break;
  }

  sendBeamsChannelData();
  sendWasherChannelData();
  sendOutlineChannelData();

  setTimeout(nextStep, stepInterval);
}

function logScene() {
  console.log("--", Date.now()/1000,
    " scene=", sceneIndex,
    " beams {color=", beamsChannelData[Beam.Channel.ColorWheel],
    " tilt=", beamsChannelData[Beam.Channel.Tilt],
    " } timeout=", stepInterval);
}

function sendBeamsChannelData()
{
  // get minute of day to see if beams should be on or off
  const timestamp = new Date();
  const minute = timestamp.getHours() * 60 + timestamp.getMinutes();

  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    if (!runBeams  || minute < beamStartMinute || minute > beamStopMinute || beams[beamIndex].off) {
      beamsChannelData[Beam.Channel.Lamp] = Beam.Lamp.Off;
      beamsChannelData[Beam.Channel.ColorWheel] = Beam.Color.White;
      beamsChannelData[Beam.Channel.Pan] = 0;
      beamsChannelData[Beam.Channel.Tilt] = 0;
    }
    e131.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, beamsChannelData);
  }

  e131.send(beamsAddress, beamsUniverse);
}

function sendWasherChannelData()
{
  if (sceneIndex < 100 && runWashers) {
    const sceneData = scenes[sceneIndex];
    const pixelColorData = colorNameToRgb[ sceneData.pixelColor2 ]
    for (var washerIndex = 0; washerIndex < washers.length; washerIndex++) {
      const washerData = [255, pixelColorData[0], pixelColorData[1], pixelColorData[2], 0, 0];
      e131.setChannelData(washers[washerIndex].address, washers[washerIndex].universe, washers[washerIndex].channel, washerData);
    }
    e131.send(washersAddress, washersUniverse);
  }
}

function sendOutlineChannelData()
{
  if (sceneIndex < 100 && runOutline) {
    const sceneData = scenes[sceneIndex];
    const pixelColor1Data = colorNameToRgb[ sceneData.pixelColor1 ];
    const pixelColor2Data = colorNameToRgb[ sceneData.pixelColor2 ];

    const horizontalStringLength = getOutlineStringLength(horizontalStringMap);
    for (let pixelNumber = 0; pixelNumber < horizontalStringLength; pixelNumber++) {
      const pixelData = (pixelNumber >= (sceneStep*2) && pixelNumber <= (horizontalStringLength - (sceneStep*2)))
                        ? pixelColor1Data : pixelColor2Data;
      const { address, universe, pixelIndex } = getOutlinePixelAddress(pixelNumber, horizontalStringMap);
      const pixelChannel = (pixelIndex * OutlinePixel.ChannelCount) + 1;
      e131.setChannelData(address, universe, pixelChannel, pixelData);
    }

    const centerStringLength = getOutlineStringLength(centerlStringMap);
    for (let pixelNumber = 0; pixelNumber < centerStringLength; pixelNumber++) {
      const pixelData = (pixelNumber >= sceneStep && pixelNumber <= (centerStringLength - sceneStep - 8))
                          ? pixelColor1Data : pixelColor2Data;
      const { address, universe, pixelIndex } = getOutlinePixelAddress(pixelNumber, centerlStringMap);
      const pixelChannel = (pixelIndex * OutlinePixel.ChannelCount) + 1;
      e131.setChannelData(address, universe, pixelChannel, pixelData);
    }

    for (let addressIndex = 0; addressIndex < outlineAddresses.length; addressIndex++) {
      const outlineAddress = outlineAddresses[addressIndex];
      for (let universeIndex = 0; universeIndex < outlineUniverses[addressIndex].length; universeIndex++) {
        const outlineUniverse = outlineUniverses[addressIndex][universeIndex];
        e131.send(outlineAddress, outlineUniverse);
      }
    }
  }
}

/////////////////////////////////////////////////////////////////////////////
// start the "show"
sceneIndex = 0;
sceneStep = 0;

// check for the off command
for (let j = 0; j < process.argv.length; j++) {
  console.log(j + ':' + (process.argv[j]));

  if (process.argv[j] === "off") {
    defaultbeamsChannelData.Lamp = Beam.Lamp.Off;
    defaultbeamsChannelData.Color = Beam.Color.Blue;
    defaultbeamsChannelData.Pan = 120;
    defaultbeamsChannelData.Tilt = 80;
    sceneIndex = 100;
    }
}

setScene();

setTimeout(nextStep, stepInterval);
