const fs = require("fs");
const { createServer, request } = require("http");
const url = require("url");

const dataJSON = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const data = JSON.parse(dataJSON);

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// server

//cxreate server
const server = createServer();
server.on("request", (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" }); //starting line
    res.end(overviewTemplate); //body
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "application/json" });
    if (query.id - 1 > data.length) res.end("page not found");
    else res.end(JSON.stringify(data[query.id]));
  } else {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("page not found");
  }
});

// listen

server.listen(3000, "127.0.0.1");
