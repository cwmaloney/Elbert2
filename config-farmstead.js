"use strict";

const { E131 } = require("./E131.js");
const { Beam, Washer, OutlinePixel } = require("./config.js");
const { colorNameToRgb } = require("./config-colors.js");

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
const outlineAddresses = ["192.168.1.60", "192.168.1.61", "192.168.1.62"];
// This is the universe of the outline pixels
const outlineUniverses = [[100, 101, 102], [104, 105, 106], [108, 109, 110]];
// number of pixels per controller
const outlinePixelCount = [[170, 170, 170], [170, 170, 170], [170, 170, 170]];

const horizontalStringMap = [
  { start: 0, end: 169, controller: 0, universe: 0 },
  { start: 170, end: 335, controller: 0, universe: 1 },
  { start: 336, end: 505, controller: 2, universe: 0 },
  { start: 506, end: 675, controller: 2, universe: 1 }
];

const centerlStringMap = [
  { start: 0, end: 169, controller: 1, universe: 0 },
  { start: 170, end: 339, controller: 1, universe: 1 },
  { start: 340, end: 355, controller: 1, universe: 2 }
];

/////////////////////////////////////////////////////////////////////////////

function getOutlinePixelAddress(pixelNumber, map) {
  for (let segment of map) {
    if (pixelNumber >= segment.start && pixelNumber <= segment.end) {
      return {
        address: outlineAddresses[segment.controller],
        universe: outlineUniverses[segment.controller][segment.universe],
        pixelIndex: (pixelNumber - segment.start)
      };
    }
  }
  return null;
}

function getOutlineStringLength(map) {
  return map[map.length - 1].end;
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
  { address: beamsAddress, universe: beamsUniverse, channel: (0 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (1 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (2 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (3 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (4 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (5 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (6 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (7 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (8 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (9 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (10 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (11 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (12 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (13 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (14 * Beam.ChannelCount) + 1, on: true },
  { address: beamsAddress, universe: beamsUniverse, channel: (15 * Beam.ChannelCount) + 1, on: true }
];

const washers = [
  { address: washersAddress, universe: washersUniverse, channel: (0 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (1 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (2 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (3 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (4 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (5 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (6 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (7 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (8 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (9 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (10 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (11 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (12 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (13 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (14 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (15 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (16 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (17 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (18 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (19 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (20 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (21 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (22 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (23 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (24 * Washer.ChannelCount) + 1 },
  { address: washersAddress, universe: washersUniverse, channel: (25 * Washer.ChannelCount) + 1 },
];

/////////////////////////////////////////////////////////////////////////////

const defaultBeamChannelData = {
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

/////////////////////////////////////////////////////////////////////////////


function setDefaultBeamChannelData(beamChannelData) {
  beamChannelData[Beam.Channel.ColorWheel] = defaultBeamChannelData.ColorWheel;
  beamChannelData[Beam.Channel.Strobe] = defaultBeamChannelData.Strobe;
  beamChannelData[Beam.Channel.Dimmer] = defaultBeamChannelData.Dimmer;
  beamChannelData[Beam.Channel.Gobo] = defaultBeamChannelData.Gobo;
  beamChannelData[Beam.Channel.Prism] = defaultBeamChannelData.Prism;
  beamChannelData[Beam.Channel.PrismRotation] = defaultBeamChannelData.PrismRotation;
  beamChannelData[Beam.Channel.EffectsMovement] = defaultBeamChannelData.EffectsMovement;
  beamChannelData[Beam.Channel.Frost] = defaultBeamChannelData.Frost;
  beamChannelData[Beam.Channel.Focus] = defaultBeamChannelData.Focus;
  beamChannelData[Beam.Channel.Pan] = defaultBeamChannelData.Pan;
  beamChannelData[Beam.Channel.PanFine] = defaultBeamChannelData.PanFine;
  beamChannelData[Beam.Channel.Tilt] = defaultBeamChannelData.Tilt;
  beamChannelData[Beam.Channel.TiltFine] = defaultBeamChannelData.TiltFine;
  beamChannelData[Beam.Channel.Macro] = defaultBeamChannelData.Macro;
  beamChannelData[Beam.Channel.Reset] = defaultBeamChannelData.Reset;
  beamChannelData[Beam.Channel.Lamp] = defaultBeamChannelData.Lamp;
}


/////////////////////////////////////////////////////////////////////////////

function setBeamOnChannelData(beamChannelData) {
  beamChannelData[Beam.Channel.Lamp] = Beam.Lamp.On;
  beamChannelData[Beam.Channel.ColorWheel] = Beam.Color.White;
  beamChannelData[Beam.Channel.Pan] = 128;
  beamChannelData[Beam.Channel.Tilt] = 128;
}

/////////////////////////////////////////////////////////////////////////////

function setBeamOffChannelData(beamChannelData) {
  beamChannelData[Beam.Channel.Lamp] = Beam.Lamp.Off;
  beamChannelData[Beam.Channel.ColorWheel] = Beam.Color.White;
  beamChannelData[Beam.Channel.Pan] = 0;
  beamChannelData[Beam.Channel.Tilt] = 0;
}

/////////////////////////////////////////////////////////////////////////////

function sendBeamChannelData(beamIndex, beamChannelData) {
  e131.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, beamChannelData);
  e131.send(beamsAddress, beamsUniverse);
}

/////////////////////////////////////////////////////////////////////////////

function sendBeamsChannelData(beamChannelData) {
  for (var beamIndex = 0; beamIndex < beams.length; beamIndex++) {
    e131.setChannelData(beams[beamIndex].address, beams[beamIndex].universe, beams[beamIndex].channel, beamChannelData);
  }
  e131.send(beamsAddress, beamsUniverse);
}

/////////////////////////////////////////////////////////////////////////////

function sendBeamsOn() {
  const channelData = [];
  setDefaultBeamChannelData(channelData);
  setBeamOnChannelData(channelData);
  sendBeamsChannelData(channelData)
}

/////////////////////////////////////////////////////////////////////////////

function sendBeamsOff() {
  const channelData = [];
  setDefaultBeamChannelData(channelData);
  setBeamOffChannelData(channelData);
  sendBeamsChannelData(channelData)
}

/////////////////////////////////////////////////////////////////////////////

function sendWasherChannelData(pixelColor) {
  const pixelColorData = colorNameToRgb[pixelColor]
  for (var washerIndex = 0; washerIndex < washers.length; washerIndex++) {
    const washerData = [255, pixelColorData[0], pixelColorData[1], pixelColorData[2], 0, 0];
    e131.setChannelData(washers[washerIndex].address, washers[washerIndex].universe, washers[washerIndex].channel, washerData);
  }
  e131.send(washersAddress, washersUniverse);
}

/////////////////////////////////////////////////////////////////////////////

function sendOutlineChannelData(pixelColor1, pixelColor2, step) {
  const pixelColor1Data = colorNameToRgb[pixelColor1];
  const pixelColor2Data = colorNameToRgb[pixelColor2];

  const horizontalStringLength = getOutlineStringLength(horizontalStringMap);
  for (let pixelNumber = 0; pixelNumber < horizontalStringLength; pixelNumber++) {
    const pixelData = (pixelNumber >= (step * 2) && pixelNumber <= (horizontalStringLength - (step * 2)))
      ? pixelColor1Data : pixelColor2Data;
    const { address, universe, pixelIndex } = getOutlinePixelAddress(pixelNumber, horizontalStringMap);
    const pixelChannel = (pixelIndex * OutlinePixel.ChannelCount) + 1;
    e131.setChannelData(address, universe, pixelChannel, pixelData);
  }

  const centerStringLength = getOutlineStringLength(centerlStringMap);
  for (let pixelNumber = 0; pixelNumber < centerStringLength; pixelNumber++) {
    const pixelData = (pixelNumber >= step && pixelNumber <= (centerStringLength - step - 8))
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



module.exports = {
  Beam,
  Washer,
  OutlinePixel,
  
  setDefaultBeamChannelData,
  setBeamOffChannelData,

  sendBeamsChannelData,
  sendBeamsOff,

  sendWasherChannelData,
  sendOutlineChannelData
};
