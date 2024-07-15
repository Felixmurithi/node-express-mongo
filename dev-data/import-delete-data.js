import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import Store from '../models/storeModel.js';
import Product from '../models/productsModel.js';

//DIRNAME & FILNAME
export const currentFilePath = fileURLToPath(import.meta.url);
export const currentDirectory = dirname(currentFilePath);

//CONNECT
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

//READ JSON
const stores = JSON.parse(
  fs.readFileSync(`${currentDirectory}/stores.json`, 'utf-8'),
);
const products = JSON.parse(
  fs.readFileSync(`${currentDirectory}/products.json`, 'utf-8'),
);

console.log(process.argv);

//DELETE-IMPORT
async function deleteData(model) {
  try {
    await model.deleteMany();
    console.log('data succesfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}
async function importData(model, data) {
  try {
    await model.create(data);
    console.log('data succesfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

//SCRIPT CONDITIONS
if (process.argv[2] === '--delete') {
  if (process.argv[3] === '--stores') deleteData(Store);
  if (process.argv[3] === '--products') deleteData(Product);
}
if (process.argv[2] === '--import') {
  if (process.argv[3] === '--stores') importData(Store, stores);
  if (process.argv[3] === '--products') importData(Product, products);
}

//SCRIPTs
// node --env-file=./config.env dev-data/import-delete-data.js --delete --stores
// node --env-file=./config.env dev-data/import-delete-data.js --import --stores
// node --env-file=./config.env dev-data/import-delete-data.js --delete --products
// node --env-file=./config.env dev-data/import-delete-data.js --import --products
