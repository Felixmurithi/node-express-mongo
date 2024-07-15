import express from 'express';
import {
  forgotpassword,
  login,
  protect,
  resetpassword,
  signup,
  updatepassword,
} from '../controllers/authController.js';
import {
  deleteMe,
  getAllUsers,
  getUser,
  updateMe,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotpassword', forgotpassword);
userRouter.patch('/resetpassword/:token', resetpassword);
userRouter.patch('/updatepassword', protect, updatepassword);
userRouter.patch('/updateme', protect, updateMe);
userRouter.delete('/deleteme', protect, deleteMe);

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUser);

export default userRouter;
