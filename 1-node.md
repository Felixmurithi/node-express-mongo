## The Internet

The internet works by sending of resources across a network, data or content is sent via tcp/ip using http. To access these resources, the resource url matches the server ip adress in the domain name server, request reaches the endpoint processed and response sent back. Node is one of the popular tehnologies used in implementing servers.

## Node Runtime & Event Loop

Node is a javascript runtime that combine several dependicies to make the network responses poissible. The 2 most prominent libraries are the `google v8` engine and `libuv`. v8 is aengine by google that converts node to machine code. Libuv is asynchronous i/o library that gives node acess to computer resources such as the OS, networking and creates the event and threadpool. v8 is written in javascript and c++ and lib uv in C++, node makes it possible acess these functions in javascript. Some other libraries used is http parser for parsing http, c-ares of dns , openssl for cryptography and zlib for coppression.

The node process is started by running the node program. It runs in a single thread the event pool, additional threads can be made available for more expensive tasks tasks including compression , dns look up cryptography. When the node process starts the top level code is executed, all modules imported and all callback functions registered.

the event loops callbacks puts callbacks into different phases and executes them in a loop. The next tick and promises are executed before starting of each phase. Expired timer callbacks executed, any i/o processes are executed and finally run setimmediate. The event loop is implements a hard maximum of how many io polling checks can be done at time before moving on to the next phase to stop io polling from starving other events.

Server request events are are inbuilt i/o poling.

ENde process/runtime global variables can be set by using

```
--env-file=./config.env
```

## Node Event Emitters and Event Listeners

Node is said to be event driven. Events emitting and listening make server rquests possible.

```js
import EventEmitter from 'events';
import http from 'http';
const myEmitter = new EventEmitter();

myEmitter.on('sendEvent', () => {
  console.log('event emitted');
});
myEmitter.emit('sendEvent');
```

## SERVER SETUP

```js
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
```

The request is made up of three parts : startline with the HTTP method, request target and HTTP version, request headers and a request body. The response has HTTP version, status and status message, response headers and the respponse body:

### ES6 MODULES

es6 modules- "type": "module" has to be added in the package.json.

gettig diretory name and filename

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);
```

### Server Side Rendering

It is implemented by checking for the request http method endpoint/pathname and queries. The appropriate request code, headers and content is thenn sent back, usually in html for rendering on browsers.
