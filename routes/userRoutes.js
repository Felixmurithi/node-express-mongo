import express from 'express';
import {
  forgotpassword,
  login,
  protect,
  resetpassword,
  restrictTo,
  signup,
  updatepassword,
} from '../controllers/authController.js';
import {
  deleteMe,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotpassword', forgotpassword);
userRouter.patch('/resetpassword/:token', resetpassword);

userRouter.use(protect);
userRouter.patch('/updatepassword', updatepassword);
userRouter.patch('/updateme', updateMe);
userRouter.delete('/deleteme', deleteMe);
userRouter.get('/me', getMe, getUser);

userRouter.use(restrictTo('general-admin'));
userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUser);

export default userRouter;
