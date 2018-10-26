
"use strict";

const { ArtNet } = require("./ArtNet.js");
const { Beam } = require("./config.js");

// const defaultChannelData = [
//     Beam.Color.White,
//     Beam.Strobe.Off,
//     /*dimmer*/ 0,
//     Beam.Gobo.Off,
//     Beam.Prism.Off,
//     /*PrismRotation*/ 0,
//     /*effects movement*/Beam.Unused,
//     Beam.Frost.Off,
//     /*focus*/ 0,
//     /*pan*/ 0,
//     /*pan fine*/ 0,
//     /*tilt*/ 0,
//     /*tilt fine*/ 0,
//     /*function*/ Beam.Unused,
//     Beam.Reset.None,
//     Beam.Lamp.On
// ];

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
  Beam.PrismRotation.Off,
  Beam.PrismRotation.Slow,
  Beam.PrismRotation.Fast
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
  "refreshInterval": 1000
};

  const westUniverseInfo = {
    "address": westAddress,
    "universe": 1,
    "sourcePort": 6454,
    "sendOnlyChangeData": false,
    "refreshInterval": 1000
  };
  
artnet.configureUniverse(eastUniverseInfo);
artnet.configureUniverse(westUniverseInfo);

let channelData = [];

function setDefaultChannelData() {
  channelData[Beam.BeamChannel.ColorWheel] = Beam.Color.White
  channelData[Beam.BeamChannel.Strobe] = Beam.Strobe.Off;
  channelData[Beam.BeamChannel.Dimmer] = 0;
  channelData[Beam.BeamChannel.Gobo] = Beam.Gobo.Off;
  channelData[Beam.BeamChannel.Prism] = Beam.Prism.Off;
  channelData[Beam.BeamChannel.PrismRotation] = Beam.PrismRotation.Off;
  channelData[Beam.BeamChannel.EffectsMovement] = Beam.Unused;
  channelData[Beam.BeamChannel.Frost] = Beam.Frost.Off;
  channelData[Beam.BeamChannel.Focus] = 0;
  channelData[Beam.BeamChannel.Pan] = 0;
  channelData[Beam.BeamChannel.PanFine] = 0;
  channelData[Beam.BeamChannel.Tilt] = 128;
  channelData[Beam.BeamChannel.TiltFine] = 0;
  channelData[Beam.BeamChannel.Macro] = Beam.Unused;
  channelData[Beam.BeamChannel.Reset] = Beam.Reset.None;
  channelData[Beam.BeamChannel.Lamp] = Beam.Lamp.On;
}
setDefaultChannelData();

let testIndex = 0;
let colorIndex = -1;
let panIndex = 0;
let tiltIndex = 0;
let goboIndex = 0;
let strobeIndex = 0;
let prismIndex = 0;
let prismRotationIndex = 0;

function nextColor() {
  let reset = false;
  if (++colorIndex >= testColors.length) {
    colorIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.ColorWheel] = testColors[colorIndex];
  return reset;
}
function nextGobo() {
  let reset = false;
  if (++goboIndex >= testGobos.length) {
    goboIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];
  return reset;
}

function nextPrism() {
  let reset = false;
  if (++prismIndex >= testPrisms.length) {
    prismIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];
  return reset;
}
function nextPrismRoation() {
  let reset = false;
  if (++prismRotationIndex >= testPrismRotations.length) {
    prismRotationIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.PrismRoation] = testPrismRotations[prismRotationIndex];
  return reset;
}

function nextStrobe() {
  let reset = false;
  if (++strobeIndex >= testStrobes.length) {
    strobeIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.Strobe] = testStrobes[strobeIndex];
  return reset;
}

function nextPan() {
  let reset = false;
  if (++panIndex >= testPans.length) {
    panIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.Pan] = testPans[panIndex];
  return reset;
}
function nextTilt() {
  let reset = false;
  if (++tiltIndex >= testTilts.length) {
    tiltIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.Tilt] = testTilts[tiltIndex];
  return reset;
}

function nextTest() {
  if (++testIndex > 4) testIndex = 0;
  setDefaultChannelData();
  switch (testIndex)
  {
    case 0:
      // colors
      colorIndex = 0;
      channelData[Beam.BeamChannel.ColorWheel] = testPans[colorIndex];
      break;
    case 1:
      // pan & tilt
      panIndex = 0;
      channelData[Beam.BeamChannel.Pan] = testPans[panIndex];

      tiltIndex = 1;
      channelData[Beam.BeamChannel.Tilt] = testTilts[tiltIndex];
      break;
    case 2:
      // gobo
      goboIndex = 1;
      channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];

      tiltIndex = 2;
      channelData[Beam.BeamChannel.Tilt] = testTilts[tiltIndex];
   
      break;
    case 3:
      // prism and prism roatation
      prismIndex = 1;
      channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];

      prismRotationIndex = 0;
      channelData[Beam.BeamChannel.PrismRotation] = testPrismRotations[prismRotationIndex];

      panIndex = 0;
      channelData[Beam.BeamChannel.Pan] = testPans[panIndex];

      panIndex = 0;    
      break;
    case 4:
      // strobe
      strobeIndex = 1;
      channelData[Beam.BeamChannel.Strob] = testStrobes[strobeIndex];

      panIndex = 0;
      channelData[Beam.BeamChannel.Pan] = testPans[panIndex];
      break;
  }
}

function runNextTest() {

  switch (testIndex)
  {
    case 0:
      if (nextColor()) {
        nextTest()
      }
      break;
    case 1:
      if (nextPan()) {
        if (nextTilt()) {
          nextTest()
        }
      }
      break;
    case 2:
      if (nextGobo()) {
        if (nextPan()) {
           nextTest()
        }
      }
      break;
    case 3:
      if (nextPrism()) {
        if (nextPrismRoation()) {
          if (nextPan()) {
           nextTest()
          }
        }
      }
      break;
    case 4:
      if (nextStrobe()) {
        if (nextPan()) {
           nextTest()
        }
      }
      break;
  }
  
  // channelData[Beam.BeamChannel.Strobe] = testStrobes[strobeIndex];
  // channelData[Beam.BeamChannel.Dimmer] = 0;
  // channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];
  // channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];
  // channelData[Beam.BeamChannel.PrismRotation] = testPrismRotations[prismRotationIndex];
  // channelData[Beam.BeamChannel.EffectsMovement] = Beam.Unused;
  // channelData[Beam.BeamChannel.Frost] = Beam.Frost.Off;
  // channelData[Beam.BeamChannel.Focus] = 0;
  // channelData[Beam.BeamChannel.Pan] = testPans[panIndex];
  // channelData[Beam.BeamChannel.PanFine] = 0;
  // channelData[Beam.BeamChannel.Tilt] = testTilts[tiltIndex];
  // channelData[Beam.BeamChannel.TiltFine] = 0;
  // channelData[Beam.BeamChannel.Macro] = Beam.Unused;
  // channelData[Beam.BeamChannel.Reset] = Beam.Reset.None;
  // channelData[Beam.BeamChannel.Lamp] = Beam.Lamp.On;
  
  console.log("--- BeamTest::",
    " test=", testIndex,
    " c=", channelData[Beam.BeamChannel.ColorWheel],
    " s=", channelData[Beam.BeamChannel.Strobe],
    " g=", channelData[Beam.BeamChannel.Gobo],
    " pz=", channelData[Beam.BeamChannel.Prism],
    " pr=", channelData[Beam.BeamChannel.PrismRotation],
    " p=", channelData[Beam.BeamChannel.Pan],
    " t=", channelData[Beam.BeamChannel.Tilt],
    " l=", channelData[Beam.BeamChannel.Lamp]);

  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    artnet.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, 1, channelData);
  }
  artnet.send(eastUniverseInfo.address, eastUniverseInfo.universe);
  artnet.send(westUniverseInfo.address, westUniverseInfo.universe);
}

runNextTest();

setInterval(runNextTest, 10);
