const dxTools = require("../src/index");
const { dxServer } = dxTools;

const interfaces = {
  "/parse_dom": {
    post: async function (post) {
      console.log(post);
      return { data: "ok" };
    },
  },
};

dxServer(interfaces);
