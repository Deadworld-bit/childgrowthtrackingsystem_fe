"use client";

import { NextPage } from "next";
import { useState, useEffect } from "react";
import userApi, { User, Membership } from "@/app/api/user";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Cookies from "js-cookie";
import Link from "next/link";
import ProfileCard from "./components/ProfileCard";
import DoctorSpecialization from "./components/DoctorSpecialization";
import MembershipDetails from "./components/MembershipDetails";
import UpdateProfileModal from "./modals/updateProfileModal";
import UpdateDoctorModal from "./modals/updateSpecModal";

const Profile: NextPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [profileUpdateData, setProfileUpdateData] = useState<{
        id: bigint;
        username: string;
        email: string;
        password: string;
    } | null>(null);
    const [showSpecModal, setShowSpecModal] = useState(false);
    const [doctorUpdateData, setDoctorUpdateData] = useState<{
        id: bigint;
        specialization: string;
        certificate: string;
    } | null>(null);
    const [membership, setMembership] = useState<Membership | null>(null);

    // Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            const userCookie = Cookies.get("user");
            if (!userCookie) {
                setLoading(false);
                return;
            }
            try {
                const parsedUser = JSON.parse(userCookie);
                const userId = BigInt(parsedUser.id);
                const response = await userApi.getUserById(userId);
                if (response.status === "ok") {
                    let userData = response.data;
                    if (userData.role === "DOCTOR") {
                        const doctorResponse = await userApi.getDoctorById(
                            userId
                        );
                        if (doctorResponse.status === "ok") {
                            userData = { ...userData, ...doctorResponse.data };
                        }
                    }
                    setUser(userData);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Failed to load user data.");
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // Fetch Membership Data for Members
    useEffect(() => {
        if (user?.role === "MEMBER") {
            const fetchMembership = async () => {
                try {
                    const res = await userApi.getMembershipByUserId(user.id);
                    if (res.status === "ok" || res.status === "success") {
                        setMembership(res.data);
                    }
                } catch (err) {
                    console.error("Error fetching membership:", err);
                }
            };
            fetchMembership();
        }
    }, [user]);

    // Profile Update Handlers
    const openUpdateModal = () => {
        if (user) {
            setProfileUpdateData({
                id: user.id,
                username: user.username,
                email: user.email,
                password: "",
            });
            setShowUpdateModal(true);
        }
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (profileUpdateData) {
            setProfileUpdateData({
                ...profileUpdateData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const saveProfileChanges = async () => {
        if (profileUpdateData) {
            try {
                const updateResponse = await userApi.updateUserProfile(
                    profileUpdateData.id,
                    profileUpdateData
                );
                if (updateResponse.status === "ok") {
                    setUser({ ...user!, ...updateResponse.data });
                    setShowUpdateModal(false);
                }
            } catch (err) {
                console.error("Error updating profile:", err);
            }
        }
    };

    // Doctor Specialization Handlers
    const openSpecModal = async () => {
        if (user?.role === "DOCTOR") {
            try {
                const doctorResponse = await userApi.getDoctorById(user.id);
                if (doctorResponse.status === "ok") {
                    const { doctorId, specialization, certificate } =
                        doctorResponse.data;
                    setDoctorUpdateData({
                        id: doctorId,
                        specialization: specialization || "",
                        certificate: certificate || "",
                    });
                    setShowSpecModal(true);
                }
            } catch (err) {
                console.error("Error fetching doctor data:", err);
            }
        }
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (doctorUpdateData) {
            setDoctorUpdateData({
                ...doctorUpdateData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const saveSpecChanges = async () => {
        if (doctorUpdateData) {
            try {
                const specResponse = await userApi.updateSpec(
                    doctorUpdateData.id,
                    doctorUpdateData
                );
                if (specResponse.status === "ok") {
                    setUser({ ...user!, ...specResponse.data });
                    setShowSpecModal(false);
                }
            } catch (err) {
                console.error("Error updating specialization:", err);
            }
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
                <h1 className="text-3xl font-bold">Loading...</h1>
            </div>
        );
    }

    // Error or No User State
    if (!user || error) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
                <h1 className="text-3xl font-bold mb-4">
                    {error ? "Error" : "Access Denied"}
                </h1>
                <p className="text-lg">
                    {error || "You've not signed in to view your profile."}
                </p>
                {!error && (
                    <Link
                        href="/"
                        className="mt-4 text-blue-400 hover:underline"
                    >
                        Return Home
                    </Link>
                )}
            </div>
        );
    }

    // Main Render
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
            <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                    {/* Profile Card */}
                    <ProfileCard
                        user={user} // Pass user as-is, let ProfileCard handle date formatting
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        openUpdateModal={openUpdateModal}
                    />

                    {/* Sidebar Cards */}
                    <div className="flex flex-col gap-8 w-full lg:w-[800px]">
                        {user.role === "DOCTOR" && (
                            <DoctorSpecialization
                                user={user}
                                openSpecModal={openSpecModal}
                            />
                        )}
                        {user.role === "MEMBER" && membership && (
                            <MembershipDetails membership={membership} />
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            {showUpdateModal && profileUpdateData && (
                <UpdateProfileModal
                    isOpen={showUpdateModal}
                    user={profileUpdateData}
                    handleChange={handleUpdateChange}
                    closeUpdateModal={() => setShowUpdateModal(false)}
                    saveChanges={saveProfileChanges}
                />
            )}
            {showSpecModal && doctorUpdateData && (
                <UpdateDoctorModal
                    isOpen={showSpecModal}
                    doctor={doctorUpdateData}
                    handleChange={handleSpecChange}
                    closeUpdateModal={() => setShowSpecModal(false)}
                    saveChanges={saveSpecChanges}
                />
            )}

            <Footer />
        </div>
    );
};

export default Profile;
