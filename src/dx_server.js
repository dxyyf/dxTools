/**
 * @callback completeCallback
 * @param {object} requestData
 * @returns {Promise<any>}
 */
const http = require("http");
const url = require("url");

/**
 * Quick start nodeserver. Some completed callback defined in arguments (obj and port). Propsname of obj should be request path string like '/request/list?id=123'.
 * @method
 * @param  {object} obj
 * @param  {completeCallback} [obj.get]
 * @param  {completeCallback} [obj.post]
 * @param  {number} port
 */
async function nodeHttpServer(obj, port) {
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
    for (var interfaceUrl in obj) {
      const { pathname, query } = url.parse(req.url, true);
      path = pathname;
      get = query;

      const pathReg = new RegExp(interfaceUrl);
      if (pathReg.test(pathname)) {
        const interface = obj[interfaceUrl];
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

/**
 * @param  {object} options
 * @param {string} options.hostname
 * @param {number} options.port
 * @param {string} options.path
 * @param {string} options.method
 * @param {JSON} options.data
 */
function generateRequestOptions(options) {
  const content = JSON.stringify(options.data);

  return {
    hostname: options.hostname,
    port: options.port,
    path: options.path,
    method: options.method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(content),
    },
    data: content,
  };
}

/**
 * Simple http request use NodeJS
 * @param  {object} options
 * @param {string} options.hostname
 * @param {number} options.port
 * @param {string} options.path
 * @param {string} options.method
 * @param {{[key:string]:string}} options.headers
 * @param {string} options.data
 */
function nodeRequest(options) {
  const req = http.request(options, (res) => {
    console.log("status: " + res.statusCode);
    console.log("headers: " + JSON.stringify(res.headers));
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log("body: " + chunk);
    });
  });
  req.on("error", (e) => {
    console.log("problem with request: " + e.message);
  });
  req.write(options.data);
  req.end();
}

module.exports = {
  nodeHttpServer,
  nodeRequest,
  generateRequestOptions,
};
