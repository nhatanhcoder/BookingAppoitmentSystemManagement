import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Hàm kiểm tra dữ liệu nhập
const validateDoctorData = ({ name, email, password, speciality, degree, experience, about, fees, address, imageFile }) => {
    if (!name) return "Tên không được để trống";
    if (!email) return "Email không được để trống";
    if (!validator.isEmail(email)) return "Email không đúng định dạng";
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 8) return "Mật khẩu phải dài ít nhất 8 ký tự";
    if (!speciality) return "Chuyên môn không được để trống";
    if (!degree) return "Bằng cấp không được để trống";
    if (!experience) return "Kinh nghiệm không được để trống";
    if (!about) return "Mô tả về bác sĩ không được để trống";
    if (!fees) return "Phí khám không được để trống";
    if (!address) return "Địa chỉ không được để trống";
    if (!imageFile) return "Ảnh đại diện không được để trống";
    return null;
};

// Hàm upload ảnh lên Cloudinary
const uploadImage = async (filePath) => {
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "image" });
    if (!result || !result.secure_url) throw new Error("Tải lên ảnh thất bại");
    return result.secure_url;
};

// API thêm bác sĩ
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Kiểm tra dữ liệu
        const validationError = validateDoctorData({ name, email, password, speciality, degree, experience, about, fees, address, imageFile });
        if (validationError) return res.json({ success: false, message: validationError });

        if (email === process.env.EMAIL_ADMIN) {
            return res.status(403).json({ success: false, message: "Không thể thêm người dùng với email quản trị" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload ảnh
        const imageUrl = await uploadImage(imageFile.path);

        // Chuẩn bị dữ liệu bác sĩ
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        // Lưu vào cơ sở dữ liệu
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Thêm bác sĩ thành công" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API đăng nhập admin
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.EMAIL_ADMIN && password === process.env.PASSWORD_ADMIN) {
            // Tạo token
            const token = jwt.sign(
                { email, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            return res.json({ success: true, token, message: "Đăng nhập thành công" });
        }

        res.json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
};

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}

//API lấy data adminpanel-dashboard
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})

        const dashData = {
            doctors: doctors.length,
            patients: users.length
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}

export { addDoctor, adminLogin, allDoctors, adminDashboard };
