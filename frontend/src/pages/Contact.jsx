
import { assets } from "../assets/assets";


const Contact = () => {
  return (
    <div >

      <div className="text-center text-2xl pt-10 text-gray 600">
         <p>Liện hệ với <span className="tex-gray-800 font-medium">chúng tôi</span></p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
          <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="" />
          
          <div className="my-10 flex flex-col justify-center items-start gap-6">
              <p className="font-semibold text-lg text-gray-600">Văn phòng của chúng tôi</p>
              <p className="text-gray-500">333 Phạm Văn Đồng <br /> Đà Nẵng</p>
              <p className="text-gray-500">SĐT: 000-000-0000 <br />Emai: cido4duytan@gmail.com</p>
              <p className="font-semibold text-lg text-gray-600">Gia nhập đội ngũ bác sĩ VIETCARE</p>
              <p className="text-gray-500">Tìm hiểu thêm về các nhóm và việc làm của chúng tôi.</p>
              <button className="bg-white text-primary border border-primary px-6 py-2 rounded-lg hover:scale-110 hover:bg-primary hover:text-white duration-300 transition-all" >
                  Tìm hiểu ngay
              </button>
          </div>
      </div>

    </div>
  );
};

export default Contact;
