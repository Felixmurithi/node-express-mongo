import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

const userDataRes = (user) => {
  const { _id, name, email } = user;
  return { _id, name, email };
};

const errorResponse = (next, message, errcode) =>
  next(new AppError(message, errcode));

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(userDataRes(newUser), 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if password & email exists
  if (!email || !password) {
    errorResponse(next, 'Please provide an email and password', 400);
  }

  // check if they are corrrect
  const user = await User.findOne({ email }).select('+password'); //'+fieldname' allows selecting a field  that is set to select false
  if (!user) {
    errorResponse(next, 'Incorrect email or password', 401);
  }
  const correct = await user.correctPassword(password, user.password); // method defined in the schema to keep the  controller thin
  if (!user || !correct) {
    errorResponse(next, 'Incorrect email or password', 401);
  }
  //send token
  createSendToken(userDataRes(user), 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  //1) gett token and check if it is nnot expired
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    errorResponse(next, 'Please login to acess this page', 401);
  }
  //2, verify token-
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // pass function to promisfiy will return a function that can return a promise. pass the token and time to verify to tyhe promisified function

  //3. check if user is still signed up- get user idfrom  the token
  const user = await User.findById(decoded.id).select('+role'); // find by id doesnt need object passed with the _id field and value of id

  if (!user) {
    errorResponse(
      next,
      'The user belonging to this token no longer exists',
      401,
    );
  }

  //4. check if user changed password after token was issued.
  //this is how
  if (user.changedPasswordAfter(decoded.iat)) {
    errorResponse(
      next,
      'User recently changed password! Please log in again',
      402,
    );
  }

  //5. add user objeto the request obj and grant acess to the rooutes
  req.user = user;
  next();
});

//middleware gfunctions cannot receive any arguments, this wrapper argument, returns a middleware function which gets acess to the roles - TODO
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      errorResponse(
        next,
        'You dont have the permission to complete this action',
        403,
      );
    }
    next();
  };

//
export const forgotpassword = catchAsync(async (req, res, next) => {
  //1. gte user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    errorResponse(
      next,
      'There is no user registered with that email adress',
      401,
    );
  }
  //genereate a token
  const resetToken = await user.createPasswordResetToken();

  //3 send the email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/user/resetpassword/${resetToken}`;
  const message = `Forgot ur password? here is a link to : ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min',
      message,
    });

    res.status(200).json({ status: 'success', message: 'token sent to email' });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    errorResponse(next, 'Something went wrong please try again', 404);
  }
});

export const resetpassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiresIn: { $gt: Date.now() },
  });
  //2 if token has not expired
  if (!user) {
    errorResponse(next, 'Token is Invalid or has expired', 400);
  }

  //update user and save
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresIn = undefined;
  await user.save();

  // send response
  createSendToken(userDataRes(res), 200, res);
});

export const updatepassword = catchAsync(async (req, res, next) => {
  // get user using email
  const user = await User.findOne({ email: req.body.email }).select(
    '+password',
  );
  if (!req.user) {
    errorResponse(
      next,
      'There is no user registered with that email adress',
      404,
    );
  }

  // check if current password is correct
  const correct = user.correctPassword(req.body.currentPassword, user.password);
  if (!correct) {
    errorResponse(next, 'Currennt password is not correct', 404);
  }

  //update password
  user.password = req.body.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireIn = undefined;
  await user.save(); //validations are not turned off because the user details are in the in the req obj

  //send token
  createSendToken(userDataRes, 200, res);
});
