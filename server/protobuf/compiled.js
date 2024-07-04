
const protobuf = require("protobufjs");

protobuf.roots["default"] = protobuf.Root.fromJSON({"nested":{"CommonPacket":{"fields":{"handlerId":{"type":"uint32","id":1},"userId":{"type":"string","id":2},"version":{"type":"string","id":3},"payload":{"type":"bytes","id":4}}},"InitialPayload":{"fields":{"deviceId":{"type":"string","id":1},"playerId":{"type":"uint32","id":2},"latency":{"type":"float","id":3}}},"LocationUpdatePayload":{"fields":{"x":{"type":"float","id":1},"y":{"type":"float","id":2}}},"LocationUpdate":{"fields":{"users":{"rule":"repeated","type":"UserLocation","id":1}},"nested":{"UserLocation":{"fields":{"id":{"type":"string","id":1},"playerId":{"type":"uint32","id":2},"x":{"type":"float","id":3},"y":{"type":"float","id":4}}}}},"Response":{"fields":{"handlerId":{"type":"uint32","id":1},"responseCode":{"type":"uint32","id":2},"timestamp":{"type":"int64","id":3},"data":{"type":"bytes","id":4}}}}});

module.exports = protobuf.roots["default"];
