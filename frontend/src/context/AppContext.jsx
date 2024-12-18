import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (Props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL; 
  const [doctors, setDoctors] = useState([]); 
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false); 
  const currencySymbol = 'VND';
  const [userData, setUserData] = useState(false);

  // Fetch doctors data
  useEffect(() => {
    const getDoctorsData = async () => { 
      try {
        const { data } = await axios.get(`${backendURL}/api/doctor/list`);
        if (data.success) {
          setDoctors(data.doctors); 
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.message);
      }
    };
    getDoctorsData(); 
  }, [backendURL]);

  
  const loadUserProfileData = async () => {
    if (!token) return; 
    try {
      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, { headers:{token} } );
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      loadUserProfileData(); 
    } else {
      setUserData(false);
    }
  }, [token, backendURL]); 

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendURL,
    userData,
    setUserData,
    loadUserProfileData,  
  };

  return (
    <AppContext.Provider value={value}>
      {Props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
