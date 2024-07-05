const currentModuleDir = import.meta.dirname;
const currentModuleFile = import.meta.filename;

//core-modules
import morgan from 'morgan';

//custom-modules
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';

////MAIN APP
import express from 'express';
const app = express();

//MIDDLEWARE
if (process.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

////SUB ROUTERS

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

console.log(process.env.NODE_ENV);

export default app;
