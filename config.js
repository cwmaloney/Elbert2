"use strict";

// This file contains data we can modify without resubmitting the app for approval.
//
// we try to always make es-link "happy"
/* eslint quote-props: ["error", "always"] */
/* eslint quotes: ["error", "double"] */


//////////////////////////////////////////////////////////////////////////////
// Commands that can be sent to elements
/////////////////////////////////////////////////////////////////////////////
// const commands = {
//   command: {
//     fixutre: {
//       directives: [
//         { channelData: [ 255, 255, 0, 0, 0, 0, 255, 0 ], duration: 500 },
//         { channelData: [ 255,   0, 0, 0, 0, 0, 255, 0 ], duration: 250 },
//         { channelData: [ 255, 255, 0, 0, 0, 0, 255, 0 ], duration: 500 },
//         { channelData: [ 255,   0, 0, 0, 0, 0, 255, 0 ], duration: 500 },
//         { channelData: [ 255, 255, 0, 0, 0, 0, 255, 0 ], duration: 250 },
//         { channelData: [ 255,   0, 0, 0, 0, 0, 255, 0 ], duration: 250 },
//         { channelData: [ 255, 255, 0, 0, 0, 0, 255, 0 ], duration: 500 },
//         { channelData: [ 255,   0, 0, 0, 0, 0, 255, 0 ], duration: 500 },
//         { channelData: [ 255, 255, 0, 0, 0, 0, 255, 0 ], duration: 250 },
//         { channelData: [ 255,   0, 0, 0, 0, 0, 255, 0 ], duration: 250 },
//         { channelData: [ 64, 64, 0,   0,   0,   0, 64,   0 ], duration: 2000 }
//       ]
//     }
//   }
// };

const Beam = {
  "Unused": 0,

  "Color": {
    "White": 0,
    "Red": 1,
    "Lavender": 2,
    "Yellow": 3,
    "Green": 4,
    "LightGreen": 5,
    "Fluorescent": 6,
    "Pink": 7,
    "Orange": 8,
    "Megenta": 9,
    "Aquamarine": 10,
    "Blue": 14,
  },

  "Gobo": {
    "Off": 0,
    "Dot1": 1,
    "Dot2": 2,
    "Dot3": 3,
    "Dot4": 4,
    "Dot5": 5,
    "Dot6": 6,
    "ThreePoints": 8,
    "FourPoints": 9,
    "Stars10": 10,
    "Star12": 12,
    "Star13": 13,
    "Star14": 14,
    "Star15": 15,
    "VerticalBar": 16,
    "HorizontalBar": 17
  },

  "Prism": {
    "On": 128,
    "Off": 0
  },

  "PrismRotation": {
    "Fast": 255,
    "Slow": 128,
    "Off": 0
  },

  "Frost": {
    "On": 128,
    "Off": 0
  },

  "Strobe": {
    "Off": 0,
    "Slow": 10,
    "Medium": 50,
    "Fast": 100
  },

  "Reset": {
    "None": 0,
  },

  "Lamp": {
    "Off": 10,
    "On": 255
  },

  "ChannelsPerBeam": 16,

  "BeamChannel": {
    "ColorWheel": 0,
    "Strobe": 1,
    "Dimmer": 2,
    "Gobo": 3,
    "Prism": 4,
    "PrismRotation": 5,
    "EffectsMovement": 6,
    "Frost": 7,
    "Focus": 8,
    "Pan": 9,
    "PanFine": 10,
    "Tilt": 11,
    "TiltFine": 12,
    "Macro": 13,
    "Reset": 14,
    "Lamp": 15
  }
}

//////////////////////////////////////////////////////////////////////////////
// DMX mapping
//////////////////////////////////////////////////////////////////////////////

// const elements = {
//   eastBeam: { elementType: "Beam", queueName: "beam", count: 6, universe: 0, startChannel: 1, channelsPerElement: 16},
//   westBeam: { elementType: "Beam", queueName: "beam", count: 6, universe: 0, startChannel: 1, channelsPerElement: 16},
//   beam:   { elementType: "beam", queueName: "beam",
//     components: [
//       { name: "Beam", number: 1 },
//       { name: "Beam", number: 2 },
//       { name: "Beam", number: 3 },
//       { name: "Beam", number: 4 },
//       { name: "Beam", number: 5 },
//       { name: "Beam", number: 6 },
//       { name: "Beam", number: 7 },
//       { name: "Beam", number: 8 },
//       { name: "Beam", number: 9 },
//       { name: "Beam", number: 10 },
//       { name: "Beam", number: 11 },
//       { name: "Beam", number: 12 } ] },
// };

// const Universes = [
//   { universe: 1, "address": "10.7.84.55"},
//   { universe: 1, "address": "10.7.84.56"}
// ];

// const BeamUniverses = {
//   east: { universe: 1, "address": "10.7.84.55"},
//   west: { universe: 1, "address": "10.7.84.56"}
// }


module.exports = {
  Beam,
};