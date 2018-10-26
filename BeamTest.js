"use strict";

const { ArtNet } = require("./ArtNet.js");
const {
  Beam,
  Universes
} = require('./config.js');

const defaultChannelData = [
    Beam.Color.White,
    Beam.Strobe.Off,
    /*dimmer*/ 0,
    Beam.Gobo.Off,
    Beam.Prism.Off,
    /*PrismRotation*/ 0,
    /*effects movement*/Beam.Unused,
    Beam.Frost.Off,
    /*focus*/ 0,
    /*pan*/ 0,
    /*pan fine*/ 0,
    /*tilt*/ 0,
    /*tilt fine*/ 0,
    /*function*/ Beam.Unused,
    Beam.Reset.None,
    Beam.Lamp.On
];

// const beamTestData = [
//   { channel: 1, channelData: [
//     Beam.Color.Red, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 2, channelData: [
//     Beam.Color.White, Beam.Strobe.On, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.On, /*PrismRotation*/ 190, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 3, channelData: [
//     Beam.Color.Blue, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.FourPoints, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 4, channelData: [
//     Beam.Color.Green, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.On, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 5, channelData: [
//     Beam.Color.Purple, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.On ] },
//   { channel: 6, channelData: [
//     Beam.Color.Orange, Beam.Strobe.Off, /*dimmer*/ 0, Beam.Gobo.Off, Beam.Prism.Off, /*PrismRotation*/ 0, Beam.Unused,
//     Beam.Frost.Off, /*focus*/ 0, /*pan*/ 0, 0, /*tilt*/ 0, Beam.Unused, Beam.Reset.None, Beam.Lamp.Off ] }
// ];

const testColors = [
  Beam.Color.White,
  Beam.Color.Red,
  Beam.Color.Lavender,
  Beam.Color.Yellow,
  Beam.Color.Green,
  Beam.Color.LightGreen,
  Beam.Color.Fluorescent,
  Beam.Color.Pink,
  Beam.Color.Orange,
  Beam.Color.Megenta,
  Beam.Color.Aquamarine,
  Beam.Color.Blue
  ];

const testGobos = [
  Beam.Gobo.Off,
  Beam.Gobo.Dot3,
  Beam.Gobo.Dot6,
  Beam.Gobo.ThreePoints,
  Beam.Gobo.FourPoints,
  Beam.Gobo.Star13,
  Beam.Gobo.Star15,
  Beam.Gobo.VerticalBar,
  Beam.Gobo.HorizontalBar
];

const testStrobes = [
  Beam.Strobe.Off,
  Beam.Strobe.On
];
 
const testPrisms = [
  Beam.Prism.Off,
  Beam.Prism.On
];
 
const testPrismRotations = [
  Beam.Prism.Off,
  Beam.Prism.Slow
];
 
const testPans = [
  0,
  64,
  128,
  192,
  255
];
  
const testTilts = [
  0,
  64,
  128,
  192,
  255
];
      
const artnet = new ArtNet();

const eastAddress = "10.7.84.55";
const westAddress = "10.7.84.56";

const beams = [
  { address: eastAddress, universe: 1, channel: (1 * Beam.ChannelsPerBeam) },
  { address: eastAddress, universe: 1, channel: (2 * Beam.ChannelsPerBeam) },
  { address: eastAddress, universe: 1, channel: (3 * Beam.ChannelsPerBeam) },
  { address: eastAddress, universe: 1, channel: (4 * Beam.ChannelsPerBeam) },
  { address: eastAddress, universe: 1, channel: (5 * Beam.ChannelsPerBeam) },
  { address: eastAddress, universe: 1, channel: (6 * Beam.ChannelsPerBeam) },
  { address: westAddress, universe: 1, channel: (1 * Beam.ChannelsPerBeam) },
  { address: westAddress, universe: 1, channel: (2 * Beam.ChannelsPerBeam) },
  { address: westAddress, universe: 1, channel: (3 * Beam.ChannelsPerBeam) },
  { address: westAddress, universe: 1, channel: (4 * Beam.ChannelsPerBeam) },
  { address: westAddress, universe: 1, channel: (5 * Beam.ChannelsPerBeam) },
  { address: westAddress, universe: 1, channel: (6 * Beam.ChannelsPerBeam) }
]

const eastUniverseInfo = {
  "address": eastAddress,
  "universe": 1,
  "sourcePort": 6454,
  "sendOnlyChangeData": false,
  "refreshInterval": 1000 };

  const westUniverseInfo = {
    "address": westAddress,
    "universe": 1,
    "sourcePort": 6454,
    "sendOnlyChangeData": false,
    "refreshInterval": 1000 };
  
artnet.configureUniverse(westUniverseInfo);
artnet.configureUniverse(eastUniverseInfo);

let testIndex = -1;
let colorIndex = -1;
let panIndex = -1;
let tiltIndex = -1;
let goboIndex = -1;
let strobeIndex = -1;
let prismIndex = -1;
let prismRotationIndex = -1;

function resetTestDataIndexes()
{
  colorIndex = -1;
  panIndex = -1;
  tiltIndex = -1;
  goboIndex = -1;
  strobeIndex = -1;
  prismIndex = -1;
  prismRotationIndex = -1;
}

function nextColor() {
  if (++colorIndex >= testColors.length) {
    colorIndex = 0;
    return true;
  }
  return false;
}
function nextGobo() {
  if (++goboIndex >= testGobos.length) {
    goboIndex = 0;
    return true;
  }
  return false;
}
function nextGobo() {
  if (++goboIndex >= testGobos.length) {
    goboIndex = 0;
    return true;
  }
  return false;
}
function nextStrobe() {
  if (++strobeIndex >= testStrobes.length) {
    strobeIndex = 0;
    return true;
  }
  return false;
}
function nextPrism() {
  if (++prismIndex >= testPrisms.length) {
    prismIndex = 0;
    return true;
  }
  return false;
}
function nextPrismRoation() {
  if (++prismRotationIndex >= testPrismRoation.length) {
    prismRotationIndex = 0;
    return true;
  }
  return false;
}
function nextPan() {
  if (++panIndex >= testPans.length) {
    panIndex = 0;
    return true;
  }
  return false;
}
function nextTilt() {
  if (++tiltIndex >= testTilts.length) {
    tiltIndex = 0;
    return true;
  }
  return false;
}

function nextTest() {
  if (++testIndex >= 1) {
    testIndex = 0;
  }
  resetTestDataIndexes();
}

function runNextTest() {

  switch (testIndex)
  {
    case 0:
      if (nextColor(channelData)) {
        if (nextTilt(channelData)) {
          if (nextPan(channelData)) {
              nextTest(channelData);
          }
        }
      }
      break;
  }

  var channelData = [];
  
  channelData[BeamChannel.ColorWheel] = testColors[colorIndex];
  channelData[BeamChannel.Strobe] = testStrobes[strobeIndex];
  channelData[BeamChannel.Dimmer] = 0;
  channelData[BeamChannel.Gobo] = testGobos[goboIndex];
  channelData[BeamChannel.Prism] = testPrisms[prismIndex];
  channelData[BeamChannel.PrismRotation] = testPrismRotations[prismRotationIndex];
  channelData[BeamChannel.EffectsMovement] = Beam.Unused;
  channelData[BeamChannel.Frost] = Beam.Frost.Off;
  channelData[BeamChannel.Focus] = 0;
  channelData[BeamChannel.Pan] = testPans[panIndex];
  channelData[BeamChannel.PanFine] = 0;
  channelData[BeamChannel.Tilt] = testColors[colorIndex];
  channelData[BeamChannel.TiltFine] = 0;
  channelData[BeamChannel.Macro] = Beam.Unused;
  channelData[BeamChannel.Reset] = Beam.Reset;
  channelData[BeamChannel.Lamp] = Beam.Lamp.On;
  
  console.log("--- BeamTest::", "testIndex", testIndex, 'data: ',  channelData);
  for (var beamIndex = 0; beamIndex < beams.length(); beamIndex++) {
    artnet.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, 1, channelData);
  }
  artnet.send(universe);
}

runNextTest();

setInterval(runNextTest, 5000);
