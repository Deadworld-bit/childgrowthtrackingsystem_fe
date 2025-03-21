"use client";

import Footer from "@/sections/Footer";
import Navbar from "@/sections/Navbar";
import React, { useState, useEffect } from "react";

const FeedbackPage = () => {
  const [doctors, setDoctors] = useState<
    { id: number; name: string; specialty: string; rating: number }[]
  >([]); // Mocked list of doctors
  const [filteredDoctors, setFilteredDoctors] = useState<
    { id: number; name: string; specialty: string; rating: number }[]
  >([]); // Filtered list of doctors
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null); // Selected doctor ID
  const [doctorFeedbacks, setDoctorFeedbacks] = useState<
    { id: number; user: string; feedback: string; rating: number; date: string }[]
  >([]); // Mocked feedback for the selected doctor
  const [currentPage, setCurrentPage] = useState(1); // Current page for paging
  const [ratingFilter, setRatingFilter] = useState(0); // Minimum rating filter
  const [searchQuery, setSearchQuery] = useState(""); // Search query for doctor names

  const doctorsPerPage = 5; // Number of doctors to show per page

  // Mock API calls (replace with actual API calls later)
  const fetchDoctors = async () => {
    return [
      { id: 1, name: "Dr. Smith", specialty: "Pediatrics", rating: 4.5 },
      { id: 2, name: "Dr. Johnson", specialty: "Cardiology", rating: 4.2 },
      { id: 3, name: "Dr. Brown", specialty: "Dermatology", rating: 4.8 },
      { id: 4, name: "Dr. Taylor", specialty: "Neurology", rating: 3.9 },
      { id: 5, name: "Dr. Wilson", specialty: "Orthopedics", rating: 4.1 },
      { id: 6, name: "Dr. Martinez", specialty: "Oncology", rating: 4.7 },
      { id: 7, name: "Dr. Lee", specialty: "Psychiatry", rating: 4.3 },
      { id: 8, name: "Dr. Walker", specialty: "Radiology", rating: 4.0 },
      { id: 9, name: "Dr. Hall", specialty: "Surgery", rating: 4.6 },
      { id: 10, name: "Dr. Allen", specialty: "Urology", rating: 3.8 },
      { id: 11, name: "Dr. Young", specialty: "Gastroenterology", rating: 4.4 },
      { id: 12, name: "Dr. King", specialty: "Endocrinology", rating: 4.9 },
    ];
  };

  const fetchDoctorFeedbacks = async (doctorId: number) => {
    const feedbacks: { [key: string]: { id: number; user: string; feedback: string; rating: number; date: string }[] } = {
      "1": [
        { id: 1, user: "John Doe", feedback: "Very professional.", rating: 5, date: "2025-03-19" },
        { id: 2, user: "Jane Smith", feedback: "Helped me a lot!", rating: 4, date: "2025-03-17" },
      ],
      2: [
        { id: 3, user: "Alice Brown", feedback: "Excellent care!", rating: 5, date: "2025-03-18" },
      ],
      3: [
        { id: 4, user: "Bob White", feedback: "Very knowledgeable.", rating: 5, date: "2025-03-16" },
        { id: 5, user: "Charlie Green", feedback: "Friendly and helpful.", rating: 4, date: "2025-03-15" },
      ],
    };
    return feedbacks[doctorId.toString()] || [];
  };

  useEffect(() => {
    // Fetch doctors on page load
    const loadDoctors = async () => {
      const doctors = await fetchDoctors();
      setDoctors(doctors);
      setFilteredDoctors(doctors); // Initialize filtered doctors
      if (doctors.length > 0) {
        setSelectedDoctor(doctors[0].id); // Default to the first doctor
        const feedbacks = await fetchDoctorFeedbacks(doctors[0].id);
        setDoctorFeedbacks(feedbacks);
      }
    };

    loadDoctors();
  }, []);

  const handleDoctorClick = async (doctorId: number) => {
    setSelectedDoctor(doctorId);
    const feedbacks = await fetchDoctorFeedbacks(doctorId);
    setDoctorFeedbacks(feedbacks);
  };

  const handleRatingFilterChange = (rating: number) => {
    setRatingFilter(rating);
    const filtered = doctors.filter((doctor) => doctor.rating >= rating);
    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Calculate the doctors to display on the current page
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Left Side: Doctor List */}
          <div className="bg-gray-700 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold text-white mb-6">Doctors</h2>

            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-300 mb-2">
                Search by Name:
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for a doctor..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-300 mb-2">
                Filter by Rating:
              </label>
              <select
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={ratingFilter}
                onChange={(e) => handleRatingFilterChange(Number(e.target.value))}
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
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedDoctor === doctor.id
                      ? "bg-blue-600 border-blue-500"
                      : "bg-gray-800 border-gray-600"
                  } hover:shadow-md transition duration-200`}
                  onClick={() => handleDoctorClick(doctor.id)}
                >
                  <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                  <p className="text-sm text-gray-400">{doctor.specialty}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="ml-1 text-gray-300">{doctor.rating.toFixed(1)}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-300 text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Side: Doctor Feedback */}
          <div className="bg-gray-700 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold text-white mb-6">
              Feedback for {doctors.find((doc) => doc.id === selectedDoctor)?.name || "Doctor"}
            </h2>
            {doctorFeedbacks.length > 0 ? (
              <ul className="space-y-4">
                {doctorFeedbacks.map((feedback) => (
                  <li
                    key={feedback.id}
                    className="p-4 border border-gray-600 rounded-lg bg-gray-800 hover:shadow-md transition duration-200"
                  >
                    <p className="text-gray-300">{feedback.feedback}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              feedback.rating >= star ? "text-yellow-500" : "text-gray-600"
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
              <p className="text-gray-400">No feedback available for this doctor.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;