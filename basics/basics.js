// the internet works by sending of resoources across a network, the data is sent using tcp/ip.  a website ip and domain name match is cached in a dns server. the website runs on a server and the data is accesed using the http protocol, a request is send and response is replied. the request has three parts : startline with the HTTP method, request target and HTTP version, request headers and a request body. The response has HTTP version, status and status message, response headers and the respponse body:

// _ represnets the last result in the console, node + enter to see all constructors in node, Contructor. and press enter to see

// node js a  js runtime  that combine several dependicies to make the network responses poissible. The 2 biggest libraries are the google v8 engine and libuv. v8 is a js engine by google that converts ns to machine code. libuv is asynchronius i/o library that gives node acess to computer resources such as the OS, networking and creates the event and threadpool. v8 is written in js and c++ and lib uv purely C++, node makes it possible acess these functions in JS. Some other libraries used is http parser for parsing http, c-ares of dns , openssl for crypography and zlib for coppression.

// java script is single threaded, all tasks run sequentially. async programming has implemented to keep the callstack non blocking when tasks that have to wait for eternal data or do heavy processing are present . async code is present in built in methods like timers and the fetch method. they can also be implemented using the Promise API which returns an object with the value returned when promised or rejected . The async keyword alsso transforms sync functionst to async functions. async code run after the top level code. Before procsessing, all async callback functions are registered in the event loop, when processing begins they are added into callstack(callback stack). After teh top level code is executed, the call stack runs sequentially, processing the callback in the order they were added.

// the node process is started by running the node program. it runs in a single thread the event pool,  additional threads can be made availble for more expensive tasks tasks including compression , dns look up crypography. every time its run it nexecuted the top level code, requres/imports all modules, registers call back functions. node is said to be event driven because of the event loop, after top level code execution each ca callbacks of events such as  new http requests, timer intervals and completion of file reading are put in an event loop .

// callbacks  start the event loop at different phases, with next tick and promise execution starting of each phases and then going through other phases of the loop.expired timer callbacks run those, if there is any i/o prococesse runn those and finally run setimmediate , setImmediate with a nested setImmediate and setTimeout

const fs = require("fs");

fs.readFile("my-file.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  } else {
    console.log("File content:", data);
    setTimeout(() => console.log("hi immediate timeout"), 0);
    process.nextTick(() => console.log("hi immediate process"));
    setImmediate(() => console.log("hi immediate immediate"));
  }
});

setImmediate(() => {
  setTimeout(() => console.log("hi immediate timeout 1"), 100);
  process.nextTick(() => console.log("hi immediate process 1"));
  setImmediate(() => console.log("hi immediate immediate 1"));
});

// the event loop is implements a hard maximum of how many  to stop the io polling checks can be done at time before movging on to the next phase to stop io from starving other

//json parsing can start to take a lot of time, dont use regular nested expressions eg quantifiers
