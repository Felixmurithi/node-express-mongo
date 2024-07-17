`Express` is written entirely using node.

## SERVER & APP

Starting an express server.

```js
import express from 'express';
const app = express();

const port = 3000;

const server = app.listen(port, () => {
  console.log('app running in the server');
});
```

## REQUEST & RESPONSE CYCLE

Express listens to requests and responds to them, each request and corresponsing response is a cyle, on each cycle tehre can only be one response. Express will give an error in html format when a undefined route or wrong http method is used.

Listening to get request methods on the app.<br>

```js
app.get('/', (req, res) => {
  res.status(200).send('hello');
});
console.log(req.headers); // express turn all headers to lowercase.
```

HTTP request and response objects can be accesed in the callback function mounted on the app route in the corresponding http method. The response status and data are chained, express set the necessary responses headers .

### routing

Express implements endpoint routing, exposing resources using http methods.

```js
app.route('/app').get((req, res) => {
  res.json({ res: 'hello there' });
});
```

Different http request methods are chained on the same endpoint.

```js
const hello = (req, res) => {
  res.json({ res: 'hello there' });
};

const hi = (req, res) => {
  res.json({ res: 'hi there' });
};

app.route('/app').get(hello).post(hi);
```

## MIDDLEWARE

Every function in between the request response is considered middleware, including the route, the http methods and the callback methods. Every function between the request and response that does not end the cyle is essentially middleware.
Express top level code is processed sequentailly, similar endpoints are handled according to where they are declared.

Each middleware function receives the request object, the request data goes throught the pipeline, request object modifying middleware can also be chained. All data that is on the request body goes through a pipeline and can be modified bnefore getting to the next middleware. Data can added to the request object and used in the next middlewares in the cycle.

```js
app.use((req, res, next) => {
  const requestTime = new Date().toISOString();
  req.requestTime = requestTime;
  console.log('current time added to the request');
  next();
});
```

`app.use()` mounts middleware to the pipeline. Each middleware recieves `next` which must be called on each middleware for it to move to the next middleware if that middleware does not end the cylce by returning a response. Responses to end the cycle must be returned explitly otherwise more than one response maybe sent causing a runtime error

### subrouters

sub routers used to separate endpoints. the sub routes mounted as middleware on the main app on individual root route segments

```js
const storeRouter = express.Router();
const userRouter = express.Router();
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/users', usersRouter);
```

A route and its http methods are defined on the the sub routes. Router handler callback functioons alos used.

```js
const hello = (req, res) => {
  res.json({ res: 'hello there' });
};

const hi = (req, res) => {
  res.json({ res: 'hi there' });
};

storeRouter.route('/').get(hello).post(hi);
```

### mounting a sub route on the sub router

a sub router can be mounted on an existing sub routes

```js
storeRouter.use('/:storeId/products', productRouter);
const productRouter = express.Router({ mergeParams: true });
```

`{mergeParams: true}` is passed to as option because each routes only gets acess to its own params by default.

### params

The params middleware gets access to dynamic parameters, receives a valid parameter name defined on any route and a callback function

> The params are also available on every request object, this middleware is rarely used unless the params need to be modified before reaching our route handlers

```js
app.param('id', (req, res, next, id) => {
  console.log(id);
  next();
});
```

### json-parser

```
app.use(express.json());
```

without this middleware anyy json data in the request body will be undefined, this middleware has to declared before any other middleware that receives and responds to requests.

### static files middleware

```js
app.use(express.static('folder'));
```

requesting `url/img.png` will try and find that image on that folder, or its sub folders.

### global error handler

any middleware with four params is considered an error handeler by express. Error pased into the `next()` of preceeding middleware are received as the error parameter of this middleware, all errors in passed to this middleware are handled by the global error handler and not 'caught as execptions'. They are sent to the client as a response. The global error handler must be the last middleware in the app script.

```js
app.use((error, req, res, next) => {});
```

## ERROR HANDLING

1. **catch async**- send all operational (error s taht can be anticipated) errors in async functions to the global error handling middleware.

```js
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

//usage
export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('NO document found with that id', 404));
    }
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });
```

2. **operational errors**- add operational property to all operational errors by modifying an instance of the `Error` object.

3. **moongodb and mongoose validation errors** extarcted and handled individually in the global middleware.

4.**non-operational** errors such as a promise rejection when trying to connect because errornet are handled in the server script,

## SECURITY

### authentication & authorization

1. signup- the signup handler will only create a new doc using select fields. min and max lengths on these fields to sanitize input. The security sensitive fields in the user model senstive fields are set to `select: false`. The passowrdChangedAt is not included The password and passwordConfirm fields are compared in the schema and if they match the passwordConfirm is set to `undefined`. The password is encrypted using the `bcryptjs` and stored encrypted. Other fields are validated by the schema. The user is then authenticated by sending a JsonWebToken.

2. JsonWebToken(JWT) is a authenticating algorithm that stores a token stateless in the browser cookies or local storage. The storage does not happen in the database to maintain the rest architecture. The jwt is generated by compiling headers, an user id, the token creation timestamp , expiring time and a secret key kept on the runtime enviroment variables. The secret key keeps the token secure. The token creation time stamp can be used to ensure that older tokens are invalidated. This timestamp also ensures that any tokens generated after a password change are invalidated

3. **Login**- get the email and password fields from the request, get the user using the email and use `select('+password');` to select the encrypted password field. use `compare()` from `bcrypt` to verify password and send jwt token if its correct.

4. **Protecting Routes**- restrict routes to only logged in users, invalidated jwt after password change and verify user roles for senstive routes. Logged in users are verified using the user id in teh `JWT` token. The token is invalidated if its creation timestap is later than the password change timestamp that is if password was changed atleast once. User roles have to be set manually on the db or through a secure route. The default user role is set set to `"user"` by default. A function that wraps the middleware can be used to restrict sensitive routes to user roles, the function receives the roles array, destructures, checks if the current user's role is included. The wrapped middleware will and returns `next()` if role is included in the user doc or `next(error)` if it is not included.

5. **Password Change**- On the forget password route random strings as a password reset token are created, the hashed result of the token and the reset token expiry timestamp saved to the database. Th reset token sent via email with an url that points to the reset passord route with the token as a param. On reset password route, the reset token is retrived, hashed and compared with the saved hash. The user with the hashed token saved is retreived if the reset token expiry still time is less than the current time stamp. The password and passwordConfirm saved, reset tokena and expiry time set to undefined. To update the password while logged in, the currentPassword is entered, hashed and verified agaionst the encyrpted and saved password.

6. **User Details Update**- on the protected `/updateme` routerequest fields are filtered, if the password fields are present error response is sent. Password cannot be updated using this route.
   The request body is filtered and only email and name values are saved.

## best security practices

### global middleware

1. Add html security headers

```js
app.use(helmet());
```

2. Limit request size

```js
app.use(express.json({ limit: '10kb' }));
```

3. Protect against cross site scripting, convert html symbols to html entities.

```js
app.use(xss());
```

4. data sanitiziation against no sql injection `{email: {$gte : ""}}`

```js
app.use(mongoSanitize());
```

5. limit the number of requests

read slides
