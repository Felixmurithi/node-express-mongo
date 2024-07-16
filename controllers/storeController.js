import Store from '../models/storeModel.js';
import catchAsync from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getOne,
  updateOne,
  getAll,
} from './handleFactory.js';

export const createStore = createOne(Store);
export const getAllStores = getAll(Store);

export const getStore = getOne(Store, 'products');

export const updateStore = updateOne(Store);

export const deleteStore = deleteOne(Store);

export const updateProduct = updateOne(Store);

export const deleteProduct = deleteOne(Store);

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
