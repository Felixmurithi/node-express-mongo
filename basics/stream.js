const { error } = require("console");
const fs = require("fs");
const server = require("http").createServer();
//combing importing and creating a server

// streaming from 'fs is alos an event emitter and from the readtream
//variable one can listen to the 'data' and submit the chunks- this has
//to be accompanied with an event ends

server.on("request", (request, response) => {
  //Reading  file read ansychrounous
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     response.end(data);
  //   });

  //  creatingstream
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     response.write(chunk);
  //   });
  //   readable.on("end", () => {
  //     response.end();
  //   });
  //   readable.on("error", (error) => {
  //     console.log(error);
  //     response.statusCode = 500;
  //     //error code above
  //     response.end("File not found");
  //   });
  //downside of thisd type of stream i that it may cause a back pressure where the rate of creating the chunks is faster than the rate of sending them out

  //streaming Pipe only needs the readible source and writeable destinations
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(response);
});

server.listen(8000, "127.0.0.1", () => {});
