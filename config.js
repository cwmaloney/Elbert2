"use strict";

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
    "White": 0,         // correct!
    "Red": 10,          // correct!
    "Orange": 20,       // correct! (a bit yellowish)
    "PaleBlue": 27,     // correct!
    "Green": 35,        // correct!
    "PaleYellow": 45,   // correct!
    "Lavender": 55,     // correct! 
    "Pink": 60,         // correct!
    "Yellow": 70,       // correct!
    "Magenta": 80,      // correct!
    "Blue": 87,         // correct!
    "Violet": 120,      // correct!
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
    "Open": 255,
    "Slow": 10,
    "Medium": 50,
    "Fast": 100
  },

  "Dimmer": {
    "Off": 255
  },

  "Reset": {
    "None": 0,
  },

  "Lamp": {
    "Zero": 0,
    "Off": 10,
    "On": 255
  },

  "ChannelCount": 16,

  "Channel": {
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
};

const Washer = {
  "ChannelCount": 6,
  "Channel": {
    "Intensity": 0,
    "Red": 1,
    "Blue": 2,
    "Green": 3,
    "Strobe": 4,
    "tbd": 5
  }
};

const OutlinePixel = {
  "ChannelCount": 3,
  "Channel": {
    "Red": 0,
    "Green": 1,
    "Blue": 2
  }
};


module.exports = {
  Beam,
  Washer,
  OutlinePixel
};