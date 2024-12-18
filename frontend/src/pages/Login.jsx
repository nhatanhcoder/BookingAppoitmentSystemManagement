import { useContext, useState,useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

  
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { backendURL, setToken, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Vui lòng nhập email hợp lệ');
      return false;
    }

    // Password validation for signup
    if (isSignUp) {
      if (formData.password.length < 8) {
        setError('Mật khẩu phải có ít nhất 8 ký tự');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu không khớp');
        return false;
      }

      // Optional: Add password complexity check
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordRegex.test(formData.password)) {
        setError('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt');
        return false;
      }
    }

    return true;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
   
    
    setError('');

    // Validate form
    if (!validateForm()) return;

    try {
      const endpoint = isSignUp ? '/api/user/register' : '/api/user/login';
      const payload = isSignUp 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const { data } = await axios.post(backendURL + endpoint, payload);

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        
        // Update token in context
        setToken(data.token);
        setUserData(data.userData);

        // Show success toast
        toast.success(isSignUp ? 'Đăng ký thành công' : 'Đăng nhập thành công');
        navigate('/');
      } else {
        // Show error from backend
        toast.error(data.message);
      }
      

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  console.error('Error Response:', error.response?.data); // Debug thông tin từ server
  toast.error(errorMessage);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
        </p>
        <p>
          Hãy {isSignUp ? "đăng ký" : "đăng nhập"} để tạo lịch hẹn
        </p>

        {isSignUp && (
          <div className="w-full">
            <p>Họ tên đầy đủ</p>
            <input
              name="name"
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={handleInputChange}
              value={formData.name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            name="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={handleInputChange}
            value={formData.email}
            required
          />
        </div>

        <div className="w-full relative">
  <p>Mật khẩu</p>
  <input
    name="password"
    className="border border-zinc-300 rounded w-full p-2 mt-1"
    type={showPassword ? "text" : "password"} // Thay đổi type dựa trên state
    onChange={handleInputChange}
    value={formData.password}
    required
  />
  <span
    className="absolute right-2 top-[42px] text-gray-600 cursor-pointer"
    onClick={() => setShowPassword(prev => !prev)} // Toggle state
  >
    {showPassword ? "Ẩn" : "Hiện"}
  </span>
</div>

{isSignUp && (
  <div className="w-full relative">
    <p>Nhập lại mật khẩu</p>
    <input
      name="confirmPassword"
      className="border border-zinc-300 rounded w-full p-2 mt-1"
      type={showConfirmPassword ? "text" : "password"}
      onChange={handleInputChange}
      value={formData.confirmPassword}
      required
    />
    <span
      className="absolute right-2 top-[42px] text-gray-600 cursor-pointer"
      onClick={() => setShowConfirmPassword(prev => !prev)} // Toggle state
    >
      {showConfirmPassword ? "Ẩn" : "Hiện"}
    </span>
  </div>
)}

        {error && (
          <p className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}

        <button 
          type="submit" 
          className="bg-primary text-white w-full rounded-md py-2"
        >
          {isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
        </button>

        {isSignUp ? (
          <p>
            Đã có tài khoản?{' '}
            <span
              onClick={() => setIsSignUp(false)}
              className="text-primary underline cursor-pointer"
            >
              Đăng nhập
            </span>
          </p>
        ) : (
          <p>
            Tạo tài khoản mới?{' '}
            <span
              onClick={() => setIsSignUp(true)}
              className="text-primary underline cursor-pointer"
            >
              Đăng ký
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;