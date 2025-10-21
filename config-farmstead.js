"use strict";

const { E131 } = require("./E131.js");
const { Beam, Washer, OutlinePixel, OrnamentPixel, OrnamentOutlinePixel } = require("./config.js");
const { colorNameToRgb } = require("./config-colors.js");

const lampChangeWait = 500;

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

const centerStringMap = [
  { start: 0, end: 169, controller: 1, universe: 0 },
  { start: 170, end: 339, controller: 1, universe: 1 },
  { start: 340, end: 365, controller: 1, universe: 2 }
];

const pumpkinsStackControllers = {
  east: {
    address: "192.168.1.112",
    universes: [244, 245, 246, 247, 248]
  },
  west: {
    address: "192.168.1.114",
    universes: [234, 235, 236, 237, 238]
  }
};
const pumpkinStackControllerArray = [pumpkinsStackControllers.east, pumpkinsStackControllers.west];

const spookyTreeControllers = {
  east: {
    address: "192.168.1.112",
    universes: [249, 250, 251, 252]
  },
  west: {
    address: "192.168.1.114",
    universes: [239, 240, 241, 242]
  }
};
const spookyTreeControllerArray = [spookyTreeControllers.east, spookyTreeControllers.west];

const treeOutlinePixels = 650;
const treeFacePixels = 150;

// east face is face1
const treeFace1LeftEye = [130, 131, 132, 133, 134, 135, 136, 137, 143, 144, 145, 146, 147, 148, 149, 150];
const treeFace1RightEye = [111, 112, 113, 114, 115, 116, 117, 118, 119, 121, 123, 127, 126, 128, 129];
const treeFace1SmallRoundMouth = [40, 41, 42, 44, 45, 46, 47, 48, 49, 54, 53, 70, 82, 81, 84, 85, 86, 91, 92, 93, 95, 63, 62, 61];

const treeFace2LeftEye = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const treeFace2RightEye = [23, 24, 25, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44];
const treeFace2SmallRoundMouth = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 70, 71, 72, 73, 83, 84, 90, 91, 92];

const pumpkinOutlinePixels = 650;

const pumpkinTopFaceLeftEye = [521, 522, 523, 524, 525, 526, 527, 530, 531];
const pumpkinTopFaceRightEye = [433, 434, 435, 436, 437, 438, 439, 440, 443, 444, 445, 446, 447];
const pumpkinTopFaceMouth = [462, 463, 464, 465, 466, 468, 488, 489, 490, 491, 493, 494, 454, 455, 456, 457, 458, 459, 460, 461];

const pumpkinMiddleFaceLeftEye = [336, 337, 338, 339, 340, 321, 322, 323, 324, 325, 326, 327, 328, 329];
const pumpkinMiddleFaceRightEye = [307, 308, 319, 310, 311, 312, 313, 346, 345, 344, 343, 342, 341, 318, 319, 320];
const pumpkinMiddleFaceMouth = [277, 278, 279, 280, 281, 265, 305, 36, 302, 301, 300, 297, 296, 295, 294, 293, 292, 291, 290, 289, 288, 287, 285, 284, 257, 256, 255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245, 235, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 238, 239, 240, 241, 269];

const pumpkinBottomFaceLeftEye = [134, 135, 136, 137, 138, 141, 142, 143, 144, 145];
const pumpkinBottomFaceRightEye = [78, 79, 80, 81, 82, 85, 86, 87, 88, 89, 91];
const pumpkinBottomFaceMouth = [190, 189, 188, 187, 186, 185, 184, 183, 182, 181, 180, 179, 178, 177, 176, 175, 174, 173, 172, 171, 1114, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 123, 124, 125, 125, 127, 156, 157, 158];
const pumpkinOutlineSegments = [[1, 77], [82, 104], [128, 133], [147, 155], [197, 221], [347, 432], [449, 453], [498, 521], [533, 558], [570, 650]];
const pumpkinStem = [559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569];

const ornaments = [
  {
    name: "east",
    controllers: [
      {
        name: "east",
        address: "192.168.1.100",
        universes: [190, 191, 192, 193]
      },
      {
        name: "west",
        address: "192.168.1.101",
        universes: [194, 195, 196, 197]
      },
    ],
    outlineControllers: [
      {
        address: "192.168.1.104",
        universes: [206, 207]
      }
    ],
    topControllers: [
      {
        address: "192.168.1.104",
        universes: [209]
      }
    ]
  },
  {
    name: "west",
    controllers: [
      {
        name: "east",
        address: "192.168.1.106",
        universes: [212, 213, 214, 215]
      },
      {
        name: "west",
        address: "192.168.1.107",
        universes: [216, 217, 218, 219]
      }
    ],
    outlineControllers: [
      {
        address: "192.168.1.110",
        universes: [231, 232]
      }
    ],
    topControllers: [
      {
        address: "192.168.1.110",
        universes: [234]
      }
    ]
  }
];

const ornamentCount = 2;
const controllersPerOrnament = 2;
const ornamentRadialsPerController = 32;
const ornamentPixelsPerRadial = 21;
const ornamentPixelsPerController = ornamentRadialsPerController * ornamentPixelsPerRadial;
const ornamentPixelsPerUniverse = ornamentPixelsPerController / 4;
const pixelsPerOrnament = ornamentPixelsPerController * controllersPerOrnament;
const ornamentOutlinePixelCount = 326;
const ornamentOutlinePixelsPerController = 326;
const ornamentOutlinePixelsPerUniverse = 170;
const ornamentTopPixelCount = 120;
const ornamentTopPixelsPerController = 170;
const ornamentTopPixelsPerUniverse = 170;

function getPumpkinMouthIndexes() {
  let indexes = [];

  for (let i = 0; i < 10; ++i) {
    indexes.push(getRadialRadiusPixel(i, 9));
    indexes.push(getRadialRadiusPixel(i, 10));
    indexes.push(getRadialRadiusPixel(i, 11));
    indexes.push(getRadialRadiusPixel(i, 12));
    indexes.push(getRadialRadiusPixel(i, 13));
  }
  indexes.push(getRadialRadiusPixel(10, 10));
  indexes.push(getRadialRadiusPixel(10, 11));
  indexes.push(getRadialRadiusPixel(10, 12));
  indexes.push(getRadialRadiusPixel(11, 11));

  for (let i = 54; i < 64; ++i) {
    indexes.push(getRadialRadiusPixel(i, 9));
    indexes.push(getRadialRadiusPixel(i, 10));
    indexes.push(getRadialRadiusPixel(i, 11));
    indexes.push(getRadialRadiusPixel(i, 12));
    indexes.push(getRadialRadiusPixel(i, 13));
  }
  indexes.push(getRadialRadiusPixel(53, 10));
  indexes.push(getRadialRadiusPixel(53, 11));
  indexes.push(getRadialRadiusPixel(53, 12));
  indexes.push(getRadialRadiusPixel(52, 11));

  return indexes;
}

function getPumpkinEyesIndexes(top, height, openHeight) {
  let indexes = [];

  const leftEyeRadials = [30, 29, 28, 27, 26, 25, 24, 23];
  const rightEyeRadials = [35, 36, 37, 38, 39, 40, 41, 42];
  const width = leftEyeRadials.length;

  const bottom = top - height + 1;
  for (let radialIndex = 0; radialIndex < width; ++radialIndex) {
    const radialHeight = Math.max(openHeight - radialIndex, 1)
    const radialTop = bottom + radialHeight - 1;
    for (let radius = bottom; radius <= radialTop; ++radius) {
      indexes.push(getRadialRadiusPixel(leftEyeRadials[radialIndex], radius));
      indexes.push(getRadialRadiusPixel(rightEyeRadials[radialIndex], radius));
    }
  }

  return indexes;
}

function getPumpkinEyesCentersIndexes(top, height, openHeight) {
  let indexes = [];

  const leftEyeRadials = [30, 29, 28, 27, 26, 25, 24, 23];
  const rightEyeRadials = [35, 36, 37, 38, 39, 40, 41, 42];
  const width = leftEyeRadials.length;

  const bottom = top - height + 1;
  for (let radialIndex = 0; radialIndex < width; ++radialIndex) {
    const radialHeight = Math.max(openHeight - radialIndex, 1)
    const radialTop = bottom + radialHeight - 1;
    for (let radius = bottom; radius <= radialTop; ++radius) {
      indexes.push(getRadialRadiusPixel(leftEyeRadials[radialIndex], radius));
      indexes.push(getRadialRadiusPixel(rightEyeRadials[radialIndex], radius));
    }
  }

  return indexes;
}


function getPumpkinNoseIndexes() {
  let indexes = [];

  const noseTopRadials = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
  for (let i = 0; i < noseTopRadials.length; ++i) {
    indexes.push(getRadialRadiusPixel(noseTopRadials[i], 0));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] + 21, 0));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] - 21, 0));
  }
  for (let i = 2; i < noseTopRadials.length - 2; ++i) {
    indexes.push(getRadialRadiusPixel(noseTopRadials[i], 1));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] + 21, 1));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] - 21, 1));
  }
  for (let i = 4; i < noseTopRadials.length - 4; ++i) {
    indexes.push(getRadialRadiusPixel(noseTopRadials[i], 2));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] + 21, 2));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] - 21, 2));
  }
  for (let i = 6; i < noseTopRadials.length - 6; ++i) {
    indexes.push(getRadialRadiusPixel(noseTopRadials[i], 3));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] + 21, 3));
    indexes.push(getRadialRadiusPixel(noseTopRadials[i] - 21, 3));
  }

  return indexes;
}


function getPumpkinTeethIndexes() {
  let indexes = [];

  indexes.push(getRadialRadiusPixel(1, 9));
  indexes.push(getRadialRadiusPixel(2, 9));
  indexes.push(getRadialRadiusPixel(3, 9));
  indexes.push(getRadialRadiusPixel(1, 10));
  indexes.push(getRadialRadiusPixel(2, 10));
  indexes.push(getRadialRadiusPixel(3, 10));
  indexes.push(getRadialRadiusPixel(1, 11));
  indexes.push(getRadialRadiusPixel(2, 11));
  indexes.push(getRadialRadiusPixel(3, 11));

  indexes.push(getRadialRadiusPixel(6, 11));
  indexes.push(getRadialRadiusPixel(7, 11));
  indexes.push(getRadialRadiusPixel(8, 11));
  indexes.push(getRadialRadiusPixel(6, 12));
  indexes.push(getRadialRadiusPixel(7, 12));
  indexes.push(getRadialRadiusPixel(8, 12));
  indexes.push(getRadialRadiusPixel(6, 13));
  indexes.push(getRadialRadiusPixel(7, 13));
  indexes.push(getRadialRadiusPixel(8, 13));

  indexes.push(getRadialRadiusPixel(60, 11));
  indexes.push(getRadialRadiusPixel(61, 11));
  indexes.push(getRadialRadiusPixel(62, 11));
  indexes.push(getRadialRadiusPixel(60, 12));
  indexes.push(getRadialRadiusPixel(61, 12));
  indexes.push(getRadialRadiusPixel(62, 12));
  indexes.push(getRadialRadiusPixel(60, 13));
  indexes.push(getRadialRadiusPixel(61, 13));
  indexes.push(getRadialRadiusPixel(62, 13));

  indexes.push(getRadialRadiusPixel(55, 9));
  indexes.push(getRadialRadiusPixel(56, 9));
  indexes.push(getRadialRadiusPixel(57, 9));
  indexes.push(getRadialRadiusPixel(55, 10));
  indexes.push(getRadialRadiusPixel(56, 10));
  indexes.push(getRadialRadiusPixel(57, 10));
  indexes.push(getRadialRadiusPixel(55, 11));
  indexes.push(getRadialRadiusPixel(56, 11));
  indexes.push(getRadialRadiusPixel(57, 11));

  return indexes;
}



function getPumpkinTongueIndexes() {
  let indexes = [];

  indexes.push(getRadialRadiusPixel(6, 11));
  indexes.push(getRadialRadiusPixel(7, 11));
  indexes.push(getRadialRadiusPixel(8, 11));
  indexes.push(getRadialRadiusPixel(9, 11));
  indexes.push(getRadialRadiusPixel(10, 11));
  indexes.push(getRadialRadiusPixel(11, 11));

  indexes.push(getRadialRadiusPixel(6, 12));
  indexes.push(getRadialRadiusPixel(7, 12));
  indexes.push(getRadialRadiusPixel(8, 12));
  indexes.push(getRadialRadiusPixel(9, 12));
  indexes.push(getRadialRadiusPixel(10, 12));
  indexes.push(getRadialRadiusPixel(11, 12));

  indexes.push(getRadialRadiusPixel(7, 13));
  indexes.push(getRadialRadiusPixel(8, 13));
  indexes.push(getRadialRadiusPixel(9, 13));
  indexes.push(getRadialRadiusPixel(10, 13));

  indexes.push(getRadialRadiusPixel(7, 14));
  indexes.push(getRadialRadiusPixel(8, 14));
  indexes.push(getRadialRadiusPixel(9, 14));
  indexes.push(getRadialRadiusPixel(10, 14));

  indexes.push(getRadialRadiusPixel(7, 15));
  indexes.push(getRadialRadiusPixel(8, 15));
  indexes.push(getRadialRadiusPixel(9, 15));
  indexes.push(getRadialRadiusPixel(10, 15));

  indexes.push(getRadialRadiusPixel(7, 16));
  indexes.push(getRadialRadiusPixel(8, 16));
  indexes.push(getRadialRadiusPixel(9, 16));
  indexes.push(getRadialRadiusPixel(10, 16));

  indexes.push(getRadialRadiusPixel(8, 17));
  indexes.push(getRadialRadiusPixel(9, 17));

  indexes.push(getRadialRadiusPixel(8, 18));
  indexes.push(getRadialRadiusPixel(9, 18));

  indexes.push(getRadialRadiusPixel(8, 19));
  indexes.push(getRadialRadiusPixel(9, 19));

  return indexes;
}

// These are the IP addresses of the spider controllers
const spiderAddresses = ["192.168.1.54", "192.168.1.55"];

// This is the universe of the spider pixels
const spidersPerController = 7;
const spiderUniverses = [[60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], [72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]];

// number of pixels per spider
const pixelsPerSpider = 189;
const pixelsPerUniverse = 170;
const channelsPerSpiderUniverse = 510;

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

function getOrnamentPixelAddress(ornamentIndex, pixelNumber) {
  const ornament = ornaments[ornamentIndex];
  const controllerIndex = Math.floor(pixelNumber / ornamentPixelsPerController);
  const controllerPixelIndex = pixelNumber % ornamentPixelsPerController;
  const controller = ornament.controllers[controllerIndex];
  const universeIndex = Math.floor(controllerPixelIndex / ornamentPixelsPerUniverse);
  const universePixelIndex = controllerPixelIndex % ornamentPixelsPerUniverse;
  const universe = controller.universes[universeIndex];
  return {
    address: controller.address,
    universe: universe,
    pixelIndex: universePixelIndex
  };
}

function getOrnamentOutlinePixelAddress(ornamentIndex, pixelNumber) {
  const ornament = ornaments[ornamentIndex];
  const controllerIndex = Math.floor(pixelNumber / ornamentOutlinePixelsPerController);
  const controllerPixelIndex = pixelNumber % ornamentOutlinePixelsPerController;
  const controller = ornament.outlineControllers[controllerIndex];
  const universeIndex = Math.floor(controllerPixelIndex / ornamentOutlinePixelsPerUniverse);
  const universePixelIndex = controllerPixelIndex % ornamentOutlinePixelsPerUniverse;
  const universe = controller.universes[universeIndex];
  return {
    address: controller.address,
    universe: universe,
    pixelIndex: universePixelIndex
  };
}


function getOrnamentTopPixelAddress(ornamentIndex, pixelNumber) {
  const ornament = ornaments[ornamentIndex];
  const controllerIndex = Math.floor(pixelNumber / ornamentTopPixelsPerController);
  const controllerPixelIndex = pixelNumber % ornamentTopPixelsPerController;
  const controller = ornament.topControllers[controllerIndex];
  const universeIndex = Math.floor(controllerPixelIndex / ornamentTopPixelsPerUniverse);
  const universePixelIndex = controllerPixelIndex % ornamentTopPixelsPerUniverse;
  const universe = controller.universes[universeIndex];
  return {
    address: controller.address,
    universe: universe,
    pixelIndex: universePixelIndex
  };
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

// configure ornament universes
for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
  const ornament = ornaments[ornamentIndex];
  for (let controllerIndex = 0; controllerIndex < ornament.controllers.length; controllerIndex++) {
    const controller = ornament.controllers[controllerIndex];
    for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
      const universe = controller.universes[universeIndex];
      e131.configureUniverse({
        "address": controller.address,
        "universe": universe,
        "sourcePort": 5568,
        "sendOnlyChangeData": false,
        "sendSequenceNumbers": false,
        "refreshInterval": 1000
      });
    }
  }
  for (let controllerIndex = 0; controllerIndex < ornament.outlineControllers.length; controllerIndex++) {
    const controller = ornament.outlineControllers[controllerIndex];
    for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
      const universe = controller.universes[universeIndex];
      e131.configureUniverse({
        "address": controller.address,
        "universe": universe,
        "sourcePort": 5568,
        "sendOnlyChangeData": false,
        "sendSequenceNumbers": false,
        "refreshInterval": 1000
      });
    }
  }
  for (let controllerIndex = 0; controllerIndex < ornament.topControllers.length; controllerIndex++) {
    const controller = ornament.topControllers[controllerIndex];
    for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
      const universe = controller.universes[universeIndex];
      e131.configureUniverse({
        "address": controller.address,
        "universe": universe,
        "sourcePort": 5568,
        "sendOnlyChangeData": false,
        "sendSequenceNumbers": false,
        "refreshInterval": 1000
      });
    }
  }
}

// configure spider universes
for (let controllerIndex = 0; controllerIndex < spiderAddresses.length; controllerIndex++) {
  const universes = spiderUniverses[controllerIndex];
  for (let universeIndex = 0; universeIndex < universes.length; universeIndex++) {
    const universe = universes[universeIndex];
    e131.configureUniverse({
      "address": spiderAddresses[controllerIndex],
      "universe": universe,
      "sourcePort": 5568,
      "sendOnlyChangeData": false,
      "sendSequenceNumbers": false,
      "refreshInterval": 1000
    });
  }
}

// configure spooky tree universes
for (let controllerIndex = 0; controllerIndex < spookyTreeControllerArray.length; controllerIndex++) {
  const controller = spookyTreeControllerArray[controllerIndex];
  const universes = controller.universes;
  for (let universeIndex = 0; universeIndex < universes.length; universeIndex++) {
    const universe = universes[universeIndex];
    e131.configureUniverse({
      "address": controller.address,
      "universe": universe,
      "sourcePort": 5568,
      "sendOnlyChangeData": false,
      "sendSequenceNumbers": false,
      "refreshInterval": 1000
    });
  }
}

// configure pumpkin stack universes
for (let controllerIndex = 0; controllerIndex < pumpkinStackControllerArray.length; controllerIndex++) {
  const controller = pumpkinStackControllerArray[controllerIndex];
  const universes = controller.universes;
  for (let universeIndex = 0; universeIndex < universes.length; universeIndex++) {
    const universe = universes[universeIndex];
    e131.configureUniverse({
      "address": controller.address,
      "universe": universe,
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
  Shutter: Beam.Shutter.Open,
  Dimmer: Beam.Dimmer.Off,
  Gobo: Beam.Gobo.Off,
  Prism: Beam.Prism.Off,
  PrismRotation: Beam.PrismRotation.Off,
  Zoom: 0,
  Frost: Beam.Frost.Off,
  Focus: 127,
  Pan: 0,
  PanFine: 0,
  Tilt: 45,
  TiltFine: 0,
  PtTime: 128,
  Function: Beam.Function.None,
  Lamp: Beam.Lamp.On
};

/////////////////////////////////////////////////////////////////////////////


function setDefaultBeamChannelData(beamChannelData) {
  beamChannelData[Beam.Channel.ColorWheel] = defaultBeamChannelData.ColorWheel;
  beamChannelData[Beam.Channel.Shutter] = defaultBeamChannelData.Shutter;
  beamChannelData[Beam.Channel.Dimmer] = defaultBeamChannelData.Dimmer;
  beamChannelData[Beam.Channel.Gobo] = defaultBeamChannelData.Gobo;
  beamChannelData[Beam.Channel.Prism] = defaultBeamChannelData.Prism;
  beamChannelData[Beam.Channel.PrismRotation] = defaultBeamChannelData.PrismRotation;
  beamChannelData[Beam.Channel.Zoom] = defaultBeamChannelData.Zoom;
  beamChannelData[Beam.Channel.Frost] = defaultBeamChannelData.Frost;
  beamChannelData[Beam.Channel.Focus] = defaultBeamChannelData.Focus;
  beamChannelData[Beam.Channel.Pan] = defaultBeamChannelData.Pan;
  beamChannelData[Beam.Channel.PanFine] = defaultBeamChannelData.PanFine;
  beamChannelData[Beam.Channel.Tilt] = defaultBeamChannelData.Tilt;
  beamChannelData[Beam.Channel.TiltFine] = defaultBeamChannelData.TiltFine;
  beamChannelData[Beam.Channel.PtTime] = defaultBeamChannelData.PtTime;
  beamChannelData[Beam.Channel.Function] = defaultBeamChannelData.Function;
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
  // const time = new Date();
  // const second = time.getHours() * 360 + time.getMinutes() * 60 + time.getSeconds();
  // console.log(" ", second,
  //     " beam=", beamIndex,
  //     " color=", beamChannelData[Beam.Channel.ColorWheel],
  //     " tilt=", beamChannelData[Beam.Channel.Tilt],
  //     " pan=", beamChannelData[Beam.Channel.Pan],
  //     " prism=", beamChannelData[Beam.Channel.Prism],
  //     " p. rotation=", beamChannelData[Beam.Channel.PrismRotation],
  //     " focus=", beamChannelData[Beam.Channel.Focus],
  //     " lamp=", beamChannelData[Beam.Channel.Lamp]);
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
  console.log("   sendBeamsOn()");
  const channelData = [];
  setDefaultBeamChannelData(channelData);
  setBeamOnChannelData(channelData);
  sendBeamsChannelData(channelData)
}

/////////////////////////////////////////////////////////////////////////////

function sendBeamsOff() {
  console.log("   sendBeamsOff()");
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

function sendSpiderChannelData(pixelColor, stepCount, stepIndex) {

  for (var spiderControllerIndex = 0; spiderControllerIndex < spiderAddresses.length; spiderControllerIndex++) {
    const address = spiderAddresses[spiderControllerIndex];
    let channel = 1;
    let universe = spiderUniverses[spiderControllerIndex][0];

    for (var spiderIndex = 0; spiderIndex < spidersPerController; spiderIndex++) {
      for (var pixelIndex = 0; pixelIndex < pixelsPerSpider; pixelIndex++) {
        const eye = (pixelIndex == 88 || pixelIndex == 89);
        const hourglass = (pixelIndex >= 176 && pixelIndex <= 188);
        let color = pixelColor;
        if (hourglass) {
          color = ((pixelColor == 'Red') ? 'Yellow' : 'Red');
        } else if (eye) {
          if (stepIndex % 32 < 8)
            color = "Black";
          else
            color = ((pixelColor == 'Red') ? 'Yellow' : 'Red');
        }
        const pixelColorData = colorNameToRgb[color];
        const pixelData = [pixelColorData[0], pixelColorData[1], pixelColorData[2]];
        e131.setChannelData(address, universe, channel, pixelData);
        channel += pixelColorData.length;
        if (channel >= channelsPerSpiderUniverse) {
          e131.send(address, universe);
          channel = 1;
          universe++;
        }
      }
      if (spiderIndex % 2 == 1 || spiderIndex == spidersPerController - 1) {
        e131.send(address, universe);
        channel = 1;
        universe++;
      }
    }
  }
}

/////////////////////////////////////////////////////////////////////////////

function sendOutlineChannelData(pixelColor1, pixelColor2, stepCount, stepIndex) {
  const pixelColor1Data = colorNameToRgb[pixelColor1];
  const pixelColor2Data = colorNameToRgb[pixelColor2];

  const horizontalStringLength = getOutlineStringLength(horizontalStringMap);
  const horizontalPixelsToChange = Math.floor(((horizontalStringLength / stepCount) * (stepIndex + 2)) / 2);
  for (let pixelNumber = 0; pixelNumber < horizontalStringLength; pixelNumber++) {
    const pixelData = (pixelNumber > horizontalPixelsToChange && pixelNumber < (horizontalStringLength - 1 - horizontalPixelsToChange))
      ? pixelColor1Data : pixelColor2Data;
    const { address, universe, pixelIndex } = getOutlinePixelAddress(pixelNumber, horizontalStringMap);
    const pixelChannel = (pixelIndex * OutlinePixel.ChannelCount) + 1;
    e131.setChannelData(address, universe, pixelChannel, pixelData);
  }

  const centerStringLength = getOutlineStringLength(centerStringMap);
  const centerPixelsToChange = ((centerStringLength / stepCount) * stepIndex / 2);
  for (let pixelNumber = 0; pixelNumber < centerStringLength; pixelNumber++) {
    const pixelData = (pixelNumber >= centerPixelsToChange && pixelNumber + 5 <= (centerStringLength - centerPixelsToChange))
      ? pixelColor1Data : pixelColor2Data;
    const { address, universe, pixelIndex } = getOutlinePixelAddress(pixelNumber, centerStringMap);
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

/////////////////////////////////////////////////////////////////////////////

function sendOrnamentChannelData(pixelColor1, pixelColor2, stepCount, stepIndex) {
  const pixelColor1Data = colorNameToRgb[pixelColor1];
  const pixelColor2Data = colorNameToRgb[pixelColor2];

  const pixelsPerStep = Math.floor(pixelsPerOrnament / stepCount);
  const changeIndex = pixelsPerStep * stepIndex;
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (let pixelNumber = 0; pixelNumber < pixelsPerOrnament; pixelNumber++) {
      const pixelData = (pixelNumber <= changeIndex) ? pixelColor2Data : pixelColor1Data;
      const { address, universe, pixelIndex } = getOrnamentPixelAddress(ornamentIndex, pixelNumber);
      const pixelChannel = (pixelIndex * OrnamentPixel.ChannelCount) + 1;
      e131.setChannelData(address, universe, pixelChannel, pixelData);
    }
  }

  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    const ornament = ornaments[ornamentIndex];
    for (let controllerIndex = 0; controllerIndex < ornament.controllers.length; controllerIndex++) {
      const controller = ornament.controllers[controllerIndex];
      for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
        const universe = controller.universes[universeIndex];
        e131.send(controller.address, universe);
      }
    }
  }
}

/////////////////////////////////////////////////////////////////////////////

function sendPumpkinChannelData(pixelColor1, pixelColor2, stepCount, stepIndex) {
  const orangeRgb = colorNameToRgb["Orange"];
  const blackRgb = colorNameToRgb["Black"];
  const whiteRgb = colorNameToRgb["White"];
  const greenRgb = colorNameToRgb["Dark Green"];
  const redRgb = colorNameToRgb["Red"];
  const blueRgb = colorNameToRgb["Blue"];
  const purpleRgb = colorNameToRgb["Purple"];

  // fill the pumpkin
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (let pixelNumber = 0; pixelNumber < pixelsPerOrnament; pixelNumber++) {
      const color = (stepIndex < 264) ? orangeRgb : purpleRgb;
      setOrnamentChannelData(ornamentIndex, color, pixelNumber);
    }
  }

  // fill the pumpkin outline
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (let pixelNumber = 0; pixelNumber < ornamentOutlinePixelCount; pixelNumber++) {
      const color = (stepIndex < 264) ? orangeRgb : purpleRgb;
      setOrnamentOutlineChannelData(ornamentIndex, color, pixelNumber);
    }
  }

  // fill the pumpkin top
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (let pixelNumber = 0; pixelNumber < ornamentTopPixelCount; pixelNumber++) {
      setOrnamentTopChannelData(ornamentIndex, greenRgb, pixelNumber);
    }
  }

  // make the eyes black
  const height = 8;
  let openHeight = height;
  if (stepIndex > 72) {
    openHeight = 1;
  } else if (stepIndex > 8 && stepIndex < 64) {
    openHeight = height - (Math.floor(((stepIndex) / height)) % height);
  }
  openHeight = Math.max(openHeight, 1);
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (const index of getPumpkinEyesIndexes(17, height, openHeight)) {
      setOrnamentChannelData(ornamentIndex, blackRgb, index);
    }
  }

  // make the mouth black
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (const index of getPumpkinMouthIndexes()) {
      setOrnamentChannelData(ornamentIndex, blackRgb, index);
    }
  }

  // make the nose black
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (const index of getPumpkinNoseIndexes()) {
      setOrnamentChannelData(ornamentIndex, blackRgb, index);
    }
  }

  // add white teeth
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    for (const index of getPumpkinTeethIndexes()) {
      setOrnamentChannelData(ornamentIndex, whiteRgb, index);
    }
  }

  // // add tongue
  // if (stepIndex > 50) {
  //   for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
  //     for (const index of getPumpkinTongueIndexes()) {
  //       setOrnamentChannelData(ornamentIndex, redRgb, index);
  //     }
  //   }
  // }

  // send the body
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    const ornament = ornaments[ornamentIndex];
    for (let controllerIndex = 0; controllerIndex < ornament.controllers.length; controllerIndex++) {
      const controller = ornament.controllers[controllerIndex];
      for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
        const universe = controller.universes[universeIndex];
        e131.send(controller.address, universe);
      }
    }
  }

  // send the outline
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    const ornament = ornaments[ornamentIndex];
    for (let controllerIndex = 0; controllerIndex < ornament.outlineControllers.length; controllerIndex++) {
      const controller = ornament.outlineControllers[controllerIndex];
      for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
        const universe = controller.universes[universeIndex];
        e131.send(controller.address, universe);
      }
    }
  }

  // send the top
  for (let ornamentIndex = 0; ornamentIndex < ornaments.length; ornamentIndex++) {
    const ornament = ornaments[ornamentIndex];
    for (let controllerIndex = 0; controllerIndex < ornament.topControllers.length; controllerIndex++) {
      const controller = ornament.topControllers[controllerIndex];
      for (let universeIndex = 0; universeIndex < controller.universes.length; universeIndex++) {
        const universe = controller.universes[universeIndex];
        e131.send(controller.address, universe);
      }
    }
  }
}

function setOrnamentChannelData(ornamentIndex, color, pixelNumber) {
  const { address, universe, pixelIndex } = getOrnamentPixelAddress(ornamentIndex, pixelNumber);
  const pixelChannel = (pixelIndex * OrnamentPixel.ChannelCount) + 1;
  e131.setChannelData(address, universe, pixelChannel, color);
}

function setOrnamentOutlineChannelData(ornamentIndex, color, pixelNumber) {
  const { address, universe, pixelIndex } = getOrnamentOutlinePixelAddress(ornamentIndex, pixelNumber);
  const pixelChannel = (pixelIndex * OrnamentOutlinePixel.ChannelCount) + 1;
  e131.setChannelData(address, universe, pixelChannel, color);
}

function setOrnamentTopChannelData(ornamentIndex, color, pixelNumber) {
  const { address, universe, pixelIndex } = getOrnamentTopPixelAddress(ornamentIndex, pixelNumber);
  const pixelChannel = (pixelIndex * OrnamentOutlinePixel.ChannelCount) + 1;
  e131.setChannelData(address, universe, pixelChannel, color);
}

// radialIndex is which radial
// radius is which pixel on the radial, how far from the center, zero based
function getRadialRadiusPixel(radialIndex, radius) {
  return radialIndex * ornamentPixelsPerRadial + (radialIndex % 2 ? ornamentPixelsPerRadial - radius - 1 : radius);
}

/////////////////////////////////////////////////////////////////////////////

function parseTimeToMinutes(timeString) {
  const timestamp = new Date('1970-01-01T' + timeString);
  return timestamp.getHours() * 60 + timestamp.getMinutes();
}

/////////////////////////////////////////////////////////////////////////////

function isTimeToShowBeams(beamStartMinute, beamStopMinute) {
  const timestamp = new Date();
  const minute = timestamp.getHours() * 60 + timestamp.getMinutes();
  return (minute >= beamStartMinute && minute <= beamStopMinute);
}

/////////////////////////////////////////////////////////////////////////////

function checkBeamLampState(beamState, beamStartMinute, beamStopMinute) {
  const isItTimeToShowBeams = isTimeToShowBeams(beamStartMinute, beamStopMinute);
  if (isItTimeToShowBeams) {
    if (beamState !== "on") {
      sendBeamsOn();
      beamState = "on";
      return { beamState: "on", timeout: 500 };
    }
  } else {
    if (beamState !== "off") {
      sendBeamsOff();
      beamState = "off";
      return { beamState: "off", timeout: 10000 };
    }
  }
  return { beamState: beamState, timeout: 0 };
}

/////////////////////////////////////////////////////////////////////////////

module.exports = {
  Beam,
  Washer,
  OutlinePixel,

  parseTimeToMinutes,
  isTimeToShowBeams,
  checkBeamLampState,

  setDefaultBeamChannelData,
  setBeamOffChannelData,

  sendBeamsOff,
  sendBeamsOn,

  sendBeamChannelData,
  sendBeamsChannelData,
  sendWasherChannelData,
  sendOutlineChannelData,
  sendOrnamentChannelData,
  sendPumpkinChannelData,
  sendSpiderChannelData,

  sendSpookyTreeChannelData
};

/////////////////////////////////////////////////////////////////////////////

function sendSpookyTreeChannelData(pixelColor, stepCount, stepIndex) {

  for (let treeIndex = 0; treeIndex < spookyTreeControllers.length; treeIndex++) {
    const treeController = spookyTreeControllers[treeIndex]
    const address = treeController.address;
    const universes = treeController.universes;
    // tree outline
    let universeIndex = 0;
    let channel = 1;
    for (let pixelIndex = 1; pixelIndex <= treeOutlinePixels; pixelIndex++) {
      // for (let universeIndex = 0; universeIndex < universes.length; universeIndex++) {
      let color = pixelColor;
      const pixelColorData = colorNameToRgb[color];
      const pixelData = [pixelColorData[0], pixelColorData[1], pixelColorData[2]];
      e131.setChannelData(address, universe, channel, pixelData);
      channel += pixelColorData.length;
      if (channel >= 510) {
        e131.send(address, universe);
        channel = 1;
        universeIndex++;
      }
    }
    e131.send(address, universe);
  }
}
