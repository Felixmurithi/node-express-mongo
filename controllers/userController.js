import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { deleteOne, getOne } from './handleFactory.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}; // has to be decared here so that it can  be returned

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
export const getUser = getOne(User);

export const updateMe = catchAsync(async (req, res, next) => {
  //
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('this route is not for password updates', 400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  //findBY ID would have required saving- which needs all the fields
  //these are implements of mongo queries and saving btw
  const updateduser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updateduser },
  });
});

export const deleteMe = deleteOne(User);
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(201).json({
    status: 'sucess',
    results: users.length,
    data: users,
  });
});

export const deleteuser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return next(new AppError('NO user found with that id', 404));
  }

  res.status(201).json({
    status: 'sucess',
    data: null,
  });
});
