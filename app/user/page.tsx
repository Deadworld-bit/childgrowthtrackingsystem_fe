"use client";

import { useState } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

const initialUsers = [
    { 
        id: 1, name: "Alice Johnson", job: "Software Engineer", username: "alice_j", 
        dob: "1990-05-15", createdDate: "2023-01-01", email: "alice@example.com" 
    },
    { 
        id: 2, name: "Bob Smith", job: "UI/UX Designer", username: "bob_design", 
        dob: "1992-08-22", createdDate: "2023-02-15", email: "bob@example.com" 
    },
    { 
        id: 3, name: "Charlie Brown", job: "Full Stack Developer", username: "charlie_dev", 
        dob: "1995-12-10", createdDate: "2023-03-10", email: "charlie@example.com" 
    },
    { 
        id: 4, name: "David Lee", job: "Data Scientist", username: "david_data", 
        dob: "1988-07-25", createdDate: "2022-12-20", email: "david@example.com" 
    },
    { 
        id: 5, name: "Emma Davis", job: "Product Manager", username: "emma_pdm", 
        dob: "1991-04-30", createdDate: "2023-04-18", email: "emma@example.com" 
    },
    { 
        id: 6, name: "Frank Wilson", job: "DevOps Engineer", username: "frank_ops", 
        dob: "1985-11-05", createdDate: "2022-09-14", email: "frank@example.com" 
    },
    { 
        id: 7, name: "Grace Hall", job: "Cybersecurity Analyst", username: "grace_sec", 
        dob: "1993-03-18", createdDate: "2023-06-30", email: "grace@example.com" 
    },
    { 
        id: 8, name: "Henry Miller", job: "AI Researcher", username: "henry_ai", 
        dob: "1997-02-12", createdDate: "2023-07-22", email: "henry@example.com" 
    },
    { 
        id: 9, name: "Ivy Anderson", job: "Marketing Specialist", username: "ivy_mark", 
        dob: "1994-09-28", createdDate: "2023-05-09", email: "ivy@example.com" 
    },
    { 
        id: 10, name: "Jack Carter", job: "Blockchain Developer", username: "jack_chain", 
        dob: "1990-06-08", createdDate: "2023-08-11", email: "jack@example.com" 
    },
];

export default function UserPage() {
    const [users, setUsers] = useState(initialUsers);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    // Open Update Modal
    const openEditModal = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    // Close Update Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    // Save Changes in Update Modal
    const handleChange = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    };

    const saveChanges = () => {
        setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
        closeEditModal();
    };

    // Open Delete Modal
    const openDeleteModal = (user) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
    };

    // Handle Delete
    const handleDelete = () => {
        setUsers(users.filter((user) => user.id !== deletingUser.id));
        closeDeleteModal();
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Navbar */}
            <Navbar />

            <main className="flex-grow px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl font-bold my-6 text-left">User Management</h1>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-600 bg-[#1E1E1E] shadow-lg">
                        <thead className="bg-gray-800 text-white text-lg">
                            <tr>
                                <th className="p-4 text-left w-[5%]">#</th>
                                <th className="p-4 text-left w-[20%]">Name</th>
                                <th className="p-4 text-left w-[20%]">Job</th>
                                <th className="p-4 text-left w-[15%]">DOB</th>
                                <th className="p-4 text-left w-[25%]">Email</th>
                                <th className="p-4 text-left w-[15%]">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-white text-lg">
                            {users.map((user, index) => (
                                <tr key={user.id} className="border-b border-gray-600 bg-[#2D2D2D] hover:bg-[#3A3A3A]">
                                    <td className="p-4">{index + 1}</td>
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.job}</td>
                                    <td className="p-4">{user.dob}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 flex gap-3">
                                        <button 
                                            onClick={() => openEditModal(user)} 
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => openDeleteModal(user)} 
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
            </main>

            {/* Update Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Update User</h2>
                        <div className="mb-4">
                            <label className="block text-sm">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={editingUser.name} 
                                onChange={handleChange} 
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Job</label>
                            <input 
                                type="text" 
                                name="job" 
                                value={editingUser.job} 
                                onChange={handleChange} 
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">DOB</label>
                            <input 
                                type="date" 
                                name="dob" 
                                value={editingUser.dob} 
                                onChange={handleChange} 
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={editingUser.email} 
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
                        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete <strong>{deletingUser?.name}</strong>?</p>
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
