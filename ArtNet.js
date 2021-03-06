'use strict';
/*
 * This is a simple library to interact with devices that support ArtNet from node.js.
 * Tested with node.js 8.4
 * 
 * Art-Net™ is a trademark of Artistic Licence Holdings Ltd.
 * spec: http://www.artisticlicence.com/WebSiteMaster/User%20Guides/art-net.pdf
 */

 // node.js modules
 const dgram = require('dgram');
 const EventEmitter = require('events');
 
// TODO: should this emit events or only use callbacks? error, sent...
class ArtNet extends EventEmitter {
  constructor () {
    super();
    this.universeInfos = new Map();
  }

  getUniverseKey(address, universe) {
    return address + "/" + universe;
  }

  getUniverseInfo(address, universe, throwErrorIfMissing = true) {
    const universeKey = this.getUniverseKey(address, universe);
    const universeInfo = this.universeInfos.get(universeKey);
    if (!universeInfo && throwErrorIfMissing) {
      throw new Error("ArtNet::getUniverseInfo - Universe address:" + address + " universe:" + universe + " has not been configured!");
    }
    return universeInfo;
  }

  configureUniverse(configuration) {

    // console.log("ArtNet::configureUniverse, universe=" + configuration.universe);
    // console.log("ArtNet::configureUniverse", "configuration", configuration);
    
    const { universe = 0,
            address = '10.0.0.0',
            enableBroadcast = false,
            port = 0x1936,
            sourcePort,
            sendOnlyChangeData = true,
            sendSequenceNumbers = true,
            minMessageInterval = 25, /* milliseconds */
            refreshInterval = 4000 /* milliseconds */ } = configuration;

    //universe = this.checkUniverse(universe);

    // close it if it is open
    this.closeUniverse(address, universe);
   
    const universeInfo = {};

    universeInfo.address = address;
    universeInfo.universe = universe;
    universeInfo.enableBroadcast = enableBroadcast;
    universeInfo.port = port;

    if (sourcePort) {
      universeInfo.sourcePort = sourcePort;
    }

    universeInfo.sendOnlyChangeData = sendOnlyChangeData;

    universeInfo.sendSequenceNumbers = sendSequenceNumbers;

    // see spec page 48; milliseconds
    universeInfo.minMessageInterval = minMessageInterval;

    // see spec page 51; in milliseconds
    universeInfo.refreshInterval = refreshInterval;

    universeInfo.channelData = new Uint8Array(512);
    universeInfo.channelData.fill(0);
    
    // The highest channel number that has changed
    universeInfo.changedChannelThreshold = undefined;
    
    // The refreshIntervalTimerId
    universeInfo.refreshIntervalTimerId = undefined;

    // The throttleTimerIds
    universeInfo.throttleTimerId = undefined;

    // true if channel data should be sent after throttle timeout
    universeInfo.sendDelayedByThrottle = false;

    // create a socket
    universeInfo.socket = dgram.createSocket({type: 'udp4', reuseAddr: true});

    // enable broacast after socket is ready
    if (universeInfo.enableBroadcast) {
      universeInfo.socket.on('listening', function() {
        console.log("ArtNet::configureUniverse setting broadcast, universe=" + universe);
        universeInfo.socket.setBroadcast(true);
      });
    }

    universeInfo.packetSequenceNumber = 1;

    universeInfo.socket.on('error', function () {
      console.log("*** ArtNet::socket error, universe=" + universe);
    });

    universeInfo.socket.on('close', function () {
      console.log("ArtNet::socket closed, universe=" + universe);
    });

    if (sourcePort) {
      universeInfo.socket.bind(sourcePort);
    }

    const universeKey = this.getUniverseKey(address, universe);
    this.universeInfos.set(universeKey, universeInfo);

    // console.log("ArtNet::configureUniverse complete, universe=" + universe);
  }

  checkUniverse(universe = 0) {
    universe = parseInt(universe, 10);
    if (universe < 0 || universe > 32767) {
      throw new RangeError("ArtNet::Invalid universe " + universe);
    }
    return universe;
  }

  checkChannel(channel = 1) {
    channel = parseInt(channel, 10);
    if (channel < 1 || channel > 512) {
      throw new RangeError("ArtNet::Invalid channel "+ channel);
    }
    return channel;
  }

  checkChannelData(value = 0) {
    value = parseInt(value, 10);
    if (value < 0 || value > 255) {
      throw new RangeError("ArtNet::Invalid channel data "+ value);
    }
    return value;
  }

  /*
   * see spec page 45 for definition of ArtDmx message
   * 
   * The message makes a copy of the channel data so that
   * the data can be changed while the message is being sent.
   */
  createArtDmxMessage(address, universe, dataLength) {
    const universeInfo = this.getUniverseInfo(address, universe);

    const universeHighByte = (universe >> 8) & 0xff;
    const universeLowByte = universe & 0xff;

    // see spec page 48 - lenght must be even
    if (dataLength % 2) {
      dataLength += 1;
    }
    const dataLengthHighByte = (dataLength >> 8) & 0xff;
    const dataLengthLowByte = (dataLength & 0xff);

    let sequenceNumber = 0;
    if (universeInfo.sendSequenceNumbers) {
      if (universeInfo.packetSequenceNumber == 255) {
        universeInfo.packetSequenceNumber = 1;
      }
      else {
        universeInfo.packetSequenceNumber++;
      }
      sequenceNumber = universeInfo.packetSequenceNumber;
    }

    const artDmxHeader = [
      65, 114, 116, 45, 78, 101, 116, 0,  // Art-Net 0
      0, 0x50, // Opcode: OpOutput / OpDmx (low byte first)
      0, 14, // protocol version 14 (hight byte first)
      sequenceNumber, 0,  // sequence and physical origin
      universeLowByte, universeHighByte, // (low byte first)
      dataLengthHighByte, dataLengthLowByte // (high byte first)
    ];

    const messageLength = artDmxHeader.length + dataLength;
    const message = new Uint8Array(messageLength);
    message.set(artDmxHeader);
    message.set(universeInfo.channelData.slice(0,dataLength), artDmxHeader.length);

    return message;
  }

  setOneChannelData(address, universe, channel, channelData) {
    universe = this.checkUniverse(universe);
    channel = this.checkChannel(channel);
    channelData = this.checkChannelData(channelData);

    const universeInfo = this.getUniverseInfo(address, universe);

    if (!universeInfo.channelData) {
      this.createChannelData(universe);
    }
    
    if (!universeInfo.changedChannelThreshold || channel > universeInfo.changedChannelThreshold) {
      universeInfo.changedChannelThreshold = channel;
    }

    universeInfo.channelData[channel-1] = channelData;
  }

  /*
   * data can be an array
   */
  setChannelData(address, universe, channel, data) {
    universe = this.checkUniverse(universe);
    channel = this.checkChannel(channel);

    if ((Array.isArray(data)) && (data.length > 0)) {
      for (let index = 0; index < data.length; index++) {
        this.setOneChannelData(address, universe, channel+index, data[index]);
      }
    } else {
      this.setOneChannelData(address, universe, channel, data);
    }
  }

  close() {
    for (let [, universeInfo] of this.universeInfos) {
      this.closeUniverse(universeInfo.address, universeInfo.universe);
    }
    this.universeInfos.clear();
  }

  closeUniverse(address, universe) {
    const universeInfo = this.getUniverseInfo(address, universe, false);
    if (universeInfo) {
      this.clearInterval(universeInfo.refreshInternvalTimerId);
      this.clearTimeout(universeInfo.throttleTimerId);
      universeInfo.socket.close();
      this.universeInfos.delete(this.getUniverseKey(address, universe));
    }
  }

  onRefreshTimeout(universeInfo) {
    //console.log("ArtNet::onRefreshTimeout, universeInfo=" + universeInfo);

    universeInfo.changedChannelThreshold = universeInfo.channelData.length;
    this.send(universeInfo.address, universeInfo.universe);
  }

  onThrottleTimeout(universeInfo) {
    universeInfo.thottleTimerId = null;
    if (universeInfo.sendDelayedByThrottle) {
      universeInfo.sendDelayedByThrottle = false;
      // console.log("ArtNet::onThrottleTimeout - sending after throttle, universe=" + universe);
      this.send(universeInfo.address, universeInfo.universe);
    } else {
      // console.log("ArtNet::onThrottleTimeout - starting refresh timer, universe=" + universe);
      universeInfo.refreshInternvalTimerId = setTimeout(
        this.onRefreshTimeout.bind(this, universeInfo), universeInfo.refreshInterval);
    }
  }

  onAfterSend(universeInfo) {
    // console.log("ArtNet::onAfterSend - starting throttle timer, universeInfo=" + universeInfo);
 
    universeInfo.thottleTimerId = setTimeout(
      this.onThrottleTimeout.bind(this, universeInfo), universeInfo.minMessageInterval);
  }

  /*
   * callback is optional
   */
  send(address, universe) {
    const universeInfo = this.getUniverseInfo(address, universe);
    
        // if there is a throttle time, do not send messaage but
    // set flag so throttle timer will send the message
    if (universeInfo.thottleTimerId) {
      // console.log("ArtNet::send throttled, universe=" + universe);
      universeInfo.sendDelayedByThrottle = true;
      return;
    }

    clearTimeout(universeInfo.refreshInternvalTimerId);
    universeInfo.refreshInternvalTimerId = null;

    if (universeInfo.changedChannelThreshold) { 
      let message = this.createArtDmxMessage(address, universe, universeInfo.changedChannelThreshold);
      universeInfo.changedChannelThreshold = 0;
  
      // if (universe > 0) {
      //   console.log(`ArtNet::send, u=${universe} p=${universeInfo.port} a=${universeInfo.address}
      //     m=${JSON.stringify(message)}`);
      // }
      universeInfo.socket.send(message, 0, message.length, universeInfo.port, universeInfo.address,
        this.onAfterSend.bind(this, universeInfo), universeInfo.minMessageInterval);
    }
  }

}

exports.ArtNet = ArtNet;
