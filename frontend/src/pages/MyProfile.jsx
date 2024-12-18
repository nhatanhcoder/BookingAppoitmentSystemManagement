import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendURL, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(userData?.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));

      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendURL}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response);
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    userData && (
      <div className="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-lg">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            className="w-36 h-36 rounded-full border border-gray-200 object-cover"
            src={previewImage || userData.image}
            alt="User profile"
          />
          {isEdit && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-sm text-gray-600"
            />
          )}
        </div>

        {/* Name */}
        <div className="mt-4 text-center">
          {isEdit ? (
            <input
              className="text-center text-3xl font-medium border-b-2 border-gray-300 focus:outline-none"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <h2 className="text-3xl font-semibold">{userData.name}</h2>
          )}
        </div>

        <hr className="my-4 border-t border-gray-200" />

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Thông tin liên hệ
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600 font-medium">Email:</span>
              <span className="w-2/3 text-blue-600">{userData.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600 font-medium">
                Điện thoại:
              </span>
              {isEdit ? (
                <input
                  className="w-2/3 border p-1 rounded"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <span className="w-2/3 text-blue-600">{userData.phone}</span>
              )}
            </div>
            <div className="flex items-start">
              <span className="w-1/3 text-gray-600 font-medium">Địa chỉ:</span>
              {isEdit ? (
                <div className="w-2/3 space-y-1">
                  <input
                    className="w-full border p-1 rounded"
                    placeholder="Số nhà, tên đường"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    className="w-full border p-1 rounded"
                    placeholder="Thành phố"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="w-2/3">
                  <p>{userData.address.line1}</p>
                  <p>{userData.address.line2}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="my-4 border-t border-gray-200" />

        {/* Identification Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Thông tin định danh
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600 font-medium">
                Giới tính:
              </span>
              {isEdit ? (
                <select
                  className="w-2/3 border p-1 rounded"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <span className="w-2/3">{userData.gender}</span>
              )}
            </div>
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600 font-medium">
                Ngày sinh:
              </span>
              {isEdit ? (
                <input
                  className="w-2/3 border p-1 rounded"
                  type="date"
                  value={userData.dob || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              ) : (
                <span className="w-2/3">
                  {userData.dob
                    ? new Date(userData.dob).toLocaleDateString()
                    : "Chưa chọn ngày sinh"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-6 space-x-3">
          {isEdit ? (
            <>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={updateUserProfileData}
              >
                Lưu thông tin
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsEdit(false)}
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsEdit(true)}
            >
              Sửa
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
