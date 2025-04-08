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
    Legend,
} from "recharts";
import { FaUserMd, FaUsers, FaChild, FaCrown } from "react-icons/fa";
import userApi from "@/app/api/user";
import childApi from "@/app/api/child";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

// MetricCard Component
interface MetricCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

const MetricCard = ({ title, value, icon: Icon, color }: MetricCardProps) => (
    <div
        className={`bg-gradient-to-r ${color} p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300`}
    >
        <div className="flex items-center gap-4">
            <Icon className="text-4xl text-white" />
            <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-3xl font-bold mt-2 text-white">{value}</p>
            </div>
        </div>
    </div>
);

// MetricsSummary Component
interface MetricsSummaryProps {
    data: {
        activeDoctors: number;
        activeMembers: number;
        premiumMembers: number;
        basicMembers: number;
        vipMembers: number;
        activeChildren: number;
    };
}

const MetricsSummary = ({ data }: MetricsSummaryProps) => (
    <div className="mb-8 bg-[#303030] rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
                title="Active Doctors"
                value={data.activeDoctors}
                icon={FaUserMd}
                color="from-blue-400 to-blue-600"
            />
            <MetricCard
                title="Active Members"
                value={data.activeMembers}
                icon={FaUsers}
                color="from-green-400 to-green-600"
            />
            <MetricCard
                title="VIP Members"
                value={data.vipMembers}
                icon={FaCrown}
                color="from-yellow-400 to-yellow-600"
            />
            <MetricCard
                title="Premium Members"
                value={data.premiumMembers}
                icon={FaCrown}
                color="from-yellow-400 to-yellow-600"
            />
            <MetricCard
                title="Basic Members"
                value={data.basicMembers}
                icon={FaUsers}
                color="from-purple-400 to-purple-600"
            />
            <MetricCard
                title="Active Children"
                value={data.activeChildren}
                icon={FaChild}
                color="from-pink-400 to-pink-600"
            />
        </div>
    </div>
);

// MembershipPieChart Component
interface MembershipData {
    premiumMembers: number;
    basicMembers: number;
    vipMembers: number;
}

const MembershipPieChart = ({ data }: { data: MembershipData }) => {
    const membershipData = [
        { name: "Premium", value: data.premiumMembers },
        { name: "Basic", value: data.basicMembers },
        { name: "VIP", value: data.vipMembers },
    ];
    const COLORS = ["#5A61F0", "#5AD09D", "#FFD700"]; // Purple, Green, Gold

    return (
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
                        label
                    >
                        {membershipData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// UserDistributionBarChart Component
interface UserDistributionData {
    activeDoctors: number;
    activeMembers: number;
}

const UserDistributionBarChart = ({ data }: { data: UserDistributionData }) => {
    const userData = [
        { name: "Doctors", value: data.activeDoctors },
        { name: "Members", value: data.activeMembers },
    ];

    return (
        <div className="bg-[#303030] p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
                User Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
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
    );
};

// UserGrowthLineChart Component
interface UserGrowthData {
    year: string;
    month: string;
    users: number;
}

const UserGrowthLineChart = ({
    userGrowthData,
}: {
    userGrowthData: UserGrowthData[];
}) => {
    const [selectedYear, setSelectedYear] = useState("");
    const availableYears = [
        ...new Set(userGrowthData.map((data) => data.year)),
    ];
    const filteredGrowthData = userGrowthData.filter(
        (data) => !selectedYear || data.year === selectedYear
    );

    return (
        <div className="bg-[#303030] p-6 rounded-lg shadow-md mt-12 hover:shadow-xl transition-shadow duration-300">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
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
                        stroke="#5A61F0"
                        strokeWidth={2}
                        dot={{ fill: "#5A61F0" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Main OverviewPage Component
export default function OverviewPage() {
    interface DataState {
        activeDoctors: number;
        activeMembers: number;
        premiumMembers: number;
        basicMembers: number;
        vipMembers: number;
        activeChildren: number;
        userGrowthData: { year: string; month: string; users: number }[];
    }

    const [data, setData] = useState<DataState>({
        activeDoctors: 0,
        activeMembers: 0,
        premiumMembers: 0,
        basicMembers: 0,
        vipMembers: 0,
        activeChildren: 0,
        userGrowthData: [],
    });
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setIsRoleLoading(true);
                const userCookie = Cookies.get("user");
                if (userCookie) {
                    const parsedUser = JSON.parse(userCookie);
                    const userId = BigInt(parsedUser.id);
                    const response = await userApi.getUserById(userId);
                    if (
                        response.status === "ok" ||
                        response.status === "success"
                    ) {
                        const role = response.data.role;
                        setUserRole(role);
                        if (role === "ADMIN" || role === "MEMBER") {
                            setIsDataLoading(true);
                            const [
                                doctorRes,
                                memberRes,
                                basicRes,
                                premiumRes,
                                vipRes,
                                childrenRes,
                                members,
                                doctors,
                            ] = await Promise.all([
                                userApi.countDoctors(),
                                userApi.countMembers(),
                                userApi.countBasicMembers(),
                                userApi.countPremiumMembers(),
                                userApi.countVIPMembers(),
                                childApi.countChildren(),
                                userApi.getMembers(),
                                userApi.getDoctors(),
                            ]);

                            const allUsers = [...members.data, ...doctors.data];
                            const groupedByMonth = allUsers.reduce(
                                (acc: Record<string, number>, user) => {
                                    const createdDate = new Date(
                                        user.createdDate
                                    );
                                    const year = createdDate
                                        .getFullYear()
                                        .toString();
                                    const month = createdDate.toLocaleString(
                                        "default",
                                        { month: "short" }
                                    );
                                    const key = `${year}-${month}`;
                                    acc[key] = (acc[key] || 0) + 1;
                                    return acc;
                                },
                                {} as Record<string, number>
                            );

                            const growthData = Object.entries(
                                groupedByMonth
                            ).map(([key, value]) => {
                                const [year, month] = key.split("-");
                                return { year, month, users: value };
                            });

                            setData({
                                activeDoctors: doctorRes.data,
                                activeMembers: memberRes.data,
                                premiumMembers: premiumRes.data,
                                basicMembers: basicRes.data,
                                vipMembers: vipRes.data,
                                activeChildren: childrenRes.data,
                                userGrowthData: growthData,
                            });
                        }
                    } else {
                        console.error(
                            "Error fetching user role:",
                            response.message
                        );
                    }
                }
            } catch (error) {
                console.error("Error in init:", error);
            } finally {
                setIsRoleLoading(false);
                setIsDataLoading(false);
            }
        };
        init();
    }, []);

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
                    You're not allowed to use this function.
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

    if (isDataLoading) {
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Loading Data...</h1>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col min-h-screen text-white"
            style={{
                backgroundColor: "#2C2C2C",
                backgroundImage: "url('/parttern02.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <Navbar />
            <main className="flex-grow px-4 md:px-8 lg:px-16 py-6">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
                        System Overview
                    </h1>
                    <p className="text-gray-200 text-lg">
                        Get a glance at the view of key system metrics.
                    </p>
                </header>
                <MetricsSummary data={data} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <MembershipPieChart data={data} />
                    <UserDistributionBarChart data={data} />
                </div>
                <UserGrowthLineChart userGrowthData={data.userGrowthData} />
            </main>
            <Footer />
        </div>
    );
}
