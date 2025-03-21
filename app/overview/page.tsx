"use client";

import Footer from "@/sections/Footer";
import Navbar from "@/sections/Navbar";
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

export default function OverviewPage() {
    const [data, setData] = useState({
        activeDoctors: 0,
        activeMembers: 0,
        premiumMembers: 0,
        basicMembers: 0,
        activeChildren: 0,
        totalPosts: 500, // Placeholder for posts
        systemUptime: "99.9%", // Placeholder for uptime
    });

    const [userGrowthData, setUserGrowthData] = useState<
        { year: string; month: string; users: number }[]
    >([]);
    const [selectedYear, setSelectedYear] = useState("");

    const COLORS = ["#8884d8", "#82ca9d"];

    const membershipData = [
        { name: "Premium Members", value: data.premiumMembers },
        { name: "Basic Members", value: data.basicMembers },
    ];

    const userData = [
        { name: "Doctors", value: data.activeDoctors },
        { name: "Members", value: data.activeMembers },
    ];

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch active doctors
                const doctors = await userApi.getDoctors();
                const activeDoctors = doctors.filter(
                    (doctor) => doctor.status
                ).length;

                // Fetch all members
                const members = await userApi.getMembers();
                const activeMembers = members.filter(
                    (member) => member.status
                ).length;

                // Count premium and basic members
                const premiumMembers = members.filter(
                    (member) => member.membership === "PREMIUM" && member.status
                ).length;
                const basicMembers = members.filter(
                    (member) => member.membership === "BASIC" && member.status
                ).length;

                // Fetch active children
                const childrenWithDoctor = await childApi.getChildHaveDoctor();
                const childrenWithoutDoctor =
                    await childApi.getChildDontHaveDoctor();
                const activeChildren =
                    childrenWithDoctor.filter((child) => child.status).length +
                    childrenWithoutDoctor.filter((child) => child.status)
                        .length;

                // Process user growth data
                const allUsers = [...doctors, ...members];
                const groupedByMonth = allUsers.reduce(
                    (acc: Record<string, number>, user) => {
                        const createdDate = new Date(user.createdDate);
                        const year = createdDate.getFullYear();
                        const month = createdDate.toLocaleString("default", {
                            month: "short",
                        });

                        const key = `${year}-${month}`;
                        if (!acc[key]) {
                            acc[key] = 0;
                        }
                        acc[key]++;
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

                // Update state
                setData({
                    activeDoctors,
                    activeMembers,
                    premiumMembers,
                    basicMembers,
                    activeChildren,
                    totalPosts: 500, // Placeholder for posts
                    systemUptime: "99.9%", // Placeholder for uptime
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

    return (
        <div
            className="flex flex-col min-h-screen text-white"
            style={{
                background: "linear-gradient(to bottom, #1e1e1e, #121212)",
                backgroundImage: "url('/parttern.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
            }}
        >
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-5">
                {/* Header Section */}
                <header className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        System Overview
                    </h1>
                </header>

                {/* Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <FaUserMd className="text-4xl text-white" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Active Doctors
                                </h2>
                                <p className="text-4xl font-bold mt-2">
                                    {data.activeDoctors}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <FaUsers className="text-4xl text-white" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Active Members
                                </h2>
                                <p className="text-4xl font-bold mt-2">
                                    {data.activeMembers}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <FaCrown className="text-4xl text-white" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Premium Members
                                </h2>
                                <p className="text-4xl font-bold mt-2">
                                    {data.premiumMembers}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <FaUsers className="text-4xl text-white" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Basic Members
                                </h2>
                                <p className="text-4xl font-bold mt-2">
                                    {data.basicMembers}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <FaChild className="text-4xl text-white" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Active Children
                                </h2>
                                <p className="text-4xl font-bold mt-2">
                                    {data.activeChildren}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-4">
                            <FaChartLine className="text-4xl text-white" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Total Posts
                                </h2>
                                <p className="text-4xl font-bold mt-2">
                                    {data.totalPosts}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Pie Chart for Membership Distribution */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4">
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

                    {/* Bar Chart for User Distribution */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4">
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
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-10 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
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
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ fill: "#8884d8" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <Footer />
        </div>
    );
}
