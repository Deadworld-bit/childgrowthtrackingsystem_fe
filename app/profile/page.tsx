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
import userApi, { User, Membership } from "@/app/api/user";
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
    const [membership, setMembership] = useState<Membership | null>(null);

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
                                const doctorResponse =
                                    await userApi.getDoctorById(userId);
                                if (doctorResponse.status === "ok") {
                                    const doctorData = doctorResponse.data;
                                    const updatedUserData = {
                                        ...userData,
                                        specialization:
                                            doctorData.specialization,
                                        certificate: doctorData.certificate,
                                    };
                                    setUser(updatedUserData);
                                } else {
                                    console.error(
                                        "Error fetching doctor data:",
                                        doctorResponse.message
                                    );
                                    setUser(userData);
                                }
                            } catch (error) {
                                console.error(
                                    "Error fetching doctor data:",
                                    error
                                );
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

    useEffect(() => {
        if (user?.role === "MEMBER") {
            (async () => {
                try {
                    const res = await userApi.getMembershipByUserId(user.id);
                    if (res.status === "ok" || res.status === "success") {
                        setMembership(res.data);
                    } else {
                        console.error("Membership error:", res.message);
                    }
                } catch (err) {
                    console.error("Error fetching membership:", err);
                }
            })();
        }
    }, [user]);

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
                    console.error(
                        "Error fetching doctor data:",
                        doctorResponse.message
                    );
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
                const updateResponse = await userApi.updateUserProfile(
                    updateUser.id,
                    updateUser
                );
                if (updateResponse.status === "ok") {
                    setUser({ ...user!, ...updateResponse.data });
                    closeUpdateModal();
                } else {
                    console.error(
                        "Error updating profile:",
                        updateResponse.message
                    );
                }
            } catch (err) {
                console.error("Error updating user:", err);
            }
        }
    };

    const saveSpecChanges = async () => {
        if (updateDoctor) {
            try {
                const specResponse = await userApi.updateSpec(
                    updateDoctor.id,
                    updateDoctor
                );
                if (specResponse.status === "ok") {
                    setUser({
                        ...user!,
                        specialization: specResponse.data.specialization,
                        certificate: specResponse.data.certificate,
                    });
                    closeSpecModal();
                } else {
                    console.error(
                        "Error updating doctor specialization:",
                        specResponse.message
                    );
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
                <Link
                    href="./"
                    className="mt-2 text-sm text-blue-400 hover:underline"
                >
                    Return Home
                </Link>
            </div>
        );
    }

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
            <main className="max-w-7xl mx-auto px-6 py-10 flex-1">
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                    {/* Profile Card */}
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden w-full lg:w-[800px] flex flex-col h-[750px]">
                        <div className="relative">
                            <img
                                src="/parttern01.jpg"
                                alt="Cover"
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                                <img
                                    src="/neutral.png"
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover"
                                />
                            </div>
                        </div>
                        <div className="mt-16 px-8 py-6 flex-1 flex flex-col">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-white">
                                    {user.username}
                                </h2>
                                <p className="mt-2 text-gray-300 flex items-center justify-center gap-2">
                                    <FaEnvelope /> {user.email}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                {[
                                    {
                                        icon: <FaUserShield />,
                                        label: "Role",
                                        value: user.role,
                                    },
                                    {
                                        icon: <FaCalendarAlt />,
                                        label: "Joined",
                                        value: new Date(
                                            user.createdDate
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }),
                                    },
                                    {
                                        icon: <FaLock />,
                                        label: "Password",
                                        value: showPassword
                                            ? user.password
                                            : "************",
                                        action: () =>
                                            setShowPassword(!showPassword),
                                        actionIcon: showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        ),
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-4 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    {item.label}
                                                </p>
                                                <p className="text-lg font-medium text-white">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                        {item.action && (
                                            <button
                                                onClick={item.action}
                                                className="text-gray-300 hover:text-white"
                                            >
                                                {item.actionIcon}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={openUpdateModal}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Cards */}
                    <div className="flex flex-col gap-8 w-full lg:w-[800px]">
                        {user.role === "DOCTOR" && (
                            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[750px]">
                                <div className="p-8 flex flex-col h-full">
                                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                                        Specialization
                                    </h3>
                                    <p className="text-gray-200 mb-6 text-center">
                                        {user.specialization}
                                    </p>
                                    <h3 className="text-2xl font-bold text-white mb-4 text-center">
                                        Certificate
                                    </h3>
                                    <img
                                        src={user.certificate}
                                        alt="Certificate"
                                        className="w-full h-auto rounded-lg mb-6"
                                    />
                                    <div className="mt-auto flex justify-center">
                                        <button
                                            onClick={openSpecModal}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition"
                                        >
                                            Update Specialization
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.role === "MEMBER" && membership && (
                            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[750px]">
                                <div className="p-8 flex flex-col h-full">
                                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                                        Membership Details
                                    </h3>
                                    <ul className="space-y-4 flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                            {[
                                                {
                                                    icon: (
                                                        <FaCrown className="text-yellow-400 text-xl" />
                                                    ),
                                                    text: membership.planname,
                                                },
                                                {
                                                    icon: (
                                                        <FaUserShield className="text-blue-400 text-xl" />
                                                    ),
                                                    text: `Max Children: ${membership.maxChildren}`,
                                                },
                                                {
                                                    icon: (
                                                        <FaCalendarAlt className="text-green-400 text-xl" />
                                                    ),
                                                    text: `Duration: ${membership.duration} days`,
                                                },
                                                {
                                                    icon: (
                                                        <FaCalendarAlt className="text-pink-400 text-xl" />
                                                    ),
                                                    text: `Start: ${new Date(
                                                        membership.startDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}`,
                                                },
                                                {
                                                    icon: (
                                                        <FaCalendarAlt className="text-red-400 text-xl" />
                                                    ),
                                                    text: `End: ${new Date(
                                                        membership.endDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}`,
                                                },
                                            ].map(({ icon, text }, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-4 rounded-xl"
                                                >
                                                    {icon}
                                                    <span>{text}</span>
                                                </li>
                                            ))}
                                            <li>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                        membership.status
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {membership.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showUpdateModal && updateUser && (
                <UpdateProfileModal
                    isOpen={showUpdateModal}
                    user={updateUser}
                    handleChange={handleUpdateChange}
                    closeUpdateModal={() => setShowUpdateModal(false)}
                    saveChanges={saveProfileChanges}
                />
            )}
            {showSpecModal && updateDoctor && (
                <UpdateDoctorModal
                    isOpen={showSpecModal}
                    doctor={updateDoctor}
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
