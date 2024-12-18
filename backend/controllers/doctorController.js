import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Thay đổi thành công' })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}


const loginDoctor = async(req , res ) =>{
    try{
        const {email, password} =req.body
        const docter = await doctorModel.findOne({email})
        if(! docter){
            return res.json({success:false,message:"Thông tin xác thực không hợp lệ"})
        }
        const isMatch = await bcrypt.compare(password, docter.password)
        if(isMatch){
            const token = jwt.sign({id:docter._id},process.env.JWT_SECRET)
            res.json({success:true,token})

        }else{
            res.json({success:false,message:"Mật khẩu không đúng"})
        }
    }catch(error){
        console.error(error);
        res.json({ success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" });
    }
}
export { changeAvailability, doctorList,loginDoctor }