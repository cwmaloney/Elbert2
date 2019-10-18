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

// const lowHalloweenPan = { start: 30, stop: 190, step: 1 };
// const lowHalloweenTilt = { start: 36, stop: 60, step: 12 };
// const lowHalloweenBeamColors = [
//   Beam.Color.Magenta,
//   Beam.Color.Red,
//   Beam.Color.Orange,
//   Beam.Color.Blue,
//   Beam.Color.Green,
// ];
// const lowHalloweenPixelColors = [
//   "Purple",
//   "Red",
//   "Orange",
//   "Blue",
//   "Green"
// ];

const halloweenScenes = [
  { tilt: 36, beemColor: Beam.Color.Magenta,  pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Purple" },
  { tilt: 36, beemColor: Beam.Color.Red,      pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Red" },
  { tilt: 48, beemColor: Beam.Color.Orange,   pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Orange" },
  { tilt: 36, beemColor: Beam.Color.Blue,     pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Blue" },
  { tilt: 48, beemColor: Beam.Color.Green,    pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Green"  },
  { tilt: 72, beemColor: Beam.Color.Orange,   pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Orange"  },
  { tilt: 84, beemColor: Beam.Color.White,    pan: { start: 30, stop: 190, step: 1 }, pixelColor: "Yellow"  },
];


const lowValentinePan = { start: 90, stop: 150, step: 1 };
const lowValentineTilt =  { start: 36, stop: 60, step: 12 };
const lowValentineColors = [
  Beam.Color.Red,
  Beam.Color.Magenta,
  Beam.Color.Pink,
];

const highValentinePan = { start: 30, stop: 190, step: 1 };
const highValentineTilt = { start: 72, stop: 96, step:12 };
const highValentineColors = [
  Beam.Color.Lavender,
  Beam.Color.White,
];

/////////////////////////////////////////////////////////////////////////////

// This is the IP address of the moving lights controller
const beamsAddress = "192.168.1.71";
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
  { address: beamsAddress, universe: beamsUniverse, channel: ( 0 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 1 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 2 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 3 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 4 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 5 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 6 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 7 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 8 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: ( 9 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: (10 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: (11 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: (12 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: (13 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: (14 * Beam.ChannelCount)+1 },
  { address: beamsAddress, universe: beamsUniverse, channel: (15 * Beam.ChannelCount)+1 }
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

let pixelColor = [ 100, 100, 100 ];
let pixelChannelData = [];

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
    sceneStep = 0;
  }
  setScene();
}
 
function setScene() {
  setDefaultBeamChannelData();

  const sceneData = scenes[sceneIndex];
  setPans(sceneData.pan);
  beamsChannelData[Beam.Channel.Tilt] = sceneData.tilt;
  beamsChannelData[Beam.Channel.ColorWheel] = sceneData.beemColor;
  pixelColor = colorNameToRgb[ sceneData.pixelColor ];

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
    " lamp=", beamsChannelData[Beam.Channel.Lamp],
    " } timeout=", stepInterval);
}

function sendBeamsChannelData()
{
  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    e131.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, beamsChannelData);
  }
  e131.send(beamsAddress, beamsUniverse);
}

function sendWasherChannelData()
{
  for (var washerIndex = 0; washerIndex < washers.length; washerIndex++) {
    const washerData = [255, pixelColor[0], pixelColor[1], pixelColor[2], 0, 0];
    e131.setChannelData(washers[washerIndex].address, washers[washerIndex].universe, washers[washerIndex].channel, washerData);
  }
  e131.send(washersAddress, washersUniverse);
}

function sendOutlineChannelData()
{
  for (let addressIndex = 0; addressIndex < outlineAddresses.length; addressIndex++) {
    const outlineAddress = outlineAddresses[addressIndex];
    for (let universeIndex = 0; universeIndex < outlineUniverses[addressIndex].length; universeIndex++) {
      const outlineUniverse = outlineUniverses[addressIndex][universeIndex];
      let pixelCount = 0;
      for (let pixelIndex = 0; pixelIndex < outlinePixelCount[addressIndex][universeIndex]; pixelIndex++) {
        if (sceneStep > pixelCount) {
          return;
        }
        const pixelChannel = (pixelIndex * OutlinePixel.ChannelCount) + 1;
        const pixelData = [ pixelColor[0], pixelColor[1], pixelColor[2] ];
        e131.setChannelData(outlineAddress, outlineUniverse, pixelChannel, pixelData);
      }
      e131.send(outlineAddress, outlineUniverse);
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

setDefaultBeamChannelData();

setScene();

setTimeout(nextStep, stepInterval);
