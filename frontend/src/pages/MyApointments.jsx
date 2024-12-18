import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyApointments = () => {
  const { backendURL, token, userData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const getAppointment = async() =>{
      try {
        
        const {data} = await axios.post(backendURL+'/api/user/appointments', {userId: userData._id}, {headers:{token}})

        if(data.success){
            setAppointments(data.appointments.reverse())
            console.log('Appointments Data:', data.appointments)
        }
      } catch (error) {
          console.error("Error fetching appointments:", error)
          toast.error(error.message)
      }
  }
  
  useEffect(()=>{
    if(token){
      getAppointment()
    }
  }, [token])

  console.log("Appointments Data:", appointments);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">Lịch khám của tôi</p>
      <div>
        {appointments.map((appointment, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={appointment.docData?.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{appointment.docData?.name}</p>
              <p>{appointment.docData?.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">địa chỉ</p>
              <p className="text-xs">{appointment.docData?.address?.line1}</p>
              <p className="text-xs">{appointment.docData?.address?.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Ngày & giờ</span> {appointment.slotDate} {appointment.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Thanh toán trực tuyến</button>
              <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded">Hủy lịch</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApointments;
