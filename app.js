//core-modules
import morgan from 'morgan';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

//custom-modules
import storeRouter from './routes/storeRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import globalErrorhandler from './controllers/errorController.js';
import productRouter from './routes/productRouter.js';

const currentModuleDir = import.meta.dirname;
const currentModuleFile = import.meta.filename;

////MAIN APP
const app = express();

//GLOBAL MIDDLEWARE
//security http headers
app.use(helmet());

//dev env logs
if (process.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//json body parser, and opptions to limit request size
app.use(express.json({ limit: '10kb' }));

//data sanitiziation against no sql requests- {email: {$gte : ""}}
app.use(mongoSanitize());

//preotect againts cross site scripting , convert html symbols to  html entities, works in the serverr- front end xss attacks-TODO
app.use(xss());

//prevent parameter pollution- avoid parameter duplication which cannot be split
app.use(
  hpp({
    whitelist: [
      [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    ],
  }),
);

//rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one hour',
});
app.use('/api', limiter);

//SUB ROUTERS
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);

//handle all other urecognized URLs
// all http nmethods covered
app.all('*', (req, res, next) => {
  const err = new Error();
  err.status = 'fail';
  err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404)); // whjen something is passed into next, express automaticvally moves into teh error handling middleware
});

// express error handler
//handles all operational errors
// express can tell its an erro handler becausae of the 4 parameters.

app.use(globalErrorhandler);

export default app;
