const dxTools = require("../src/index");
const { dxServer } = dxTools;

const options = {
  hostname: "127.0.0.1",
  port: 38686,
  path: "/parse_dom",
  method: "POST",
  data: {
    rich_text: "<div>hello</div>",
  },
};

dxServer.nodeRequest(dxServer.generateRequestOptions(options));
