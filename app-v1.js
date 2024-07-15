// common js modules- "type": "module" has to be added in the package.json
const currentModuleDir = import.meta.dirname; // The current module's directory name
const currentModuleFile = import.meta.filename; // The current module's file name

import morgan from 'morgan';
//package to log each request http method, status code, resposnse time and payload size

////MAIN APP
//express.js is 100% node.js under the hood,
import express from 'express';
const app = express();

//listening to get request methods on the app
app.get('/', (req, res) => {
  res.status(200).send('hello');
  //the res can chains the status header and the response data together
});

//MIDDLEWARE
// express process requests in the request reponse cycle. this cycle involves miidleware functions that process that are between the request and response. Each middleware function receives the request object, the request data goes throught the pipeline. All data that is on the request bodygoes through a pipeline and can be modified bnefore getting to the next middleware. Data can added to the request object and accesed in the other middlewares in the cycle.

// The order of middleware functions in the script is there fore very important (top level is proccessed sequentialy in node).

// app.use() mounts middleware to the pipeline.

// next() must be callled on each middleware for it to move to the next middleware if that middleware does not end the cylce by returning a response.

// a response in the middle must be returned explictly using the retirn keyword, otherwise there will be more than response causing a runtime error.

//every function between the request and response that doesnt end the cyle is essentially middleware,
app.use((req, res, next) => {
  const requestTime = new Date().toISOString();
  req.requestTime = requestTime;
  console.log('current time added to the request');
  next();
});

//morgan-middleware that logs each request on the server- dev option logs the request/respinse code and the response duration and the payload size-
app.use(morgan('dev'));

// expree.json() for parsing Json- without it json data in the request body will be undefined,  this middleware can be used befoie express
app.use(express.json());

// static files middleware
// app.use(express.static("folder"))
// url/img.png will sever that image from folder, it will try to find it in the defined folder

//PARAMS
//gets accsed to parameters, receives a valid paramter name and a callback function
app.param('id', (req, res, next, id) => {
  console.log(id);
  next();
});

////CONTROLLERS- request response handler functions, controller name used convenctionallly because of the Model View Controller pattern
// these are callback functions can be reused in as middleware
const hello = (req, res) => {
  console.log(req.body);
  res.json({ res: 'hello there' });
};
const hi = (req, res) => {
  console.log(req.body);
  res.json({ res: 'hi there' });
};

//ENDPOINTS
//params ,optional params or search params
app.get('/api/v1/products/:id/:label?', (req, res) => {
  console.log(req.params);
});

// app.post("/api/v1/products", hi);

// delete - null is usualyy sent back as data- no content sent to the client
app.delete('/api/v1/products/', (req, res) => {
  console.log(req.body);
  res.json({ res: null });
});

// chaining requests- http request can be chained, request object modifying middleware can also be chained.
app.route('/api/v1/products/:id/:label?').get(hello).post(hi, hello);

////SUB ROUTERS
//used to divide up the route into different resource endpooints. the are created at express.Router

const productsRouter = express.Router();
const usersRouter = express.Router();

// the sub routes mounted as middleware on the main app on individual root route segments
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/users', usersRouter);

// a route is defined on the the sub routers and http method directed towards that.
productsRouter.route('/').get(hello).post(hi);

//SERVER
const port = 3000;
app.listen(port, () => {
  console.log('app running in the server');
});

//NOTES
//similar endpoints on the main app and sub route will return the respoonse of the handler first defined in the list.
// express gets acesss to params in the endpoint before the point where they are defined in the endpoint.
// express will give an error in html format when a undefined route or wrong http method is used.

//->
//separate middleware, controller functions and server
