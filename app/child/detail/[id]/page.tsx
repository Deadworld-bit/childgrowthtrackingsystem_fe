"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import childApi, { Child } from "@/app/api/child";
import metricApi, { Metric } from "@/app/api/metric";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import DeleteMetricModal from "@/app/child/modals/deleteMetricModal";
import {
    FaCalendarAlt,
    FaChartLine,
    FaHeartbeat,
    FaRulerVertical,
    FaTrash,
    FaWeight,
} from "react-icons/fa";
import postApi, { Post } from "@/app/api/post";
import userApi, { User } from "@/app/api/user";
import Cookies from "js-cookie";
import { METRIC as standardMetrics } from "@/constants/data";

export default function ChildDetailPage() {
    const params = useParams();
    const { id } = params;
    const [childDetail, setChildDetail] = useState<Child | null>(null);
    const [entries, setEntries] = useState<Metric[]>([]);
    const [activeTab, setActiveTab] = useState("bmi");
    const [selectedYear, setSelectedYear] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingMetric, setDeletingMetric] = useState<Metric | null>(null);

    // Form states for adding metric
    const [newWeight, setNewWeight] = useState("");
    const [newHeight, setNewHeight] = useState("");
    const [newRecordedDate, setNewRecordedDate] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage1, setSuccessMessage1] = useState<string | null>(null);
    const [errorMessage1, setErrorMessage1] = useState<string | null>(null);

    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [selectedYearPost, setSelectedYearPost] = useState("");

    // State for standard chart age selection
    const [selectedStandardAge, setSelectedStandardAge] = useState("0");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            const userCookie = Cookies.get("user");
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    const userId = BigInt(parsedUser.id);
                    const response = await userApi.getUserById(userId);
                    if (response.status === "ok") {
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
        if (id && typeof id === "string") {
            fetchChildDetails(id);
            fetchChildMetrics(id);
            fetchChildPosts(id);
        }
        fetchUserRole();
    }, [id]);

    const fetchChildDetails = async (childId: string) => {
        try {
            const response = await childApi.getChildById(BigInt(childId));
            if (response.status === "ok") {
                setChildDetail(response.data);
            } else {
                console.error("Error fetching child detail:", response.message);
            }
        } catch (error) {
            console.error("Error fetching child details:", error);
        }
    };

    const fetchChildMetrics = async (childId: string) => {
        try {
            const response = await metricApi.getMetricsByChildId(BigInt(childId));
            if (response.status === "ok") {
                const parsedMetrics = response.data.map((metric) => {
                    const parsedDate = new Date(metric.recordedDate);
                    if (!isValidDate(parsedDate)) {
                        console.error("Invalid date from API:", metric.recordedDate);
                    }
                    return {
                        ...metric,
                        recordedDate: parsedDate,
                    };
                });
    
                // Sort parsedMetrics by recordedDate in ascending order
                parsedMetrics.sort((a, b) => {
                    return a.recordedDate.getTime() - b.recordedDate.getTime();
                });
    
                setEntries(parsedMetrics);
                if (parsedMetrics.length > 0) {
                    const years = [
                        ...new Set(
                            parsedMetrics
                                .filter((entry) => isValidDate(entry.recordedDate))
                                .map((entry) =>
                                    entry.recordedDate.getFullYear().toString()
                                )
                        ),
                    ];
                    setSelectedYear(years[0] || ""); // Default to empty string if no valid years
                }
            } else {
                setErrorMessage(response.message);
                setTimeout(() => setErrorMessage(null), 3000);
            }
        } catch (error) {
            console.error("Error fetching child metrics:", error);
        }
    };

    const fetchChildPosts = async (childId: string) => {
        try {
            const response = await postApi.getAllPostByChildId(BigInt(childId));
            if (response.status === "ok" || response.status === "success") {
                const parsedPosts = response.data.map((post) => ({
                    ...post,
                    createdDate: new Date(post.createdDate),
                }));
                setPosts(parsedPosts);
            } else {
                setErrorMessage1(response.message);
                setTimeout(() => setErrorMessage1(null), 3000);
            }
        } catch (error) {
            console.error("Error fetching posts for child:", error);
        }
    };

    const isValidDate = (date: unknown): boolean => {
        return date instanceof Date && !isNaN(date.getTime());
    };

    const filteredEntries = entries.filter((entry) => {
        if (!isValidDate(entry.recordedDate)) {
            console.warn("Invalid recordedDate found:", entry);
            return false; // Skip invalid entries
        }
        return entry.recordedDate.toISOString().startsWith(selectedYear);
    });

    // Filter standard metrics based on selected age
    const filteredStandardMetrics = standardMetrics.filter(
        (metric) => metric.age === Number(selectedStandardAge)
    );

    const getBmiClass = (bmi: number) => {
        if (bmi < 18.5) return "bg-blue-500";
        if (bmi >= 18.5 && bmi <= 24.9) return "bg-green-500";
        if (bmi >= 25 && bmi <= 29.9) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getBmiStatus = (bmi: number) => {
        if (bmi < 18.5) return "Underweight";
        if (bmi >= 18.5 && bmi <= 24.9) return "Normal Weight";
        if (bmi >= 25 && bmi <= 29.9) return "Overweight";
        return "Obesity";
    };

    const getLatestEntry = (entries: Metric[]) => {
        if (!entries || entries.length === 0) return null;
        return entries.reduce((latest, current) =>
            new Date(current.recordedDate) > new Date(latest.recordedDate)
                ? current
                : latest
        );
    };

    //Add Metric
    const handleAddEntry = async () => {
        if (!newWeight || !newHeight || !newRecordedDate) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const recordedDate = new Date(newRecordedDate);
        if (isNaN(recordedDate.getTime())) {
            setErrorMessage("Invalid recorded date.");
            return;
        }

        if (childDetail?.dob) {
            const dobDate = new Date(childDetail.dob);
            if (isNaN(dobDate.getTime())) {
                setErrorMessage("Invalid date of birth.");
                return;
            }
            if (recordedDate < dobDate) {
                setErrorMessage(
                    "The recorded date cannot be earlier than the child's date of birth."
                );
                return;
            }
        }

        if (!id || isNaN(Number(id))) {
            setErrorMessage("Invalid child ID.");
            return;
        }
        const childId = Number(id);

        try {
            const metricData = {
                weight: parseFloat(newWeight),
                height: parseFloat(newHeight),
                recordedDate: recordedDate.toISOString(),
                childId: childId,
            };

            const response = await metricApi.createMetric(metricData);
            if (response.status === "ok" || response.status === "success") {
                const newMetric = response.data;
                newMetric.recordedDate = new Date(newMetric.recordedDate);
                const updatedEntries = [...entries, newMetric];
                setEntries(updatedEntries);

                const newYear = newMetric.recordedDate.getFullYear().toString();
                const availableYears = [
                    ...new Set(
                        updatedEntries.map((entry) =>
                            entry.recordedDate.getFullYear().toString()
                        )
                    ),
                ];
                if (!availableYears.includes(selectedYear) || !selectedYear) {
                    setSelectedYear(newYear);
                }

                setSuccessMessage("Metric added successfully!");
                setErrorMessage("");
                setNewWeight("");
                setNewHeight("");
                setNewRecordedDate("");
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setErrorMessage(response.message || "Failed to add metric.");
                setTimeout(() => setErrorMessage(null), 3000);
            }
        } catch (error) {
            console.error("Error creating metric:", error);
            setErrorMessage("An error occurred while adding the entry.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    //Delete Metric
    const openDeleteModal = (metric: Metric) => {
        setDeletingMetric(metric);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingMetric(null);
    };

    const handleDelete = async () => {
        if (deletingMetric) {
            try {
                const response = await metricApi.deleteMetric(
                    deletingMetric.id
                );
                if (response.status === "ok" || response.status === "success") {
                    setEntries(
                        entries.filter(
                            (entry) => entry.id !== deletingMetric.id
                        )
                    );
                    setSuccessMessage("User updated successfully!");
                    closeDeleteModal();
                    setTimeout(() => setSuccessMessage(null), 3000);
                } else {
                    setErrorMessage(response.message);
                    closeDeleteModal();
                    setTimeout(() => setErrorMessage(null), 3000);
                }
            } catch (error) {
                console.error("Error deleting metric:", error);
            }
        }
    };

    // Create Post
    const handleCreatePost = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            alert("Please provide both a title and content for the post.");
            return;
        }
        try {
            const userCookie = Cookies.get("user");
            if (!userCookie) {
                alert("User not logged in. Please log in to create a post.");
                return;
            }
            const userData = JSON.parse(userCookie);
            const userId = userData.id;
            const newPost = {
                childId: Number(BigInt(typeof id === "string" ? id : "0")),
                userId: Number(userId),
                title: newPostTitle,
                description: newPostContent,
            };
            const response = await postApi.createPost(newPost);
            if (response.status === "ok" || response.status === "success") {
                response.data.createdDate = new Date(response.data.createdDate);
                setPosts([response.data, ...posts]);
                setNewPostTitle("");
                setNewPostContent("");
                setSuccessMessage1("User updated successfully!");
                setTimeout(() => setSuccessMessage1(null), 3000);
            } else {
                setErrorMessage1(response.message);
                setTimeout(() => setErrorMessage1(null), 3000);
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    // Delete Post
    const handleDeletePost = async (postId: bigint) => {
        try {
            const response = await postApi.deletePost(postId);
            if (response.status === "ok" || response.status === "success") {
                setPosts(posts.filter((post) => post.id !== postId));
                setSuccessMessage1("User updated successfully!");
                setTimeout(() => setSuccessMessage1(null), 3000);
            } else {
                setErrorMessage1(response.message);
                setTimeout(() => setErrorMessage1(null), 3000);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

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
            <main className="flex-1 text-white p-6">
                <div className="mb-8 p-6 bg-gray-800 border-indigo-600 rounded-lg shadow-md ">
                    <h1 className="text-3xl font-bold">
                        {childDetail ? childDetail.name : "Loading..."}
                    </h1>
                    <p className="mt-2">
                        <span className="font-medium">Gender:</span>{" "}
                        {childDetail?.gender || "N/A"}
                    </p>
                    <p className="mt-2">
                        <span className="font-medium">Date of Birth:</span>{" "}
                        {childDetail?.dob
                            ? new Date(childDetail.dob).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>

                {/* Add Metric Form */}
                {userRole !== "ADMIN" && userRole !== "DOCTOR" && (
                    <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Add New Entry
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="number"
                                className="p-3 rounded bg-gray-700 focus:outline-none"
                                placeholder="Height (cm)"
                                value={newHeight}
                                onChange={(e) => setNewHeight(e.target.value)}
                            />
                            <input
                                type="number"
                                className="p-3 rounded bg-gray-700 focus:outline-none"
                                placeholder="Weight (kg)"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                            />
                            <input
                                type="date"
                                className="p-3 rounded bg-gray-700 focus:outline-none"
                                value={newRecordedDate}
                                onChange={(e) =>
                                    setNewRecordedDate(e.target.value)
                                }
                            />
                            <button
                                onClick={handleAddEntry}
                                className="p-3 bg-blue-500 rounded hover:bg-blue-600 transition"
                            >
                                Add Entry
                            </button>
                        </div>
                        {successMessage && (
                            <p className="mt-4 text-green-400">
                                {successMessage}
                            </p>
                        )}
                        {errorMessage && (
                            <p className="mt-4 text-red-400">{errorMessage}</p>
                        )}
                    </div>
                )}

                {/* Child Data Chart */}
                <div className="mb-8 p-6 bg-gray-800 border-indigo-600 rounded-lg shadow-md relative">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            Child Growth Chart
                        </h2>
                        <div>
                            <select
                                className="p-2 bg-gray-700 rounded"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                            >
                                {[
                                    ...new Set(
                                        entries.map((entry) =>
                                            entry.recordedDate
                                                .getFullYear()
                                                .toString()
                                        )
                                    ),
                                ].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-4">
                        {["weight", "height", "bmi"].map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`p-2 rounded transition ${
                                    activeTab === key
                                        ? "bg-blue-500"
                                        : "bg-gray-700"
                                }`}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={filteredEntries}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#444"
                            />
                            <XAxis
                                dataKey="recordedDate"
                                stroke="#fff"
                                tickFormatter={(date) =>
                                    new Date(date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }
                                tickMargin={10}
                            />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#333",
                                    color: "#fff",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={activeTab}
                                stroke="#38bdf8"
                                strokeWidth={2}
                                dot={{ fill: "#38bdf8" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Standard Data Chart */}
                <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md relative border-indigo-600">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            Standard Growth Chart
                        </h2>
                        <div>
                            <select
                                className="p-2 bg-gray-700 rounded"
                                value={selectedStandardAge}
                                onChange={(e) =>
                                    setSelectedStandardAge(e.target.value)
                                }
                            >
                                {[
                                    ...new Set(
                                        standardMetrics.map((m) =>
                                            m.age.toString()
                                        )
                                    ),
                                ].map((age) => (
                                    <option key={age} value={age}>
                                        Age {age}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={filteredStandardMetrics}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#444"
                            />
                            <XAxis
                                dataKey="month"
                                stroke="#fff"
                                tickFormatter={(month) => `M${month}`}
                                tickMargin={10}
                            />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#333",
                                    color: "#fff",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={activeTab}
                                stroke="#fbbf24"
                                strokeWidth={2}
                                dot={{ fill: "#fbbf24" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Child Current Status Section */}
                <div className="mb-8 p-6 bg-gradient-to-br bg-gray-800 rounded-2xl shadow-xl border border-indigo-600">
                    <h2 className="flex items-center text-2xl font-bold mb-6 text-indigo-200 tracking-wide">
                        <FaHeartbeat className="text-white text-3xl mr-3" />
                        Current Health Status
                    </h2>

                    {entries.length > 0 ? (
                        (() => {
                            const latest = getLatestEntry(entries);

                            return (
                                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-6">
                                    <div className="flex-1 bg-indigo-700/30 p-4 rounded-lg shadow-inner">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-200">
                                            <div className="flex flex-col items-center">
                                                <FaCalendarAlt className="mb-1 text-xl text-indigo-300" />
                                                <span className="text-xs uppercase tracking-wide">
                                                    Date
                                                </span>
                                                <span className="font-semibold">
                                                    {latest?.recordedDate
                                                        ? latest.recordedDate.toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <FaWeight className="mb-1 text-xl text-indigo-300" />
                                                <span className="text-xs uppercase tracking-wide">
                                                    Weight
                                                </span>
                                                <span className="font-semibold">
                                                    {latest?.weight
                                                        ? `${latest.weight} kg`
                                                        : "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <FaRulerVertical className="mb-1 text-xl text-indigo-300" />
                                                <span className="text-xs uppercase tracking-wide">
                                                    Height
                                                </span>
                                                <span className="font-semibold">
                                                    {latest?.height
                                                        ? `${latest.height} cm`
                                                        : "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <FaChartLine className="mb-1 text-xl text-indigo-300" />
                                                <span className="text-xs uppercase tracking-wide">
                                                    BMI
                                                </span>
                                                <span className="font-semibold">
                                                    {latest?.bmi ?? "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <span
                                            className={`
              inline-block px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg
              transform transition-transform duration-300 hover:scale-105
              ${getBmiClass(
                  latest && typeof latest.bmi === "number" ? latest.bmi : 0
              )}
            `}
                                        >
                                            {latest != null &&
                                            latest.bmi != null
                                                ? getBmiStatus(latest.bmi)
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <p className="text-gray-400 italic text-center py-4">
                            No metrics available yet. Add one to see the current
                            status!
                        </p>
                    )}
                </div>

                {/* Metrics Table */}
                <div className="mb-8 p-6 bg-gray-800 border-indigo-600 rounded-lg shadow-md overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">
                        Metrics History
                    </h2>
                    {isRoleLoading ? (
                        <p>Loading metrics...</p>
                    ) : (
                        <table className="w-full text-left border border-gray-700">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Weight (kg)</th>
                                    <th className="p-2">Height (cm)</th>
                                    <th className="p-2">BMI</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.map((entry, index) => (
                                    <tr
                                        key={index}
                                        className={`border-t border-gray-700 ${getBmiClass(
                                            entry.bmi
                                        )}`}
                                    >
                                        <td className="p-2">
                                            {entry.recordedDate.toLocaleDateString()}
                                        </td>
                                        <td className="p-2">{entry.weight}</td>
                                        <td className="p-2">{entry.height}</td>
                                        <td className="p-2">{entry.bmi}</td>
                                        <td className="p-2">
                                            {userRole !== "DOCTOR" &&
                                                userRole !== "ADMIN" && (
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                entry
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 transition"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="mt-4">
                        <p className="text-lg font-semibold">
                            <span className="bg-blue-500 p-1 rounded mr-2">
                                Underweight: BMI &lt; 18.5
                            </span>
                            <span className="bg-green-500 p-1 rounded mr-2">
                                Normal weight: BMI 18.5–24.9
                            </span>
                            <span className="bg-yellow-500 p-1 rounded mr-2">
                                Overweight: BMI 25–29.9
                            </span>
                            <span className="bg-red-500 p-1 rounded">
                                Obesity: BMI ≥ 30
                            </span>
                        </p>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="mb-8 p-6 bg-gray-800 border-indigo-600 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-blue-400">
                        Doctor-Parent Feed
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <p className="text-gray-400 text-sm">
                            Showing {posts.length} post
                            {posts.length !== 1 ? "s" : ""}
                        </p>
                        {successMessage1 && (
                            <p className="mt-4 text-green-400">
                                {successMessage1}
                            </p>
                        )}
                        {errorMessage1 && (
                            <p className="mt-4 text-red-400">{errorMessage1}</p>
                        )}
                        <select
                            className="p-2 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                            value={selectedYearPost}
                            onChange={(e) =>
                                setSelectedYearPost(e.target.value)
                            }
                        >
                            <option value="">All Years</option>
                            {[
                                ...new Set(
                                    posts.map((post) =>
                                        new Date(post.createdDate).getFullYear()
                                    )
                                ),
                            ].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto">
                        {posts
                            .filter((post) =>
                                selectedYearPost
                                    ? new Date(post.createdDate)
                                          .getFullYear()
                                          .toString() === selectedYearPost
                                    : true
                            )
                            .map((post) => {
                                const userCookie = Cookies.get("user");
                                const userData = userCookie
                                    ? JSON.parse(userCookie)
                                    : null;
                                const loggedInUserId = userData?.id;
                                return (
                                    <div
                                        key={post.id.toString()}
                                        className="bg-gray-900 p-6 rounded-lg shadow hover:shadow-xl transition relative"
                                    >
                                        {loggedInUserId === post.userId && (
                                            <button
                                                onClick={() =>
                                                    handleDeletePost(post.id)
                                                }
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                {post.title[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {post.title}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(
                                                        post.createdDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-300">
                                            {post.description}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                    {/* Create New Post */}
                    {userRole !== "ADMIN" && (
                        <div className="mt-8 p-6 bg-gray-700 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">
                                Create a New Post
                            </h3>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Post Title"
                                    className="p-3 rounded bg-gray-600 text-white border border-gray-500 focus:outline-none"
                                    value={newPostTitle}
                                    onChange={(e) =>
                                        setNewPostTitle(e.target.value)
                                    }
                                />
                                <textarea
                                    placeholder="What's on your mind?"
                                    className="p-3 rounded bg-gray-600 text-white border border-gray-500 resize-none focus:outline-none"
                                    value={newPostContent}
                                    onChange={(e) =>
                                        setNewPostContent(e.target.value)
                                    }
                                ></textarea>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleCreatePost}
                                    className="px-6 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <DeleteMetricModal
                isOpen={isDeleteModalOpen}
                metric={deletingMetric}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
            />
        </div>
    );
}
