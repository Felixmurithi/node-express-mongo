import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProduct,
} from '../controllers/productsController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import { deleteProduct } from '../controllers/storeController.js';

const productRouter = express.Router();

productRouter.route('/').get(getAllProducts).post(createProduct);
productRouter
  .route('/:id')
  .get(getProduct)
  .patch(protect, restrictTo('admin'), createProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

export default productRouter;
