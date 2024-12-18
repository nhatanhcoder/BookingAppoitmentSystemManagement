import  { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {AppContext} from "../context/AppContext.jsx"
import { assets } from "../assets/assets.js";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendURL, token, getDoctorsData } = useContext(AppContext);
  const dayOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");


  console.log(backendURL);
  //lay data bacsi
  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log("Doctor Info:", docInfo);
  };

  //Tạo lịch
  const getAvailableSlots = () => {
    if (!docInfo) return;

    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // Set end time to 9 PM

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(Math.max(currentDate.getHours(), 10));
        currentDate.setMinutes(currentDate.getMinutes() > 60 ? 60 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0); // Start from 10 AM
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 60); // Update time
      }
      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
    console.log("Generated Slots:", allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Đăng nhập để đặt lịch khám');
      return navigate('/login');
    }
  
    if (!selectedTime) {
      alert("Vui lòng chọn thời gian trước khi đặt lịch.");
      return;
    }
  
    const userId = userData?._id;
    if (!userId) {
      toast.error('User ID is missing. Please log in again.');
      return;
    }
  
    // Construct the date as a string (e.g., "12_12_2024")
    const date = docSlots[selectedDayIndex][0].datetime;
    let day = date.getDate();
    let month = date.getMonth() + 1; // months are 0-indexed
    let year = date.getFullYear();
    const slotDate = `${day}_${month}_${year}`; // Correct date format
  
    if (!backendURL) {
      toast.error('Backend URL is missing.');
      return;
    }
  
    // Log the data before sending the request to ensure it's structured correctly
    console.log("Request Data:", {
      userId,
      docId,
      slotDate,
      slotTime: selectedTime,
    });
  
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`, 
        {
          userId,          // Add userId here
          docId,           // Doctor ID
          slotDate,        // Selected date
          slotTime: selectedTime,  // Selected time
        },
        { headers: { token } }
      );
  
      if (data.success) {
        toast.success(data.message);
        getDoctorsData; // Optionally refresh doctors data after booking
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Axios error:", error.response || error.message);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };
  

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

const { userData } = useContext(AppContext);

  const handleDayChange = (e) => {
    setSelectedDayIndex(Number(e.target.value));
    setSelectedTime(""); // Reset selected time when day changes
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-15 sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-600">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* About Doctor */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                Giới thiệu <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="font-medium py-8 text-gray-600">
              Giá đặt lịch: <span className="text-gray-900">{docInfo.fees}$</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Chọn ngày</p>
          <select
            className="w-full border p-2 rounded-lg mb-4"
            onChange={handleDayChange}
            value={selectedDayIndex}
          >
            {docSlots.map((daySlots, index) => (
              <option key={index} value={index}>
                {daySlots[0] &&
                  `${dayOfWeek[daySlots[0].datetime.getDay()]} - ${
                    daySlots[0].datetime.getDate()
                  }/${daySlots[0].datetime.getMonth() + 1}`}
              </option>
            ))}
          </select>

          <p>Chọn giờ</p>
          <select
            className="w-full border p-2 rounded-lg"
            onChange={handleTimeChange}
            value={selectedTime}
          >
            <option value="">Chọn giờ</option>
            {docSlots[selectedDayIndex]?.map((slot, index) => (
              <option key={index} value={slot.time}>
                {slot.time}
              </option>
            ))}
          </select>

           
          {selectedTime && (
            <p className="mt-4 text-gray-700">
              <strong>Thời gian đã chọn:</strong> {selectedTime}
            </p>
          )}
          
          <div className="mt-6">
            <button
              className="bg-primary text-white px-6 py-2 rounded-lg"
              onClick={bookAppointment}
            >
              Đặt lịch
            </button>
          </div> 
        </div>
      </div>
    )
  );
};

export default Appointment;
