import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shuuting down ');
}); // has to be the other process because its needs to be listening before their scripts are loaded

// eslint-disable-next-line import/first
import app from './app.js';

//CONN#ECT USING MOONGOSE
// moongose is a mongo high driver taht makes the development much faster and easiier by extraction most of the steps needed in mongo.

const DATABASE = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connected succesfuly');
  });

//SERVER
const port = 3000;

const server = app.listen(port, () => {
  console.log('app running in the server');
});

//UNHAnDLED PROMISE REJECTION
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shuuting down ');
  server.close(() => {
    process.exit(1);
  }); // closing the server after all currenctrequests are processed
});

// console.log(c);
