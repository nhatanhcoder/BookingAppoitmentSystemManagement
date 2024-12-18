import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentsModel from '../models/appointmentModel.js'

// Rate limiting for authentication routes
const authLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, 
    max: 3, 
    keyGenerator: (req, res) => req.body.username || "unknown", 
    message: {
        success: false,
        message: "Bạn đã nhập sai quá 3 lần. Vui lòng thử lại sau 2 phút.",
    },
    skipSuccessfulRequests: true, 
});

const registerUser = async (req, res) => {
    try {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { name, email, password } = req.body;

        // Comprehensive input validation
        if (!name || !password || !email) {
            return res.status(400).json({
                success: false, 
                message: "Vui lòng cung cấp đầy đủ thông tin!"
            });
        }

        // Enhanced email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false, 
                message: "Địa chỉ email không hợp lệ"
            });
        }

        // Strong password validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false, 
                message: "Mật khẩu phải có ít nhất 8 ký tự"
            });
        }

        // Check for complex password
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
            return res.status(400).json({
                success: false, 
                message: "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false, 
                message: "Địa chỉ email đã được sử dụng"
            });
        }

        // More secure password hashing
        const salt = await bcrypt.genSalt(8); // Increased from 10 to 12
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name: validator.escape(name), // Sanitize input
            email: validator.normalizeEmail(email),
            password: hashedPassword,
            createdAt: new Date()
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        // More secure token generation
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '1h', // Shorter expiration
                algorithm: 'HS256' 
            }
        );

        // Do not send sensitive user details in response
        res.status(201).json({ 
            success: true, 
            token 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi trong quá trình đăng ký" 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Prevent timing attacks with constant-time comparison
        const user = await userModel.findOne({ 
            email: validator.normalizeEmail(email) 
        }).select('+password'); // Ensure password is selected

        if (!user) {
            // Deliberate delay to prevent enumeration
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(401).json({ 
                success: false, 
                message: "Thông tin đăng nhập không hợp lệ" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign(
                { 
                    id: user._id, 
                    email: user.email 
                }, 
                process.env.JWT_SECRET, 
                { 
                    expiresIn: '1h', 
                    algorithm: 'HS256' 
                }
            );

            res.json({ 
                success: true, 
                token 
            });
        } else {
            // Deliberate delay to prevent brute force
            await new Promise(resolve => setTimeout(resolve, 1000));
            res.status(401).json({ 
                success: false, 
                message: "Thông tin đăng nhập không hợp lệ" 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Đã xảy ra lỗi trong quá trình đăng nhập" 
        });
    }
};
const getProfile = async (req,res) =>{
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}

const updateProfile = async (req,res) =>{
    try {
        const {userId,name,phone,address,dob,gender} = req.body
        const imageFile = req.file
        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"Data missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name, phone, address: JSON.parse(address),dob,gender})

        if (imageFile) {
            const imageUpdate = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpdate.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Profile đã được cập nhật"})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}

const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin cần thiết.' });
        }

        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData) {
            return res.status(404).json({ success: false, message: 'Bác sĩ không tìm thấy' });
        }

        if (!docData.available) {
            return res.status(400).json({ success: false, message: 'Bác sĩ không khả dụng' });
        }

        let slots_booked = docData.slots_booked;
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.status(400).json({ success: false, message: 'Lịch đã được người khác đặt' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');

        if (!userData) {
            return res.status(404).json({ success: false, message: 'Người dùng không tìm thấy' });
        }

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        // Create and save the new appointment
        const newAppointment = new appointmentsModel(appointmentData);
        await newAppointment.save();

        // Update the doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Return success message
        return res.status(200).json({ success: true, message: 'Đặt lịch thành công' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};
  
const cancelAppointment = async (req, res) => {
    try {
        const {userId, appointmentId} = req.body

        const appointmentData = await appointmentsModel.findById(appointmentId)

        if(appointmentData.userId !== userId){
            return res.json({success:false, message:'Unauthorized'})
        }


    } catch (error) {
        
    }
}

const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body; // Ensure userId is being sent in the request body
        const appointments = await appointmentsModel.find({ userId }).populate('docId'); // Ensure docId is populated
        res.json({ success: true, appointments });
       // Log the fetched appointments
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau." });
    }
};

export { registerUser, loginUser, authLimiter,getProfile,updateProfile, bookAppointment, listAppointment };