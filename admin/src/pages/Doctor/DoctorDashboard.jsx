import { useContext,useEffect} from "react";
import { DoctorContext } from '../../context/DoctorContext'
import {assets} from '../../assets/assets'

const DoctorDashboard = () => {
    const { dToken, dashData, getDashData,compleAppointment,cancelAppointment } = useContext(DoctorContext)
    const {currency, sloDateFormat} = useContext(DoctorContext)
    useEffect(() => {
        if (dToken) {
            getDashData()
        }
    }, [dToken])
    return dashData && (
        <div className='m-5'>
            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-solid border-gray-300 rounded-lg'>
                <img className='w-14' src={assets.earning_icon} alt="" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{currency}{dashData.earnings}</p>
                    <p className='text-gray-400'>Earnings</p>
                </div>
            </div>

            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-solid border-gray-300 rounded-lg'>
                <img className='w-14' src={assets.assets_appointments_icon} alt="" />
                <div>
                    <p className='text-cl font-semibold text-gray-600'>{dashData.appointments}</p>
                    <p className='text-gray-400'>Appointments_Icon</p>
                </div>
            </div>

            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-solid border-gray-300 rounded-lg'>
                <img className='w-14' src={assets.patinets_icon} alt="" />
                <div>
                    <p className='text-cl font-semibold text-gray-600'>{dashData.patinets}</p>
                    <p className='text-gray-400'>Patients</p>
                </div>
            </div>

            <div className='bg-white'>
                <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
        <img src={assets.list_icon} alt='' />
        <p className='font-semibold'>Latest Bookings</p>
    </div>
    <div className='pt-4 border border-t-0'>
        {
            dashData.latestAppointments.map((item, index) => (
                <div className='flex items-center px-6 py-3 hover:bg-gray-100' key={index}>
                    <img className='rounded-full w-10' src={item.userData.image} alt="" />
                    <div className='flex-1 text-sm'>
                        <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                        <p className='text-gray-600'>{sloDateFormat(item.slotData)}</p>
                    </div>
                    {
                        item.cancelled
                        ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                        : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.Complete_icon} alt="" />
                        ? <p className ='text-red-400 text-xs font-medium'>Cancelled</p>
: item.isCompleted
                            ? <p className='text-green-500 text-tx font-medium'>Completed</p>
                            : <div className='flex'>
                                <img onClick={() => cancelAppointment(item._id)} className ='w-10 cursor-pointer' src={assets.complete_icon} alt=""/>
                                <img onClick={() => compleAppointment(item._id)} className ='w-10cursor-pointer' src={assets.complete_icon} alt=""/>
                            </div>
                    }
                </div>
            ))
        }
    </div>
</div>
        </div>
    )
}

export default DoctorDashboard