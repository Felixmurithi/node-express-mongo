import EventEmitter from 'events';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);

//EVENTS
const myEmitter = new EventEmitter();
myEmitter.on('sendEvent', () => {
  console.log('event emitted');
});
myEmitter.emit('sendEvent');

// EVENT LOOP
fs.readFile(`${currentDirectory}/my-file.txt`, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
  } else {
    console.log('File content:', data);
    setTimeout(() => console.log('hi immediate timeout'), 0);
    process.nextTick(() => console.log('hi immediate process'));
    setImmediate(() => console.log('hi immediate immediate'));
  }
});

setImmediate(() => {
  setTimeout(() => console.log('hi immediate timeout 1'), 100);
  process.nextTick(() => console.log('hi immediate process 1'));
  setImmediate(() => console.log('hi immediate immediate 1'));
});

//SERVER
const server = http.createServer();
server.on('request', (request, response) => {
  console.log('Request recevied');
  console.log(request.url);
  response.statusCode(200);
  response.end('Request Received');
});

server.on('close', () => {
  console.log('Server Closed');
});

server.listen(8000, '127.0.0.1');
