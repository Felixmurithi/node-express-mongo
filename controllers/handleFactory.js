import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import ApiFeatures from './apiFeatures.js';

export const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    //.populate({
    //   path: 'guides',
    //   select: '-__v -passwordChangedAt',
    // });

    const doc = await query;
    if (!doc) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.storeId) {
      filter = { store: req.params.storeId };
    }

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();
    //EXECUTE QUERY
    // const docs = await features.query.explain();
    const docs = await features.query;
    res.status(201).json({
      status: 'sucess',
      results: docs.length,
      data: docs,
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('NO item found with that id', 404));
    }
    res.status(201).json({
      status: 'sucess',
      data: null,
    });
  });
// export const deleteProduct = catchAsync(async (req, res, next) => {
//   const storeId = req.params.id;
//   const store = await Product.findByIdAndDelete(storeId);
//   if (!store) {
//     return next(new AppError('NO product found with that id', 404));
//   }
//   res.status(201).json({
//     status: 'sucess',
//     data: null,
//   });
// });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('NO document found with that id', 404));
    }
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    //only the fields in the schema will be added.
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });
