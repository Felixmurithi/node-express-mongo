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

const storeRouter = express.Router();

storeRouter.route('/').get(protect, getAllStores).post(createStore); // using middleware tp protect teh route
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
