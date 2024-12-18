
import { assets } from "../assets/assets";


const About = () => {
  return (
    <div>

      <div className="text-center text-2xl pt-10 text-gray 600">
        <p>Về <span className="tex-gray-800 font-medium">chúng tôi</span></p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
            <p>Chào mừng đến với VIETCARE, đối tác đáng tin cậy của bạn trong việc quản lý nhu cầu chăm sóc sức khỏe của bạn một cách thuận tiện và hiệu quả. Tại Prescripto, chúng tôi hiểu những thách thức mà mọi người phải đối mặt khi lên lịch hẹn khám bác sĩ và quản lý hồ sơ sức khỏe của họ.</p>
            <p>VIETCARE cam kết đạt đến sự xuất sắc trong công nghệ chăm sóc sức khỏe. Chúng tôi liên tục nỗ lực cải tiến nền tảng của mình, tích hợp những tiến bộ mới nhất để cải thiện trải nghiệm của người dùng và cung cấp dịch vụ vượt trội. Cho dù bạn đang đặt lịch hẹn đầu tiên hay quản lý việc chăm sóc liên tục, Prescripto luôn ở đây để hỗ trợ bạn trong từng bước thực hiện.</p>
            <b className="text-gray-800">Tầm nhìn dài hạn</b>
            <p>Tầm nhìn của chúng tôi tại VIETCARE là tạo ra trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người dùng. Chúng tôi mong muốn thu hẹp khoảng cách giữa bệnh nhân và nhà cung cấp dịch vụ chăm sóc sức khỏe, giúp bạn dễ dàng tiếp cận dịch vụ chăm sóc mà bạn cần, khi bạn cần.</p>
        </div>
       </div>

       <div className="text-xl my-4">
          <p>Tại sao nên chọn <span className="text-gray-700 font-semibold">chúng tôi</span></p>
       </div>
       <div className="flex flex-col md:flex-row mb-20 grid-col-3">
          <div className="border px-10 md:px16 py-8 sm:py-16 flex flex-col">
            <b>Sự hiệu quả:</b>
            <p>Lên lịch hẹn hợp lý phù hợp với lối sống bận rộn của bạn.</p>
          </div>
          <div className="border px-10 md:px16 py-8 sm:py-16 flex flex-col">
            <b>Sự tiện lợi:</b>
            <p>Truy cập vào mạng lưới các chuyên gia  đáng tin cậy trong khu vực của bạn.</p>
          </div>
          <div className="border px-10 md:px16 py-8 sm:py-16 flex flex-col">
            <b>Sự cá nhân hóa:</b>
            <p>Cá lời nhắc được thiết kế riêng để giúp bạn luôn theo dõi sức khỏe của mình.</p>
          </div>
       </div>
    </div>
  );
};

export default About;
