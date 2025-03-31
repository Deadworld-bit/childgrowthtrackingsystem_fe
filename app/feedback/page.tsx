"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import userApi from "../api/user";
import feedbackApi from "../api/feedback";
import Cookies from "js-cookie";
import Link from "next/link";
import DeleteFeedbackModal from "../feedback/modals/deleteModal"; // Adjust the path as needed

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    rating: number;
}

export default function FeedbackPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [doctorFeedbacks, setDoctorFeedbacks] = useState<
        {
            id: number;
            user: string;
            feedback: string;
            rating: number;
            date: string;
        }[]
    >([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [newFeedback, setNewFeedback] = useState("");
    const [newRating, setNewRating] = useState<number>(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState<{ id: number; user: string } | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const doctorsPerPage = 5;
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    // Function to display notification messages
    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    // Fetch user role, ID, and username from cookies
    useEffect(() => {
        const fetchUserData = async () => {
            const user = Cookies.get("user");
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setUsername(parsedUser.username);
                    // Fetch user data from API to get the latest role info
                    const userData = await userApi.getUserById(parsedUser.id);
                    setUserRole(userData.role);
                    setUserId(Number(userData.id));
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.error("User cookie not found.");
            }
            setIsRoleLoading(false);
        };

        fetchUserData();
    }, []);

    // Fetch doctors and their ratings
    const fetchDoctorsWithRatings = async () => {
        try {
            const doctorData = await userApi.getDoctors();
            const doctorsWithRatings = await Promise.all(
                doctorData.map(async (doctor: any) => {
                    const rating = await feedbackApi.getDoctorRating(BigInt(doctor.id));
                    return {
                        id: doctor.id,
                        name: doctor.username || "Unknown Name",
                        specialty:
                            doctor.specialty ||
                            doctor.specialization ||
                            "Unknown Specialty",
                        rating: rating || 0,
                    };
                })
            );

            setDoctors(doctorsWithRatings);
            setFilteredDoctors(doctorsWithRatings);

            // Select the first doctor by default if available
            if (doctorsWithRatings.length > 0) {
                setSelectedDoctor(doctorsWithRatings[0].id);
                fetchDoctorFeedbacks(doctorsWithRatings[0].id);
            }
        } catch (error) {
            console.error("Error fetching doctors and ratings:", error);
        }
    };

    // Fetch feedback for a specific doctor
    const fetchDoctorFeedbacks = async (doctorId: number) => {
        try {
            const feedbacks = await feedbackApi.getFeedbackByDoctorId(BigInt(doctorId));
            setDoctorFeedbacks(
                feedbacks.map((feedback) => ({
                    id: Number(feedback.id),
                    user: feedback.parentname,
                    feedback: feedback.description,
                    rating: feedback.rating,
                    date: new Date().toISOString().split("T")[0],
                }))
            );
        } catch (error) {
            console.error("Error fetching feedbacks for doctor:", error);
        }
    };

    // Handle new feedback submission
    const handleNewFeedbackSubmit = async () => {
        if (!selectedDoctor) {
            showNotification("Please select a doctor to leave feedback.", "error");
            return;
        }
        if (newRating < 1 || newRating > 5) {
            showNotification("Please provide a rating between 1 and 5.", "error");
            return;
        }
        if (!userId) {
            showNotification("User ID not found. Please log in again.", "error");
            return;
        }

        try {
            await feedbackApi.createFeedback({
                doctorId: selectedDoctor,
                parentId: userId,
                description: newFeedback,
                rating: newRating,
            });

            fetchDoctorFeedbacks(selectedDoctor);
            setNewFeedback("");
            setNewRating(0);
            showNotification("Feedback submitted successfully!", "success");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            showNotification("Failed to submit feedback. Please try again.", "error");
        }
    };

    // Handle feedback deletion with modal confirmation.
    const handleDeleteFeedback = async (feedbackId: number) => {
        try {
            // Convert feedbackId to BigInt before sending to the API
            await feedbackApi.deleteFeedback(BigInt(feedbackId));
            // Update the feedback list after deletion
            setDoctorFeedbacks((prevFeedbacks) =>
                prevFeedbacks.filter((feedback) => feedback.id !== feedbackId)
            );
            showNotification("Feedback deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            showNotification("Failed to delete feedback. Please try again.", "error");
        }
    };

    // Open modal with selected feedback
    const openDeleteModal = (feedback: { id: number; user: string }) => {
        setFeedbackToDelete(feedback);
        setIsDeleteModalOpen(true);
    };

    // Close modal handler
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFeedbackToDelete(null);
    };

    useEffect(() => {
        fetchDoctorsWithRatings();
    }, []);

    // Handle doctor selection
    const handleDoctorClick = (doctorId: number) => {
        setSelectedDoctor(doctorId);
        fetchDoctorFeedbacks(doctorId);
    };

    // Handle rating filter
    const handleRatingFilterChange = (rating: number) => {
        setRatingFilter(rating);
        const filtered = doctors.filter((doctor) => doctor.rating >= rating);
        setFilteredDoctors(filtered);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        const filtered = doctors.filter((doctor) =>
            doctor.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredDoctors(filtered);
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    if (isRoleLoading) {
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    // Access control
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
                background: "linear-gradient(to bottom, #1e1e1e, #121212)",
                backgroundImage: "url('/parttern02.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
            }}
        >
            <Navbar />
            {/* Notification Banner */}
            {notification && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
                        notification.type === "success"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                    }`}
                >
                    {notification.message}
                </div>
            )}
            <main className="flex-grow p-6 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Doctor List + Search & Filter */}
                    <section className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 w-full lg:w-[650px] flex flex-col h-[1025px]">
                        <h2 className="text-2xl font-bold mb-6">Doctors</h2>
                        {/* Search */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2 font-semibold">
                                Search by Name:
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search for a doctor..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        {/* Rating Filter */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2 font-semibold">
                                Filter by Rating:
                            </label>
                            <select
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={ratingFilter}
                                onChange={(e) =>
                                    handleRatingFilterChange(Number(e.target.value))
                                }
                            >
                                <option value={0}>All Ratings</option>
                                <option value={4}>4.0 and above</option>
                                <option value={4.5}>4.5 and above</option>
                            </select>
                        </div>
                        {/* Doctor List */}
                        <ul className="space-y-4">
                            {currentDoctors.map((doctor) => (
                                <li
                                    key={doctor.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                        selectedDoctor === doctor.id
                                            ? "bg-blue-600 border-blue-500"
                                            : "bg-gray-800 border-gray-700"
                                    } hover:shadow-md`}
                                    onClick={() => handleDoctorClick(doctor.id)}
                                >
                                    <h3 className="text-xl font-semibold">
                                        {doctor.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {doctor.specialty}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-yellow-500 text-lg">★</span>
                                        <span className="ml-1 text-gray-300">
                                            {doctor.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* Pagination */}
                        <div className="mt-8 flex justify-between items-center">
                            <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-gray-300 text-lg">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </section>

                    {/* Right Side: Doctor Feedback + Form */}
                    <section className="bg-[#1E1E1E] rounded-lg shadow-lg p-6 w-full lg:w-[700px] flex flex-col h-[1025px]">
                        <h2 className="text-2xl font-bold mb-6">
                            Feedback for{" "}
                            {doctors.find((doc) => doc.id === selectedDoctor)?.name || "Doctor"}
                        </h2>
                        {/* Feedback List */}
                        <div className="flex-grow overflow-y-auto mb-4">
                            {doctorFeedbacks.length > 0 ? (
                                <ul className="space-y-4">
                                    {doctorFeedbacks.map((feedback) => (
                                        <li
                                            key={feedback.id}
                                            className="relative p-4 border border-gray-700 rounded-lg bg-gray-800 hover:shadow-md transition"
                                        >
                                            {/* Delete icon: only show if the feedback belongs to the logged-in user */}
                                            {username && feedback.user === username && (
                                                <button
                                                    onClick={() => openDeleteModal(feedback)}
                                                    className="absolute top-2 right-2"
                                                    title="Delete Feedback"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-red-500 hover:text-red-400"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v10a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 5a.5.5 0 011 0v7a.5.5 0 01-1 0V7zm4 0a.5.5 0 011 0v7a.5.5 0 01-1 0V7z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                            <p className="text-gray-300">{feedback.feedback}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center space-x-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-lg ${
                                                                feedback.rating >= star
                                                                    ? "text-yellow-500"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400">
                                                    {feedback.user} - {feedback.date}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">
                                    No feedback available for this doctor.
                                </p>
                            )}
                        </div>

                        {/* New Feedback Form (Members only) */}
                        {userRole === "MEMBER" && (
                            <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:shadow-md transition mt-auto">
                                <h3 className="text-lg font-semibold mb-4">Leave Feedback</h3>
                                <textarea
                                    className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Write your feedback here..."
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                ></textarea>
                                <label className="block text-gray-300 font-semibold mb-2">Rating:</label>
                                <select
                                    className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRating}
                                    onChange={(e) => setNewRating(Number(e.target.value))}
                                >
                                    <option value={0}>Select Rating</option>
                                    <option value={1}>1 - Poor</option>
                                    <option value={2}>2 - Fair</option>
                                    <option value={3}>3 - Good</option>
                                    <option value={4}>4 - Very Good</option>
                                    <option value={5}>5 - Excellent</option>
                                </select>
                                <button
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleNewFeedbackSubmit}
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
            {/* Delete Modal */}
            {isDeleteModalOpen && feedbackToDelete && (
                <DeleteFeedbackModal
                    isOpen={isDeleteModalOpen}
                    feedbackUser={feedbackToDelete.user}
                    closeDeleteModal={closeDeleteModal}
                    handleDelete={() => {
                        handleDeleteFeedback(feedbackToDelete.id);
                        closeDeleteModal();
                    }}
                />
            )}
        </div>
    );
}
