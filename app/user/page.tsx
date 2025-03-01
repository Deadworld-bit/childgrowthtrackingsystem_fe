"use client";

import { useState, useEffect } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import EditModal from "./modals/editModal";
import DeleteModal from "./modals/deleteModal";
import userApi, { User } from "@/app/api/user";

const USERS_PER_PAGE = 9;

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

    // Fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            const data = await userApi.getUsers(); // Use API call
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Open/Close Update Modal
    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingUser) {
            setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
        }
    };

    const saveChanges = async () => {
        if (editingUser) {
            try {
                const updatedUser = await userApi.updateUser(editingUser.id, editingUser);
                setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
                closeEditModal();
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    };

    // Open/Close Delete Modal
    const openDeleteModal = (user: User) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
    };

    const handleDelete = async () => {
        if (deletingUser) {
            try {
                await userApi.deleteUser(deletingUser.id);
                setUsers(users.filter((user) => user.id !== deletingUser.id));
                closeDeleteModal();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Navbar */}
            <Navbar />
            <main className="flex-grow px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl font-bold my-6 text-left">
                    User Management
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
                                <th className="p-4 text-left w-[20%]">Job</th>
                                <th className="p-4 text-left w-[15%]">DOB</th>
                                <th className="p-4 text-left w-[25%]">Email</th>
                                <th className="p-4 text-left w-[15%]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-white text-lg">
                            {displayedUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-600 bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                                >
                                    <td className="p-4">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.membershipId}</td>
                                    <td className="p-4">{user.createDate.toLocaleDateString()}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 flex gap-3">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(user)
                                            }
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
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
                user={editingUser!} // Add a check before rendering to avoid passing `null`
                handleChange={handleChange}
                closeEditModal={closeEditModal}
                saveChanges={saveChanges}
            />
            ;{/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                user={deletingUser}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
            />
            ;{/* Footer */}
            <Footer />
        </div>
    );
}
