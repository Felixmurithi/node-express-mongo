/////////

//SERVER
//steps of create a server
//1. http or https module
// 2. createServer method
//3. include a listening port and IP(local mianly)
//imortant to remember that server.on is the event listner, it listens to the event submitted by the server such as requests
const server = http.createServer();

server.on("request", (request, response) => {
  console.log("Request recevied");
  console.log(request.url);
  response.end("Request Received");
});

server.on("close", () => {
  console.log("Server Closed");
});

server.listen(8000, "127.0.0.1"); // use browser
// the server request events are are inbuilt i/o poling, the request and response args are also inbuilt
// the http method used here is seamingly "GET"
