// interfaceObj
// [path]
// - post : function(data)
// - get  : function(data)
const http = require("http");
const url = require("url");

async function initServer(interfaceObj, port) {
  const server = http.createServer((req, res) => {
    const method = req.method;
    let path = "";
    let get = {};
    let post = {};
    function to405() {
      res.statusCode = 405;
      console.log("error -----> method do not allowed !");
      res.end();
    }
    let is404 = true;
    for (var interfaceUrl in interfaceObj) {
      const { pathname, query } = url.parse(req.url, true);
      path = pathname;
      get = query;

      const pathReg = new RegExp(interfaceUrl);
      if (pathReg.test(pathname)) {
        const interface = interfaceObj[interfaceUrl];
        const comp = interface[req.method.toLowerCase()];
        if (comp) {
          switch (req.method.toLowerCase()) {
            case "post":
              path = req.url;
              let body = "";
              req.on("data", (buffer) => {
                body += buffer;
              });
              req.on("end", () => {
                post = JSON.parse(body);
                comp(post).then(complete);
              });
              break;
            case "get":
              to405();
              comp(req).then(complete);
              break;
            default:
              res.statusCode = 405;
              console.log("error -----> method do not allowed !");
              res.end();
              break;
          }
        } else {
          to405();
        }
        is404 = false;
        break;
      }
    }
    if (is404) {
      console.log("error -----> path do not exist !");
      res.statusCode = 404;
      res.end();
    }
    async function complete(responseData) {
      try {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(responseData));
      } catch (error) {
        console.error(error);
      }
    }
  });

  server.listen(port | 38686);

  console.log(">>>>>>>>>>  server started waiting for request  <<<<<<<<<<");
}

module.exports = initServer;
