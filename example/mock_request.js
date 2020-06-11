const http = require("http");
const querystring = require("querystring");
const postData = {
  rich_text: "<div>hello</div>",
};
const content = JSON.stringify(postData);

const options = {
  hostname: "127.0.0.1",
  port: 38686,
  path: "/parse_dom",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(content),
  },
};
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
req.write(content);
req.end();
