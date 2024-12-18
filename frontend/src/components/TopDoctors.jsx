import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; 
import { useNavigate } from "react-router-dom";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext); // Lấy dữ liệu từ context
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false); // State để kiểm soát hiển thị danh sách đầy đủ

  // Danh sách các chuyên khoa cần hiển thị
  const specialties = [
    'Bác sĩ đa khoa',
    'Bác sĩ phụ khoa',
    'Bác sĩ da liễu',
    'Bác sĩ nhi khoa',
    'Bác sĩ thần kinh',
    'Bác sĩ tiêu hóa'
  ];

  // Lọc bác sĩ theo chuyên khoa và kinh nghiệm cao nhất
  const topDoctors = specialties.map((specialty) => {
    const filteredDoctors = doctors
      .filter((doctor) => doctor.speciality === specialty) // Lọc theo chuyên khoa
      .sort((a, b) => parseInt(b.experience) - parseInt(a.experience)); // Sắp xếp theo năm kinh nghiệm giảm dần

    return filteredDoctors[0]; // Lấy bác sĩ có kinh nghiệm cao nhất trong từng chuyên khoa
  }).filter(Boolean); // Loại bỏ các giá trị undefined (nếu không có bác sĩ trong chuyên khoa)

  // Quyết định danh sách hiển thị dựa vào trạng thái showAll
  const displayedDoctors = showAll ? doctors : topDoctors;

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        {showAll 
          ? "Discover all our doctors and choose the best one for your needs."
          : "Meet our top-rated doctors and choose the best one for your needs."
        }
      </p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 sm:py-0'>
        {displayedDoctors.map((doctor) => (  
          <div
            key={doctor._id} 
            onClick={() => navigate(`/appointment/${doctor._id}`)} 
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
          >
            <img
              className='bg-blue-50 w-full h-60 object-cover'
              src={doctor.image} 
              alt={doctor.name} 
            />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                <p>{doctor.available ? "Available" : "Not Available"}</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p> {/* Tên bác sĩ */}
              <p className='text-gray-600 text-sm'>{doctor.speciality}</p> {/* Chuyên môn bác sĩ */}
            </div>
          </div>
        ))}
      </div>
      <button 
        className='px-6 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
        onClick={() => setShowAll(!showAll)} 
      >
        {showAll ? "Show Top Doctors" : "More"}
      </button>
    </div>
  );
};

export default TopDoctors;
