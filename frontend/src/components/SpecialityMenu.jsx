
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'


const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-3 py-16 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-bold'>Tìm theo chuyên khoa</h1>
      <p></p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
        {specialityData.map((item,index)=>
          <Link onClick={()=>scrollTo(0,0)} className='hover:translate-y-[-10px] transition-all duration-750' key={index} to={`/doctors/${item.speciality}`}>
            <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
            <p className='flex justify-center'>{item.speciality}</p>
          </Link>
        )}
      </div>
    </div>
  )
}

export default SpecialityMenu