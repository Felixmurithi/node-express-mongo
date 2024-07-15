import Store from '../models/storeModel.js';
import catchAsync from '../utils/catchAsync.js';
import ApiFeatures from './apiFeatures.js';
import AppError from '../utils/appError.js';

export const createStore = catchAsync(async (req, res, next) => {
  const store = await Store.create(req.body);
  //only the fields in the schema will be added.
  res.status(201).json({
    status: 'success',
    data: store,
  });
});
export const getAllStores = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Store.find(), req.query)
    .filter()
    .sort()
    .fieldLimit() // TODO
    .pagination();
  //EXECUTE QUERY
  const stores = await features.query;
  res.status(201).json({
    status: 'sucess',
    results: stores.length,
    data: stores,
  });
});

export const getStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Store.findById(storeId);
  if (!store) {
    return next(new AppError('NO tour found with that id', 404));
  }
  res.status(201).json({
    status: 'sucess',
    data: store,
  });
});

export const updateStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Store.findByIdAndUpdate(storeId, req.body, {
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

export const deleteStore = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Store.findByIdAndDelete(storeId);
  if (!store) {
    return next(new AppError('NO tour found with that id', 404));
  }
  res.status(201).json({
    status: 'sucess',
    data: null,
  });
});
export const updateProduct = catchAsync(async (req, res, next) => {
  const storeId = req.params.id;
  const store = await Store.findByIdAndUpdate(storeId, req.body, {
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
  const store = await Store.findByIdAndDelete(storeId);
  if (!store) {
    return next(new AppError('NO tour found with that id', 404));
  }
  res.status(201).json({
    status: 'sucess',
    data: null,
  });
});

export const getStoreStats = catchAsync(async (req, res, next) => {
  //AGGREGATE
  //out data into a pipeline.
  const stores = await Store.aggregate([
    {
      $group: {
        _id: '$type',
        avgRating: { $avg: '$rating' },
        numStores: { $sum: 1 },
      },
    },
    { $match: { _id: { $ne: 'all' } } },

    { $sort: { _id: 1 } },
  ]);

  res.status(201).json({
    status: 'success',
    data: stores,
  });
});
