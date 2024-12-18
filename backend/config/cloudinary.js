import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        console.log("Đã kết nối thành công với Cloudinary");
        return true;
    } catch (error) {
        console.error("Lỗi kết nối Cloudinary:", error);
        return false;
    }
}   
export default connectCloudinary