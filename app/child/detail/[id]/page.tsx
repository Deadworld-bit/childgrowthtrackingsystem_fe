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
import { FaTrash } from "react-icons/fa";

export default function ChildDetailPage() {
    const params = useParams();
    const { id } = params;
    const [childDetail, setChildDetail] = useState<Child | null>(null);
    const [entries, setEntries] = useState<Metric[]>([]);
    const [activeTab, setActiveTab] = useState("bmi");
    const [selectedYear, setSelectedYear] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingMetric, setDeletingMetric] = useState<Metric | null>(null);

    // New state variables for form inputs
    const [newWeight, setNewWeight] = useState("");
    const [newHeight, setNewHeight] = useState("");
    const [newRecordedDate, setNewRecordedDate] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // For success notifications

    // State for posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Dr. John Doe",
            role: "Doctor",
            content:
                "Ensure your child gets enough sleep and eats a balanced diet.",
            createdAt: new Date().toISOString(),
        },
        {
            id: 2,
            author: "Jane Smith",
            role: "Parent",
            content:
                "Using this app has helped me monitor my child's progress easily.",
            createdAt: new Date().toISOString(),
        },
    ]);
    const [newPostContent, setNewPostContent] = useState("");
    const [selectedYearPost, setSelectedYearPost] = useState("");

    const handleCreatePost = () => {
        if (!newPostContent.trim()) {
            alert("Please write something before posting.");
            return;
        }
        const newPost = {
            id: posts.length + 1,
            author: "Current User", // Replace with logged-in user's name
            role: "Parent", // Replace with logged-in user's role
            content: newPostContent,
            createdAt: new Date().toISOString(),
        };
        setPosts([newPost, ...posts]);
        setNewPostContent("");
    };

    useEffect(() => {
        if (id && typeof id === "string") {
            fetchChildDetails(id);
            fetchChildMetrics(id);
        }
    }, [id]);

    const fetchChildDetails = async (childId: string) => {
        try {
            const childData = await childApi.getChildById(BigInt(childId));
            setChildDetail(childData);
        } catch (error) {
            console.error("Error fetching child details:", error);
        }
    };

    const fetchChildMetrics = async (childId: string) => {
        try {
            const metrics = await metricApi.getMetricsByChildId(
                BigInt(childId)
            );
            const parsedMetrics = metrics.map((metric) => ({
                ...metric,
                recordedDate: new Date(metric.recordedDate),
            }));
            setEntries(parsedMetrics);
            if (parsedMetrics.length > 0) {
                const years = [
                    ...new Set(
                        parsedMetrics.map((entry) =>
                            entry.recordedDate.getFullYear().toString()
                        )
                    ),
                ];
                setSelectedYear(years[0]);
            }
        } catch (error) {
            console.error("Error fetching child metrics:", error);
        }
    };

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
                await metricApi.deleteMetric(deletingMetric.id);
                setEntries(
                    entries.filter((entry) => entry.id !== deletingMetric.id)
                );
                closeDeleteModal();
            } catch (error) {
                console.error("Error deleting metric:", error);
            }
        }
    };

    // Updated function to handle creating a metric and display a success message
    const handleAddEntry = async () => {
        if (!newWeight || !newHeight || !newRecordedDate) {
            alert("Please fill in all fields");
            return;
        }
        try {
            const metricData = {
                weight: parseFloat(newWeight),
                height: parseFloat(newHeight),
                recordedDate: new Date(newRecordedDate),
                // Convert child ID from string to BigInt to match API expectations
                childId: typeof id === "string" ? id : "",
            };
            const createdMetric = await metricApi.createMetric(metricData);
            // Convert the returned recordedDate to a Date object
            createdMetric.recordedDate = new Date(createdMetric.recordedDate);
            setEntries([...entries, createdMetric]);
            setSuccessMessage("Metric added successfully!");
            setNewWeight("");
            setNewHeight("");
            setNewRecordedDate("");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error creating metric:", error);
        }
    };

    const filteredEntries = entries.filter((entry) =>
        entry.recordedDate.toISOString().startsWith(selectedYear)
    );

    const getBmiClass = (bmi: number) => {
        if (bmi < 18.5) return "bg-blue-500";
        if (bmi >= 18.5 && bmi <= 24.9) return "bg-green-500";
        if (bmi >= 25 && bmi <= 29.9) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white p-5">
                <h1 className="text-2xl font-bold">
                    {childDetail ? childDetail.name : "Loading..."}
                </h1>
                <p className="mt-2">Gender: {childDetail?.gender || "N/A"}</p>
                <p className="mt-2">
                    Date of Birth:{" "}
                    {childDetail?.dob
                        ? new Date(childDetail.dob).toLocaleDateString()
                        : "N/A"}
                </p>
                <div className="mt-5 flex gap-4">
                    <input
                        type="number"
                        className="p-2 rounded bg-gray-800"
                        placeholder="Height (cm)"
                        value={newHeight}
                        onChange={(e) => setNewHeight(e.target.value)}
                    />
                    <input
                        type="number"
                        className="p-2 rounded bg-gray-800"
                        placeholder="Weight (kg)"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                    />
                    <input
                        type="date"
                        className="p-2 rounded bg-gray-800"
                        placeholder="Date"
                        value={newRecordedDate}
                        onChange={(e) => setNewRecordedDate(e.target.value)}
                    />
                    <button
                        onClick={handleAddEntry}
                        className="p-2 bg-blue-500 rounded"
                    >
                        Add Entry
                    </button>
                </div>
                {successMessage && (
                    <div className="mt-2 text-green-500">{successMessage}</div>
                )}
                <div className="mt-8 bg-gray-800 p-5 rounded h-72 relative">
                    <div className="flex gap-3 mb-3">
                        {["weight", "height", "bmi"].map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`p-2 rounded ${
                                    activeTab === key
                                        ? "bg-blue-500"
                                        : "bg-gray-700"
                                }`}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
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
                    <div className="absolute top-[-2.5rem] right-2">
                        <select
                            className="p-2 bg-gray-700 rounded"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
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
                <table className="mt-10 w-full text-left border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
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
                                    <button
                                        onClick={() => openDeleteModal(entry)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                {/* Posts Section */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Community Feed</h2>

                    {/* Filter by Year */}
                    <div className="flex justify-end mb-4">
                        <select
                            className="p-2 bg-gray-700 rounded text-white"
                            value={selectedYear}
                            onChange={(e) => setSelectedYearPost(e.target.value)}
                        >
                            <option value="">All Years</option>
                            {[
                                ...new Set(
                                    posts.map((post) =>
                                        new Date(post.createdAt).getFullYear()
                                    )
                                ),
                            ].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Create New Post */}
                    <div className="bg-gray-800 p-4 rounded mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                U
                            </div>
                            <textarea
                                placeholder="What's on your mind?"
                                className="flex-1 p-2 rounded bg-gray-700 text-white resize-none"
                                value={newPostContent}
                                onChange={(e) =>
                                    setNewPostContent(e.target.value)
                                }
                            ></textarea>
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleCreatePost}
                                className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts
                            .filter((post) =>
                                selectedYearPost
                                    ? new Date(post.createdAt)
                                          .getFullYear()
                                          .toString() === selectedYearPost
                                    : true
                            )
                            .map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-gray-800 p-5 rounded shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {post.author}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {post.role}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        {post.content}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
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
