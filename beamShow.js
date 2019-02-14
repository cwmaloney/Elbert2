"use strict";

const { E131 } = require("./E131.js");
const { Beam } = require("./config.js");

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

  const valentineColors = [
    Beam.Color.Red,
    Beam.Color.Magenta,
    Beam.Color.Pink,
    Beam.Color.White,
    ];


  const halloweenColors = [
    Beam.Color.Magenta,
    Beam.Color.Red,
    Beam.Color.Orange,
    Beam.Color.Blue,
    Beam.Color.Green,
    Beam.Color.White,
    ];

    const darkHalloweenColors = [
    Beam.Color.Magenta,
    Beam.Color.Red,
    Beam.Color.Orange,
    Beam.Color.Blue,
    Beam.Color.Green,
    ];
        
// const testGobos = [
//   Beam.Gobo.Off,
//   Beam.Gobo.Dot3,
//   Beam.Gobo.Dot6,
//   Beam.Gobo.ThreePoints,
//   Beam.Gobo.FourPoints,
//   Beam.Gobo.Star13,
//   Beam.Gobo.Star15,
//   Beam.Gobo.VerticalBar,
//   Beam.Gobo.HorizontalBar
// ];

// const testStrobes = [
//   Beam.Strobe.Off,
//   Beam.Strobe.Slow,
//   Beam.Strobe.Medium,
//   Beam.Strobe.Fast
// ];
 
// const testPrisms = [
//   Beam.Prism.Off,
//   Beam.Prism.On
// ];
 
// const testPrismRotations = [
//   Beam.PrismRotation.Off,
//   Beam.PrismRotation.Slow,
//   Beam.PrismRotation.Fast
// ];
  
// const testTilts = [
//   40,
//   50,
//   60,
//   70,
//   // 88,
//   // 100
// ];
      
const e131 = new E131();

const eastAddress = "239.255.0.121";
const westAddress = "239.255.0.121";
const eastUniverse = 121;
const westUniverse = 121;

const beams = [
  { address: eastAddress, universe: eastUniverse, channel: (0 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: eastUniverse, channel: (1 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: eastUniverse, channel: (2 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: eastUniverse, channel: (3 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: eastUniverse, channel: (4 * Beam.ChannelsPerBeam)+1 },
  { address: eastAddress, universe: eastUniverse, channel: (5 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: westUniverse, channel: (6 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: westUniverse, channel: (7 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: westUniverse, channel: (8 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: westUniverse, channel: (9 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: westUniverse, channel: (10 * Beam.ChannelsPerBeam)+1 },
  { address: westAddress, universe: westUniverse, channel: (11 * Beam.ChannelsPerBeam)+1 }
]

const eastUniverseInfo = {
  "address": eastAddress,
  "universe": eastUniverse,
  "sourcePort": 5568,
  "sendOnlyChangeData": false,
  "sendSequenceNumbers": false,
  "refreshInterval": 1000
};

  const westUniverseInfo = {
    "address": westAddress,
    "universe": westUniverse,
    "sourcePort": 5568,
    "sendOnlyChangeData": false,
    "sendSequenceNumbers": false,
    "refreshInterval": 1000
  };
  
e131.configureUniverse(eastUniverseInfo);
e131.configureUniverse(westUniverseInfo);

let channelData = [];

let defaultLamp = Beam.Lamp.On;

function setDefaultChannelData() {
  channelData[Beam.BeamChannel.ColorWheel] = Beam.Color.White
  channelData[Beam.BeamChannel.Strobe] = Beam.Strobe.Open;
  channelData[Beam.BeamChannel.Dimmer] = Beam.Dimmer.Off;
  channelData[Beam.BeamChannel.Gobo] = Beam.Gobo.Off;
  channelData[Beam.BeamChannel.Prism] = Beam.Prism.Off;
  channelData[Beam.BeamChannel.PrismRotation] = Beam.PrismRotation.Off;
  channelData[Beam.BeamChannel.EffectsMovement] = Beam.Unused;
  channelData[Beam.BeamChannel.Frost] = Beam.Frost.Off;
  channelData[Beam.BeamChannel.Focus] = 127;
  channelData[Beam.BeamChannel.Pan] = 0;
  channelData[Beam.BeamChannel.PanFine] = 0;
  channelData[Beam.BeamChannel.Tilt] = 45;
  channelData[Beam.BeamChannel.TiltFine] = 0;
  channelData[Beam.BeamChannel.Macro] = Beam.Unused;
  channelData[Beam.BeamChannel.Reset] = Beam.Reset.None;
  channelData[Beam.BeamChannel.Lamp] = defaultLamp;
}


//  ====== Pan =====

let panStart = 0;
let panStop = 160;
let panInterval = 1;
let panValue = panStart;

function setPans(newPanStart = 0, newPanStop = 170, newPanInterval = 1) {
  panStart = newPanStart;
  panStop = newPanStop;
  panInterval = newPanInterval;
  panValue = panStart;
  channelData[Beam.BeamChannel.Pan] = panValue;
}

function nextPan() {
  let reset = false;
  panValue += panInterval;
  if (panValue >= panStop) {
    panValue = panStart;
    reset = true;
  }
  if (panValue == 0) {
    stepInterval = 2000;
  } else {
    stepInterval = 125;
  }
  channelData[Beam.BeamChannel.Pan] = panValue;
  return reset;
}

//  ====== Tilt =====

let tiltStart = 38;
let tiltStop = 58;
let tiltInterval = 10;
let tiltIndex = tiltStart;

function setTilts(newTiltStart = 38, newTiltStop = 58, newTiltInterval = 10) {
  tiltStart = newTiltStart;
  tiltStop = newTiltStop;
  tiltInterval = newTiltInterval;
  tiltIndex = tiltStart;
  channelData[Beam.BeamChannel.Tilt] = tiltStart;
}

function nextTilt() {
  let reset = false;
  tiltIndex += tiltInterval;
  if (tiltIndex > tiltStop) {
    tiltIndex = tiltStart;
    reset = true;
  }
  channelData[Beam.BeamChannel.Tilt] = tiltIndex;
  return reset;
}

//  ====== Color =====

let currentColors = standardColors;
let colorIndex = tiltStart;

function setColors(newcolors) {
  currentColors = newcolors;
  colorIndex = 0;
  channelData[Beam.BeamChannel.ColorWheel] = currentColors[colorIndex];
}

function nextColor() {
  let reset = false;
  if (++colorIndex >= currentColors.length) {
    colorIndex = 0;
    reset = true;
  }
  channelData[Beam.BeamChannel.ColorWheel] = currentColors[colorIndex];
  return reset;
}

// ===== scenes =====

let sceneIndex = 0;

setTilts();

function nextScene() {
  if (++sceneIndex > 0) sceneIndex = 0;

  setScene();
}

let stepCounter = 0;

function setScene() {
  setDefaultChannelData();

  switch (sceneIndex)
  {
    case 0:
      //pan from 70 to 175 in increments of 1
      setPans(70, 175, 1);
      //if you keep the number of tilt increments and colors different the each color will
      //cycle through all the different tilt angles, in this case 6 tilts and 5 colors
      //tilt from 35 to 110 in increments of 15 (6 total 35,50,65,80,95,110)
      setTilts(35, 110, 15);
      //set a palette of colors (valentine has 5)
      setColors(valentineColors);
      break;

    // case 2:
    //   // gobo
    //   goboIndex = 1;
    //   channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];
  
        //  setPans();
   
    //   break;
    // case 3:
    //   // prism and prism roatation
    //   prismIndex = 1;
    //   channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];

    //   prismRotationIndex = 0;
    //   channelData[Beam.BeamChannel.PrismRotation] = testPrismRotations[prismRotationIndex];
  
    //  setPans();
 
    //   break;
    // case 4:
    //   // strobe
    //   strobeIndex = 1;
    //   channelData[Beam.BeamChannel.Strob] = testStrobes[strobeIndex];

    //  setPans

    //   break;
  }

}

let stepInterval = 1000;

function nextStep() {

  switch (sceneIndex)
  {
    case 100:
      if (++stepCounter > 10)
        process.exit(0);
      break;
    case 0:
      if (nextPan()) {
        nextTilt();
        if (nextColor()) {
          //nextScene()
        }
      }
      break;
    // case 1:
    //   if (nextPan()) {
    //     if (nextTilt()) {
    //       nextScene()
    //     }
    //   }
    //   break;
    // case 2:
    //   if (nextPan()) {
    //     if (nextGobo()) {
    //        nextScene()
    //     }
    //   }
    //   break;
    // case 3:
    //   if (nextPan()) {
    //     if (nextPrism()) {
    //       if (nextPrismRoation()) {
    //        nextScene()
    //       }
    //     }
    //   }
    //   break;
    // case 4:
    //   if (nextPan()) {
    //     if (nextStrobe()) {
    //         nextScene()
    //     }
    //   }
    //   break;
  }

  sendChannelData();

  setTimeout(nextStep, stepInterval);
}
  
function sendChannelData()
{
  console.log("--", Date.now()/1000,
    " test=", sceneIndex,
    " c=", channelData[Beam.BeamChannel.ColorWheel],
    " p=", channelData[Beam.BeamChannel.Pan],
    " t=", channelData[Beam.BeamChannel.Tilt],
    " -- strobe=", channelData[Beam.BeamChannel.Strobe],
    " gobo=", channelData[Beam.BeamChannel.Gobo],
    " prizm=", channelData[Beam.BeamChannel.Prism],
    " prismRotation=", channelData[Beam.BeamChannel.PrismRotation],
    " lamp=", channelData[Beam.BeamChannel.Lamp],
    " -- timeout=", stepInterval);

  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    e131.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, channelData);
  }
  e131.send(eastUniverseInfo.address, eastUniverseInfo.universe);
  e131.send(westUniverseInfo.address, westUniverseInfo.universe);
}

for (let j = 0; j < process.argv.length; j++) {
  console.log(j + ':' + (process.argv[j]));

  if (process.argv[j] == "off") {
    defaultLamp = Beam.Lamp.Off;
    setDefaultChannelData();
    sendChannelData();
    process.exit(0);
  }
}

setDefaultChannelData();

setScene();

setTimeout(nextStep, stepInterval);

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


// let goboIndex = 0;
// let strobeIndex = 0;
// let prismIndex = 0;
// let prismRotationIndex = 0;

// function nextGobo() {
//   let reset = false;
//   if (++goboIndex >= testGobos.length) {
//     goboIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.Gobo] = testGobos[goboIndex];
//   return reset;
// }

// function nextPrism() {
//   let reset = false;
//   if (++prismIndex >= testPrisms.length) {
//     prismIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.Prism] = testPrisms[prismIndex];
//   return reset;
// }
// function nextPrismRoation() {
//   let reset = false;
//   if (++prismRotationIndex >= testPrismRotations.length) {
//     prismRotationIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.PrismRoation] = testPrismRotations[prismRotationIndex];
//   return reset;
// }

// function nextStrobe() {
//   let reset = false;
//   if (++strobeIndex >= testStrobes.length) {
//     strobeIndex = 0;
//     reset = true;
//   }
//   channelData[Beam.BeamChannel.Strobe] = testStrobes[strobeIndex];
//   return reset;
// }
