import fs from 'fs';
import { createServer, request } from 'http';
import url, { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);

//read json files

const dataJSON = fs.readFileSync(
  `${currentDirectory}/dev-data/data.json`,
  'utf-8',
);
const data = JSON.parse(dataJSON);

const overviewTemplate = fs.readFileSync(
  `${currentDirectory}/templates/template-overview.html`,
  'utf-8',
);
const productTemplate = fs.readFileSync(
  `${currentDirectory}/templates/template-product.html`,
  'utf-8',
);
const cardTemplate = fs.readFileSync(
  `${currentDirectory}/templates/template-card.html`,
  'utf-8',
);

// SERVER
const server = createServer();
server.on('request', (req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/') {
    //starting line
    res.writeHead(200, { 'Content-type': 'text/html' });
    //response body
    res.end(overviewTemplate);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    if (query.id - 1 > data.length) res.end('page not found');
    else res.end(JSON.stringify(data[query.id]));
  } else {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end('page not found');
  }
});

// listen
server.listen(3000, '127.0.0.1');
