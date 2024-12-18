import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
    const { aToken, getDashData, dashData } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getDashData()
        }
    }, [aToken])

    return dashData && (
        <div className='m-5'>
            <h1 className='text-lg font-medium'>Thống Kê Hiện Tại</h1>
            <div className='flex flex-wrap gap-2'>
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img src={assets.doctor_icon} alt="" />
                    <div>
                        <p>{dashData.doctors}</p>
                        <p>Bác Sĩ</p>
                    </div>
                </div>
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img src={assets.patients_icon} alt="" />
                    <div>
                        <p>{dashData.patients}</p>
                        <p>Bệnh Nhân</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
