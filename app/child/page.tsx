"use client";

import { useState, useEffect } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Link from "next/link";
import EditModal from "./modals/editModal";
import DeleteModal from "./modals/deleteModal";
import childApi, { Child } from "@/app/api/child";

const USERS_PER_PAGE = 9;

export default function ChildPage() {
    const [children, setChildren] = useState<Child[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [deletingChild, setDeletingChild] = useState<Child | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const totalPages = Math.ceil(children.length / USERS_PER_PAGE);

    useEffect(() => {
        fetchChildren();
    }, []);

    // Fetch users from API
    const fetchChildren = async () => {
        try {
            const data = await childApi.getChild(); // Use API call
            setChildren(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setChildren([]); // Set users to an empty array in case of error
        }
    };

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
    const openEditModal = (child: Child) => {
        setEditingChild(child);
        setIsEditModalOpen(true);
    };

    // Close Update Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingChild(null);
    };

    // Save Changes in Update Modal
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingChild) {
            setEditingChild({ ...editingChild, [e.target.name]: e.target.value });
        }
    };

    const saveChanges = async () => {
        if (editingChild) {
            try {
                const updatedChild = await childApi.updateChild(editingChild.id, editingChild);
                setChildren(
                    children.map((child) =>
                        child.id === updatedChild.id ? updatedChild : child
                    )
                );
                closeEditModal();
            } catch (error) {
                console.error("Error updating child:", error);
            }
        }
    };

    // Open Delete Modal
    const openDeleteModal = (child: Child) => {
        setDeletingChild(child);
        setIsDeleteModalOpen(true);
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingChild(null);
    };

    // Handle Delete
    const handleDelete = async () => {
        if (deletingChild) {
            try {
                await childApi.deleteChild(deletingChild.id);
                setChildren(children.filter((child) => child.id !== deletingChild.id));
                closeDeleteModal();
            } catch (error) {
                console.error("Error deleting child:", error);
            }
        }
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
                                <th className="p-4 text-left w-[10%]">Gender</th>
                                <th className="p-4 text-left w-[20%]">Parent's Name</th>
                                <th className="p-4 text-left w-[15%]">Created Date</th>
                                <th className="p-4 text-left w-[15%]">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-white text-lg">
                            {displayedChildren.map((child, index) => (
                                <tr
                                    key={child.id}
                                    className="border-b border-gray-600 bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                                >
                                    <td className="p-4">{startIndex + index + 1}</td>
                                    <td className="p-4">{child.name}</td>
                                    <td className="p-4">{child.dob
                                            ? new Date(
                                                  child.dob
                                              ).toLocaleDateString()
                                            : "N/A"}</td>
                                    <td className="p-4">{child.gender}</td>
                                    <td className="p-4">{child.parentName}</td>
                                    <td className="p-4">{child.createDate
                                            ? new Date(
                                                  child.createDate
                                              ).toLocaleDateString()
                                            : "N/A"}</td>
                                    <td className="p-4 flex gap-3">
                                        <button
                                            onClick={() => openEditModal(child)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(child)}
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
            <EditModal
                isOpen={isEditModalOpen}
                child={editingChild}
                handleChange={handleChange}
                closeEditModal={closeEditModal}
                saveChanges={saveChanges}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                child={deletingChild}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
}