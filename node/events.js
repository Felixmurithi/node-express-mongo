const EventEmitter = require("events");
const http = require("http");

const myEmitter = new EventEmitter();

myEmitter.on("sendEvent", () => {
  console.log("event emitted");
});

myEmitter.emit("sendEvent");
