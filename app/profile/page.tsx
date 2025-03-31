"use client";

import { NextPage } from "next";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaCrown,
  FaCalendarAlt,
  FaWrench,
  FaCertificate,
} from "react-icons/fa";
import userApi, { User } from "@/app/api/user";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Cookies from "js-cookie";
import Link from "next/link";

const Profile: NextPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use effect to get the user from cookie and fetch full user details.
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        const userId = BigInt(parsedUser.id);
        userApi
          .getUserById(userId)
          .then((userData) => {
            // If the user is a doctor, fetch additional doctor data
            if (userData.role === "DOCTOR") {
              userApi
                .getDoctorById(userId)
                .then((doctorData) => {
                  const updatedUser = {
                    ...userData,
                    specialization: doctorData.specialization,
                    certificate: doctorData.certificate,
                  };
                  setUser(updatedUser);
                })
                .catch((error) => {
                  console.error("Error fetching doctor data:", error);
                  setUser(userData); // fallback to userData even if doctor fetch fails
                })
                .finally(() => setLoading(false));
            } else {
              setUser(userData);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
            setLoading(false);
          });
      } catch (err) {
        console.error("Error parsing user cookie", err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // While loading, show a spinner or similar.
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  // If no user is logged in, show an access denied message.
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">
          You&apos;ve not Signed in yet to view your profile.
        </p>
        <Link
          href="./"
          className="mt-2 text-sm text-blue-400 hover:underline"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Determine doctor-specific values.
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
          {/* Cover Image */}
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

            {/* User Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Role
                    </span>
                    <span className="text-gray-800">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaCrown className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Membership
                    </span>
                    <span className="text-gray-800">
                      {user.membership}
                    </span>
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

              {/* Right Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-700" />
                  <div>
                    <span className="block text-lg font-semibold text-gray-700">
                      Email
                    </span>
                    <span className="text-gray-800">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialization & Certificate Section */}
            {isDoctor && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <FaWrench className="text-gray-700 text-2xl" />
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Specialization
                    </h3>
                  </div>
                  <p className="text-gray-700 text-center">
                    {specialization}
                  </p>
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

            {/* Update Profile Button */}
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition duration-300">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
