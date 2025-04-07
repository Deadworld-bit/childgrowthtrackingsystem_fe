"use client";

import { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";
import {
    FaUserMd,
    FaUsers,
    FaChild,
    FaCrown,
    FaChartLine,
} from "react-icons/fa";
import userApi from "@/app/api/user";
import childApi from "@/app/api/child";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

export default function OverviewPage() {
    const [data, setData] = useState({
        activeDoctors: 0,
        activeMembers: 0,
        premiumMembers: 0,
        basicMembers: 0,
        vipMembers: 0,
        activeChildren: 0,
    });
    const [userGrowthData, setUserGrowthData] = useState<
        { year: string; month: string; users: number }[]
    >([]);
    const [selectedYear, setSelectedYear] = useState("");
    const COLORS = ["#5A61F0", "#5AD09D"]; 
    const membershipData = [
        { name: "Premium", value: data.premiumMembers },
        { name: "Basic", value: data.basicMembers },
        { name: "VIP", value: data.vipMembers },
    ];
    const userData = [
        { name: "Doctors", value: data.activeDoctors },
        { name: "Members", value: data.activeMembers },
    ];
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    // Fetch user's data from cookies
    useEffect(() => {
        const fetchUserRole = async () => {
            const userCookie = Cookies.get("user");
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    const userId = BigInt(parsedUser.id);
                    const response = await userApi.getUserById(userId);
                    if (
                        response.status === "ok" ||
                        response.status === "success"
                    ) {
                        setUserRole(response.data.role);
                    } else {
                        console.error(
                            "Error fetching user role:",
                            response.message
                        );
                    }
                } catch (err) {
                    console.error("Error fetching user role from API:", err);
                }
            }
            setIsRoleLoading(false);
        };
        fetchUserRole();
    }, []);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    doctorRes,
                    memberRes,
                    basicRes,
                    premiumRes,
                    vipRes,
                    childrenRes,
                ] = await Promise.all([
                    userApi.countDoctors(),
                    userApi.countMembers(),
                    userApi.countBasicMembers(),
                    userApi.countPremiumMembers(),
                    userApi.countVIPMembers(),
                    childApi.countChildren(),
                ]);
    
                const members = await userApi.getMembers();
                const doctors = await userApi.getDoctors();
                const allUsers = [...members.data, ...doctors.data];
                const groupedByMonth = allUsers.reduce(
                    (acc: Record<string, number>, user) => {
                        const createdDate = new Date(user.createdDate);
                        const year = createdDate.getFullYear();
                        const month = createdDate.toLocaleString("default", {
                            month: "short",
                        });
    
                        const key = `${year}-${month}`;
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                    },
                    {}
                );
    
                const growthData = Object.entries(groupedByMonth).map(
                    ([key, value]) => {
                        const [year, month] = key.split("-");
                        return { year, month, users: value };
                    }
                );
    
                setUserGrowthData(growthData);
    
                setData({
                    activeDoctors: doctorRes.data,
                    activeMembers: memberRes.data,
                    premiumMembers: premiumRes.data,
                    basicMembers: basicRes.data,
                    vipMembers: vipRes.data,
                    activeChildren: childrenRes.data,
                });
            } catch (error) {
                console.error("Error fetching overview data:", error);
            }
        };
    
        fetchData();
    }, []);
    

    // Filter user growth data by selected year
    const filteredGrowthData = userGrowthData.filter(
        (data) => !selectedYear || data.year === selectedYear
    );

    const availableYears = [
        ...new Set(userGrowthData.map((data) => data.year)),
    ];

    if (isRoleLoading) {
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    if (userRole !== "ADMIN" && userRole !== "MEMBER") {
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg">
                    You&apos;re not allowed to use this function.
                </p>
                <Link
                    className="text-sm text-blue-400 hover:underline block text-right mt-1"
                    href="./"
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
                backgroundColor: "#2C2C2C", // Lighter background
                backgroundImage: "url('/parttern02.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                // Removed the overlay to let the image be more visible
            }}
        >
            <Navbar />
            <main className="flex-grow px-4 md:px-8 lg:px-16 py-6">
                {/* Page Header */}
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
                        System Overview
                    </h1>
                    <p className="text-gray-200 text-lg">
                        Get a glance at the view of key system metrics.
                    </p>
                </header>

                {/* Metrics Summary */}
                <div className="mb-8 bg-[#303030] rounded-lg p-6 shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-100">
                        Key Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <FaUserMd className="text-4xl text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Active Doctors
                                    </h3>
                                    <p className="text-3xl font-bold mt-2 text-white">
                                        {data.activeDoctors}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <FaUsers className="text-4xl text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Active Members
                                    </h3>
                                    <p className="text-3xl font-bold mt-2 text-white">
                                        {data.activeMembers}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <FaCrown className="text-4xl text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Premium Members
                                    </h3>
                                    <p className="text-3xl font-bold mt-2 text-white">
                                        {data.vipMembers}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <FaCrown className="text-4xl text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Premium Members
                                    </h3>
                                    <p className="text-3xl font-bold mt-2 text-white">
                                        {data.premiumMembers}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <FaUsers className="text-4xl text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Basic Members
                                    </h3>
                                    <p className="text-3xl font-bold mt-2 text-white">
                                        {data.basicMembers}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <FaChild className="text-4xl text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Active Children
                                    </h3>
                                    <p className="text-3xl font-bold mt-2 text-white">
                                        {data.activeChildren}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#303030] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4 text-gray-100">
                            Membership Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={membershipData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {membershipData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart (User Distribution) */}
                    <div className="bg-[#303030] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4 text-gray-100">
                            User Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#444"
                                />
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#333",
                                        color: "#fff",
                                    }}
                                />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-[#303030] p-6 rounded-lg shadow-md mt-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-100">
                            User Growth Over Time
                        </h2>
                        <select
                            className="p-2 bg-gray-700 rounded text-white"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">All Years</option>
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredGrowthData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#444"
                            />
                            <XAxis dataKey="month" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#333",
                                    color: "#fff",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#5A61F0" // Lighter purple stroke
                                strokeWidth={2}
                                dot={{ fill: "#5A61F0" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </main>
            <Footer />
        </div>
    );
}
