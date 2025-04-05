"use client";

import { NextPage } from "next";
import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaCrown,
  FaCalendarAlt,
  FaWrench,
  FaCertificate,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import userApi, { User } from "@/app/api/user";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Cookies from "js-cookie";
import Link from "next/link";
import UpdateProfileModal from "@/app/profile/modals/updateProfileModal";
import UpdateDoctorModal from "@/app/profile/modals/updateSpecModal";

const Profile: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateUser, setUpdateUser] = useState<{
    id: bigint;
    username: string;
    email: string;
    password: string;
  } | null>(null);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [updateDoctor, setUpdateDoctor] = useState<{
    id: bigint;
    specialization: string;
    certificate: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          const userId = BigInt(parsedUser.id);
          const response = await userApi.getUserById(userId);
          if (response.status === "ok") {
            const userData = response.data;
            if (userData.role === "DOCTOR") {
              try {
                const doctorResponse = await userApi.getDoctorById(userId);
                if (doctorResponse.status === "ok") {
                  const doctorData = doctorResponse.data;
                  const updatedUserData = {
                    ...userData,
                    specialization: doctorData.specialization,
                    certificate: doctorData.certificate,
                  };
                  setUser(updatedUserData);
                } else {
                  console.error("Error fetching doctor data:", doctorResponse.message);
                  setUser(userData);
                }
              } catch (error) {
                console.error("Error fetching doctor data:", error);
                setUser(userData);
              }
            } else {
              setUser(userData);
            }
          } else {
            console.error("Error fetching user:", response.message);
          }
        } catch (err) {
          console.error("Error parsing user cookie", err);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const openUpdateModal = () => {
    if (user) {
      setUpdateUser({
        id: user.id,
        username: user.username,
        email: user.email,
        password: "",
      });
      setShowUpdateModal(true);
    }
  };

  const openSpecModal = async () => {
    if (user && user.role === "DOCTOR") {
      try {
        const doctorResponse = await userApi.getDoctorById(user.id);
        if (doctorResponse.status === "ok") {
          const doctorData = doctorResponse.data;
          if (!doctorData || !doctorData.doctorId) {
            throw new Error("Doctor ID not found.");
          }
          setUpdateDoctor({
            id: doctorData.doctorId,
            specialization: doctorData.specialization || "",
            certificate: doctorData.certificate || "",
          });
          setShowSpecModal(true);
        } else {
          console.error("Error fetching doctor data:", doctorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    }
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updateUser) {
      setUpdateUser({
        ...updateUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updateDoctor) {
      setUpdateDoctor({
        ...updateDoctor,
        [e.target.name]: e.target.value,
      });
    }
  };

  const closeUpdateModal = () => setShowUpdateModal(false);
  const closeSpecModal = () => setShowSpecModal(false);

  const saveProfileChanges = async () => {
    if (updateUser) {
      try {
        const updateResponse = await userApi.updateUserProfile(updateUser.id, updateUser);
        if (updateResponse.status === "ok") {
          setUser({ ...user!, ...updateResponse.data });
          closeUpdateModal();
        } else {
          console.error("Error updating profile:", updateResponse.message);
        }
      } catch (err) {
        console.error("Error updating user:", err);
      }
    }
  };

  const saveSpecChanges = async () => {
    if (updateDoctor) {
      try {
        const specResponse = await userApi.updateSpec(updateDoctor.id, updateDoctor);
        if (specResponse.status === "ok") {
          setUser({
            ...user!,
            specialization: specResponse.data.specialization,
            certificate: specResponse.data.certificate,
          });
          closeSpecModal();
        } else {
          console.error("Error updating doctor specialization:", specResponse.message);
        }
      } catch (err) {
        console.error("Error updating doctor specialization:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">
          You&apos;ve not signed in to view your profile.
        </p>
        <Link href="./" className="mt-2 text-sm text-blue-400 hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const isDoctor = user.role === "DOCTOR";
  const specialization = isDoctor ? user.specialization || "Cardiology" : "";
  const certificate = isDoctor
    ? user.certificate ||
      "https://via.placeholder.com/300x200?text=Certificate+Not+Available"
    : "";

  return (
    <div
      className="flex flex-col min-h-screen text-white"
      style={{
        background: "linear-gradient(to bottom, #1e1e1e, #121212)",
        backgroundImage: "url('/parttern02.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <Navbar />
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-64 object-cover"
              src="/parttern01.jpg"
              alt="Cover Image"
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
              <img
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
                src="/neutral.png"
                alt="Profile Picture"
              />
            </div>
          </div>
          <div className="mt-20 px-8 pb-8">
            <div className="text-center mb-10">
              <h2 className="flex items-center justify-center gap-2 text-4xl font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="flex items-center justify-center gap-2 text-xl text-gray-600">
                <FaEnvelope /> {user.email}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Role
                    </span>
                    <span className="text-gray-800">{user.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaCrown className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Membership
                    </span>
                    <span className="text-gray-800">{user.membership}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Created Date
                    </span>
                    <span className="text-gray-800">
                      {new Date(user.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Email
                    </span>
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaLock className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Password
                    </span>
                    <span className="text-gray-800">
                      {showPassword ? user.password : "********"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-700 hover:text-gray-900"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            {isDoctor && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <FaWrench className="text-gray-700 text-2xl" />
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Specialization
                    </h3>
                  </div>
                  <p className="text-gray-700 text-center">{specialization}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <FaCertificate className="text-gray-700 text-2xl" />
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Certificate
                    </h3>
                  </div>
                  <img
                    src={certificate}
                    alt="Certificate"
                    className="w-full max-w-xs h-auto rounded shadow"
                  />
                </div>
              </div>
            )}
            <div className="mt-12 flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={openUpdateModal}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition duration-300"
              >
                Update Profile
              </button>
              {isDoctor && (
                <button
                  onClick={openSpecModal}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
                >
                  Update Specialization
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showUpdateModal && updateUser && (
        <UpdateProfileModal
          isOpen={showUpdateModal}
          user={updateUser}
          handleChange={handleUpdateChange}
          closeUpdateModal={closeUpdateModal}
          saveChanges={saveProfileChanges}
        />
      )}
      {showSpecModal && updateDoctor && (
        <UpdateDoctorModal
          isOpen={showSpecModal}
          doctor={updateDoctor}
          handleChange={handleSpecChange}
          closeUpdateModal={closeSpecModal}
          saveChanges={saveSpecChanges}
        />
      )}
      <Footer />
    </div>
  );
};

export default Profile;
