"use strict";

const { E131 } = require("./E131.js");
const { Beam } = require("./config.js");
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

const lowHalloweenPan = { start: 30, stop: 190, step: 1 };
const lowHalloweenTilt = { start: 36, stop: 60, step: 12 };
const lowHalloweenColors = [
  Beam.Color.Magenta,
  Beam.Color.Red,
  Beam.Color.Orange,
  Beam.Color.Blue,
  Beam.Color.Green,
];

const highHalloweenPan = { start: 30, stop: 190, step: 1 };
const highHalloweenTilt = { start: 72, stop: 96, step: 12 };
const highHalloweenColors = [
  Beam.Color.Orange,
  Beam.Color.White,
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
const washerCount = 12;


/// **** FIX OUTLINE DATA WHEN I GET TO THE FARMSTEAD ****

// These is the IP addresses of the building outline pixel controllers
const outlineAddresses = [ "192.168.1.101", "192.168.1.102", "192.168.1.103" ];
// This is the universe of the outline pixels
const outlineUniverses = [ 101, 102, 103 ];
// number of pixels per controller
const outlineCount = [512, 512, 512];

/////////////////////////////////////////////////////////////////////////////
// Configure E.131 Universes
      
const e131 = new E131();

const beamsUniverseInfo = {
  "address": beamsAddress,
  "universe": beamsUniverse,
  "sourcePort": 5568,
  "sendOnlyChangeData": false,
  "sendSequenceNumbers": true,
  "refreshInterval": 1000
};
e131.configureUniverse(beamsUniverseInfo);

const washersUniverseInfo = {
  "address": washersAddress,
  "universe": washersUniverse,
  "sourcePort": 5568,
  "sendOnlyChangeData": false,
  "sendSequenceNumbers": false,
  "refreshInterval": 1000
};
e131.configureUniverse(washersUniverseInfo);

const outlineUniverseInfos = [
  {
    "address": outlineAddresses[0],
    "universe": outlineUniverses[0],
    "sourcePort": 5568,
    "sendOnlyChangeData": false,
    "sendSequenceNumbers": false,
    "refreshInterval": 1000
  },
  {
    "address": outlineAddresses[1],
    "universe": outlineUniverses[1],
    "sourcePort": 5568,
    "sendOnlyChangeData": false,
    "sendSequenceNumbers": false,
    "refreshInterval": 1000
  },
  {
    "address": outlineAddresses[2],
    "universe": outlineUniverses[2],
    "sourcePort": 5568,
    "sendOnlyChangeData": false,
    "sendSequenceNumbers": false,
    "refreshInterval": 1000
  }
]
for (let universeInfo in outlineUniverseInfos) {
  e131.configureUniverse(universeInfo);
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
  let reset = false;
  panValue += panStep;
  if (panValue >= panStop) {
    panValue = panStart;
    reset = true;
  }
  if (panValue == 0) {
    stepInterval = 2000;
  } else {
    stepInterval = 125;
  }
  beamsChannelData[Beam.Channel.Pan] = panValue;
  return reset;
}

//  ====== Tilt =====

let tiltStart = 38;
let tiltStop = 58;
let tiltStep = 10;
let tiltIndex = tiltStart;

function setTilts(tilt) {
  tiltStart = tilt.start;
  tiltStop = tilt.stop;
  tiltStep = tilt.step;
  tiltIndex = tiltStart;
  beamsChannelData[Beam.Channel.Tilt] = tiltStart;
}

function nextTilt() {
  let reset = false;
  tiltIndex += tiltStep;
  if (tiltIndex > tiltStop) {
    tiltIndex = tiltStart;
    reset = true;
  }
  beamsChannelData[Beam.Channel.Tilt] = tiltIndex;
  return reset;
}

//  ====== Color =====

let currentColors = standardColors;
let colorIndex = tiltStart;

function setColors(newcolors) {
  currentColors = newcolors;
  colorIndex = 0;
  beamsChannelData[Beam.Channel.ColorWheel] = currentColors[colorIndex];
}

function nextColor() {
  let reset = false;
  if (++colorIndex >= currentColors.length) {
    colorIndex = 0;
    reset = true;
  }
  beamsChannelData[Beam.Channel.ColorWheel] = currentColors[colorIndex];
  return reset;
}

/////////////////////////////////////////////////////////////////////////////

let sceneIndex = 0;

function nextScene() {
  if (++sceneIndex > 1) sceneIndex = 0;

  setScene();
}

/////////////////////////////////////////////////////////////////////////////
 
let stepCounter = 0;
 
function setScene() {
  setDefaultBeamChannelData();

  switch (sceneIndex)
  {
    case 0:
      setPans(lowHalloweenPan);
      setTilts(lowHalloweenTilt);
      setColors(lowHalloweenColors);
      break;

    case 1:
      setPans(highHalloweenPan);
      setTilts(highHalloweenTilt);
      setColors(highHalloweenColors);
      break;
  }
}

/////////////////////////////////////////////////////////////////////////////

let stepInterval = 1000;

function nextStep() {

  switch (sceneIndex)
  {
    // used by "off" command
    case 100:
      if (++stepCounter > 10)
        process.exit(0);
      break;

    // used by scene that pan the beams
    case 0:
    case 1:
      if (nextPan()) {
        nextTilt();
        if (nextColor()) {
          nextScene()
        }
      }
      break;
  }

  console.log("--", Date.now()/1000,
    " scene=", sceneIndex,
    " color=", beamsChannelData[Beam.Channel.ColorWheel],
    " pan=", beamsChannelData[Beam.Channel.Pan],
    " tilt=", beamsChannelData[Beam.Channel.Tilt],
    " lamp=", beamsChannelData[Beam.Channel.Lamp],
    " timeout=", stepInterval);

  sendBeamsChannelData();
  sendWasherChannelData();
  sendOutlineChannelData();

  setTimeout(nextStep, stepInterval);
}
  
function sendBeamsChannelData()
{
  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    e131.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, beamsChannelData);
  }
  //e131.send(beamsUniverseInfo.address, beamsUniverseInfo.universe);
}

function sendWasherChannelData()
{
  //e131.send(washerUniverseInfo.address, westUniverseInfo.universe);
}

function sendOutlineChannelData()
{
  for (var outlineIndex = 0; outlineIndex < outlineUniverseInfos.length; outlineIndex++) {
    //e131.send(washerUniverseInfo.address, westUniverseInfo.universe);
  }
}

/////////////////////////////////////////////////////////////////////////////
// start the "show"
sceneIndex = 0;
stepCounter = 0;

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
