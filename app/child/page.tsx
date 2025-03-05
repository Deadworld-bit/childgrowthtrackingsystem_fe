"use client";

import { useState } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Link from "next/link";

const initialChildren = [
    {
        id: 1,
        name: "Alice Johnson",
        dob: "2015-05-15",
        gender: "Female",
        parentName: "John Johnson",
        createdDate: "2023-01-01",
    },
    {
        id: 2,
        name: "Bob Smith",
        dob: "2016-08-22",
        gender: "Male",
        parentName: "Jane Smith",
        createdDate: "2023-02-15",
    },
    {
        id: 3,
        name: "Charlie Brown",
        dob: "2017-12-10",
        gender: "Male",
        parentName: "Chris Brown",
        createdDate: "2023-03-10",
    },
    {
        id: 4,
        name: "David Lee",
        dob: "2014-07-25",
        gender: "Male",
        parentName: "Diana Lee",
        createdDate: "2022-12-20",
    },
    {
        id: 5,
        name: "Emma Davis",
        dob: "2015-04-30",
        gender: "Female",
        parentName: "Edward Davis",
        createdDate: "2023-04-18",
    },
    {
        id: 6,
        name: "Frank Wilson",
        dob: "2013-11-05",
        gender: "Male",
        parentName: "Fiona Wilson",
        createdDate: "2022-09-14",
    },
    {
        id: 7,
        name: "Grace Hall",
        dob: "2016-03-18",
        gender: "Female",
        parentName: "George Hall",
        createdDate: "2023-06-30",
    },
    {
        id: 8,
        name: "Henry Miller",
        dob: "2017-02-12",
        gender: "Male",
        parentName: "Hannah Miller",
        createdDate: "2023-07-22",
    },
    {
        id: 9,
        name: "Ivy Anderson",
        dob: "2014-09-28",
        gender: "Female",
        parentName: "Ian Anderson",
        createdDate: "2023-05-09",
    },
    {
        id: 10,
        name: "Jack Carter",
        dob: "2015-06-08",
        gender: "Male",
        parentName: "Jill Carter",
        createdDate: "2023-08-11",
    },
];

const USERS_PER_PAGE = 9;

export default function ChildPage() {
    const [children, setChildren] = useState(initialChildren);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState(null);
    const [deletingChild, setDeletingChild] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const totalPages = Math.ceil(children.length / USERS_PER_PAGE);

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const filteredChildren = children.filter(
        (child) =>
            child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.parentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedChildren = filteredChildren.slice(
        startIndex,
        startIndex + USERS_PER_PAGE
    );

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Open Update Modal
    const openEditModal = (child) => {
        setEditingChild(child);
        setIsEditModalOpen(true);
    };

    // Close Update Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingChild(null);
    };

    // Save Changes in Update Modal
    const handleChange = (e) => {
        setEditingChild({ ...editingChild, [e.target.name]: e.target.value });
    };

    const saveChanges = () => {
        setChildren(
            children.map((child) =>
                child.id === editingChild.id ? editingChild : child
            )
        );
        closeEditModal();
    };

    // Open Delete Modal
    const openDeleteModal = (child) => {
        setDeletingChild(child);
        setIsDeleteModalOpen(true);
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingChild(null);
    };

    // Handle Delete
    const handleDelete = () => {
        setChildren(children.filter((child) => child.id !== deletingChild.id));
        closeDeleteModal();
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Navbar */}
            <Navbar />

            <main className="flex-grow px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl font-bold my-6 text-left">
                    Child Management
                </h1>

                <div className="flex justify-between items-center mb-4">
                    <div></div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-600 bg-[#1E1E1E] shadow-lg">
                        <thead className="bg-gray-800 text-white text-lg">
                            <tr>
                                <th className="p-4 text-left w-[5%]">#</th>
                                <th className="p-4 text-left w-[20%]">Name</th>
                                <th className="p-4 text-left w-[15%]">DOB</th>
                                <th className="p-4 text-left w-[10%]">
                                    Gender
                                </th>
                                <th className="p-4 text-left w-[20%]">
                                    Parent's Name
                                </th>
                                <th className="p-4 text-left w-[15%]">
                                    Created Date
                                </th>
                                <th className="p-4 text-left w-[15%]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-white text-lg">
                            {displayedChildren.map((child, index) => (
                                <tr
                                    key={child.id}
                                    className="border-b border-gray-600 bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                                >
                                    <td className="p-4">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="p-4">{child.name}</td>
                                    <td className="p-4">{child.dob}</td>
                                    <td className="p-4">{child.gender}</td>
                                    <td className="p-4">{child.parentName}</td>
                                    <td className="p-4">{child.createdDate}</td>
                                    <td className="p-4 flex gap-3">
                                        <button
                                            onClick={() => openEditModal(child)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(child)
                                            }
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <Link href="/child/detail">
                                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                Detail
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-white ${
                            currentPage === 1
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        Previous
                    </button>

                    <span className="text-lg font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-white ${
                            currentPage === totalPages
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </main>

            {/* Update Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            Update Child
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={editingChild.name}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">DOB</label>
                            <input
                                type="date"
                                name="dob"
                                value={editingChild.dob}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Gender</label>
                            <input
                                type="text"
                                name="gender"
                                value={editingChild.gender}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">
                                Parent's Name
                            </label>
                            <input
                                type="text"
                                name="parentName"
                                value={editingChild.parentName}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            Confirm Delete
                        </h2>
                        <p className="mb-4">
                            Are you sure you want to delete{" "}
                            <strong>{deletingChild?.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}
