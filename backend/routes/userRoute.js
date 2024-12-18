import express from 'express'
import { registerUser ,loginUser,authLimiter, getProfile, updateProfile, bookAppointment, listAppointment } from '../controllers/userController.js'
import { registerValidation, loginValidation, validateRequest } from '../middlewares/validationMiddleware.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerValidation, 
    validateRequest,registerUser)
userRouter.post('/login',authLimiter,loginValidation, 
    validateRequest,loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile  )
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.post('/appointments', authUser, listAppointment);

export default userRouter
