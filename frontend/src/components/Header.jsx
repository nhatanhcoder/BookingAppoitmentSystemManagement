
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">

      {/*--------left---------*/}
      <div className='md:w-3/5 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-3xl md:text-3xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Đặt lịch ngay ! <br /> Với những bác sĩ hàng đầu
        </p>
        <div >
        </div>
        <a href="#speciality" className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 font-bold ">
          Đặt lịch khám <img src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/*--------right---------*/}
      <div className="md:w-2/5 relative">
        <img
          className="w-full h-auto md:absolute bottom-0 object-contain rounded-lg"
          src={assets.header_img}
          alt="Header"
        />
      </div>


    </div>
  )
}

export default Header
