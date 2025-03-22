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
import postApi, { Post } from "@/app/api/post";
import Cookies from "js-cookie";

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

    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [selectedYearPost, setSelectedYearPost] = useState("");

    useEffect(() => {
        if (id && typeof id === "string") {
            fetchChildDetails(id);
            fetchChildMetrics(id);
            fetchChildPosts(id);
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

    const fetchChildPosts = async (childId: string) => {
        try {
            const postsData = await postApi.getAllPostByChildId(
                BigInt(childId)
            );
            const parsedPosts = postsData.map((post) => ({
                ...post,
                createDate: new Date(post.createdDate),
            }));
            setPosts(parsedPosts);
        } catch (error) {
            console.error("Error fetching posts for child:", error);
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

    const handleDeletePost = async (postId: BigInt) => {
        try {
            await postApi.deletePost(postId); // Call the deletePost API
            setPosts(posts.filter((post) => post.id !== postId)); // Remove the deleted post from the list
        } catch (error) {
            console.error("Error deleting post:", error);
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
                recordedDate: new Date(newRecordedDate).toISOString(),
                childId: typeof id === "string" ? Number(id) : 0,
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

    const handleCreatePost = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            alert("Please provide both a title and content for the post.");
            return;
        }

        try {
            // Retrieve user data from cookies
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

            const createdPost = await postApi.createPost(newPost);
            createdPost.createdDate = new Date(createdPost.createdDate);

            setPosts([createdPost, ...posts]);
            setNewPostTitle("");
            setNewPostContent("");
        } catch (error) {
            console.error("Error creating post:", error);
        }
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
                    <h2 className="text-2xl font-bold mb-6 text-blue-400">
                        Doctor-Parent Feed
                    </h2>

                    {/* Filter by Year */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-400 text-sm">
                            Showing {posts.length} post
                            {posts.length !== 1 ? "s" : ""}
                        </p>
                        <select
                            className="p-2 bg-gray-800 rounded text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
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

                    {/* Create New Post */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Create a New Post
                        </h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Post Title"
                                className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newPostTitle}
                                onChange={(e) =>
                                    setNewPostTitle(e.target.value)
                                }
                            />
                            <textarea
                                placeholder="What's on your mind?"
                                className="p-3 rounded bg-gray-700 text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newPostContent}
                                onChange={(e) =>
                                    setNewPostContent(e.target.value)
                                }
                            ></textarea>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCreatePost}
                                className="px-6 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition duration-200"
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Posts Feed */}
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
                                // Retrieve userId from cookies
                                const userCookie = Cookies.get("user");
                                const userData = userCookie
                                    ? JSON.parse(userCookie)
                                    : null;
                                const loggedInUserId = userData?.id;

                                return (
                                    <div
                                        key={post.id.toString()}
                                        className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                                    >
                                        {/* Delete Button */}
                                        {loggedInUserId === post.userId && (
                                            <button
                                                onClick={() =>
                                                    handleDeletePost(post.id)
                                                }
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                {post.title[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
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
