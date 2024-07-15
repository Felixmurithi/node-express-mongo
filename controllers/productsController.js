import catchAsync from '../utils/catchAsync.js';
import ApiFeatures from './apiFeatures.js';
import AppError from '../utils/appError.js';
import Product from '../models/productsModel.js';

export const createProduct = catchAsync(async (req, res, next) => {
  const store = await Product.create(req.body);
  //only the fields in the schema will be added.
  res.status(201).json({
    status: 'success',
    data: store,
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Product.findById(storeId);
  if (!store) {
    return next(new AppError('NO tour found with that id', 404));
  }
  res.status(201).json({
    status: 'sucess',
    data: store,
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Product.findByIdAndUpdate(storeId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!store) {
    return next(new AppError('NO tour found with that id', 404));
  }
  res.status(201).json({
    status: 'success',
    data: store,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Product.findByIdAndDelete(storeId);
  if (!store) {
    return next(new AppError('NO tour found with that id', 404));
  }
  res.status(201).json({
    status: 'sucess',
    data: null,
  });
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const store = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .fieldLimit() // TODO
    .pagination();
  //EXECUTE QUERY

  //AGGREGATE
  //out data into a pipeline.
  const stores = await store.aggregate([
    {
      $group: {
        _id: '$name',
      },
    },

    { $sort: { _id: 1 } },
  ]);

  res.status(201).json({
    status: 'success',
    data: stores,
  });
});
