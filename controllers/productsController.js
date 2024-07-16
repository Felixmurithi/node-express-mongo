import catchAsync from '../utils/catchAsync.js';
import ApiFeatures from './apiFeatures.js';
import Product from '../models/productModel.js';
import { deleteOne, getAll, getOne, updateOne } from './handleFactory.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const store = await Product.create(req.body);
  //only the fields in the schema will be added.
  res.status(201).json({
    status: 'success',
    data: store,
  });
});

export const getProduct = getOne(Product);

export const updateProduct = updateOne(Product);

export const deleteProduct = deleteOne(Product);

export const getAllProducts = getAll(Product);

// export const getAllProducts = catchAsync(async (req, res, next) => {
//   //get products based on store id
//   let filter = {};
//   if (req.params.storeId) {
//     filter = { store: req.params.storeId };
//   }

//   const model = new ApiFeatures(Product.find(filter), req.query)
//     .filter()
//     .sort()
//     .fieldLimit()
//     .pagination();
//   //EXECUTE QUERY
//   const stores = await model.query;

//   //AGGREGATE
//   //out data into a pipeline.
//   // const stores = await store.aggregate([
//   //   {
//   //     $group: {
//   //       _id: '$name',
//   //     },
//   //   },

//   //   { $sort: { _id: 1 } },
//   // ]); -TODO

//   res.status(201).json({
//     status: 'success',
//     data: stores,
//   });
// });
