const protobuf = require("protobufjs");
const fs = require("fs");
const path = require("path");

protobuf.load(path.join(__dirname, "protobuf/messages.proto"), function(err, root) {
    if (err) throw err;

    const output = path.join(__dirname, "protobuf/compiled.js");

    // JSON 형식으로 루트를 변환
    const jsonDescriptor = JSON.stringify(root.toJSON());

    const compiled = `
const protobuf = require("protobufjs");

protobuf.roots["default"] = protobuf.Root.fromJSON(${jsonDescriptor});

module.exports = protobuf.roots["default"];
`;

    fs.writeFileSync(output, compiled);
    console.log("Protos compiled successfully to " + output);
});
