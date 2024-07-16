import express from 'express';
import {
  createStore,
  getAllStores,
  getStore,
  updateStore,
  deleteStore,
  getStoreStats,
  updateProduct,
  deleteProduct,
} from '../controllers/storeController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import productRouter from './productRouter.js';

const storeRouter = express.Router();

// mounting a sub route on the sub router
// storeRouter.use("/products", reviewRouter)
// const productRouter = express.Router({mergeParams: true}); // that option because each routes only gets acess to its own params

storeRouter.use('/:storeId/products', productRouter);

storeRouter
  .route('/')
  .get(getAllStores)
  .post(protect, restrictTo('general-admin'), createStore); // using middleware tp protect teh route
storeRouter.route('/avg').get(getStoreStats);
//params should come last.
storeRouter
  .route('/:id')
  .get(getStore)
  .patch(protect, restrictTo('general-admin'), updateStore)
  .delete(protect, restrictTo('general-admin'), deleteStore);

storeRouter
  .route('/:id/:product')
  .get(getStore)
  .patch(protect, restrictTo('store-admin', 'general-admin'), updateProduct)
  .delete(protect, restrictTo('store-admin', 'general-admin'), deleteProduct);

storeRouter
  .route('/:id/:/product/discount')
  .get(protect, getStore)
  .patch(protect, restrictTo('general-admin'), updateStore);

export default storeRouter;
