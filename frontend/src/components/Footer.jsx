
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* ----------------left--------------- */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. A, eum. Necessitatibus vitae tenetur accusantium maiores qui voluptates in soluta ipsa optio? Excepturi fuga quis quia mollitia consequuntur natus voluptatem autem?</p>
            </div>

            {/* ----------------center--------------- */}
            <div>
                <p className='text-xl font-medium mb-5'>CÔNG TY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Trang chủ</li>
                    <li>Giới thiệu về chúng tôi</li>
                    <li>Liện hệ</li>
                    <li>Chính sách</li>
                </ul>
            </div>

            {/* ----------------right--------------- */}
            <div>
                <p className='text-xl font-medium mb-5'>THÔNG TIN LIÊN HỆ</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+84 000-000-000</li>
                    <li>cido4duytan@gmail.com</li>
                </ul>
            </div>

        </div>
                   {/* ------------copiringht--------------- */}
                   <div>
                <hr />
                <p className='text-sm py-5 text-center'>Copyright 2024@VITECARE - All Right Reserved</p>
            </div>
    </div>
  )
}

export default Footer