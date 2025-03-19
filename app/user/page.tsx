"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaUserMd } from "react-icons/fa";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import EditModal from "./modals/editModal";
import DeleteModal from "./modals/deleteModal";
import ProfileModal from "./modals/profileModal";
import SpecializationModal from "./modals/specializationModal";
import userApi, { User } from "@/app/api/user";
import Cookies from "js-cookie";
import Link from "next/link";

const USERS_PER_PAGE = 9;

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [isSpecializationModalOpen, setIsSpecializationModalOpen] =
        useState(false);
    const [specialization, setSpecialization] = useState("");
    const [certificate, setCertificate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [userType, setUserType] = useState("members"); // New state to track user type
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    // Fetch user's role from cookies
    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserRole(parsedUser.role); // Assuming the user object has a `role` property
        }
        setIsRoleLoading(false); // Role check is complete
    }, []);

    // Fetch users when component mounts or userType changes
    useEffect(() => {
        fetchUsers();
    }, [userType]);

    // Fetch users from API
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data =
                userType === "members"
                    ? await userApi.getMembers()
                    : await userApi.getDoctors();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]); // Set users to an empty array in case of error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user by ID
    const fetchUserById = async (id: string) => {
        try {
            const user = await userApi.getUserById(id);
            setProfileUser(user);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
        }
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const filteredUsers = users.filter(
        (user) =>
            (user.username &&
                user.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (user.email &&
                user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const displayedUsers = filteredUsers.slice(
        startIndex,
        startIndex + USERS_PER_PAGE
    );
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (editingUser) {
            setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
        }
    };

    const saveChanges = async () => {
        if (editingUser) {
            try {
                const updatedUser = await userApi.updateUser(
                    editingUser.id,
                    editingUser
                );
                setUsers(
                    users.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user
                    )
                );
                setSuccessMessage("User updated successfully!");
                closeEditModal();
                setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
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
                setSuccessMessage("User banned successfully!");
                closeDeleteModal();
                setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // Open Specialization Modal
    const openSpecializationModal = (
        specialization: string,
        certificate: string
    ) => {
        setSpecialization(specialization);
        setCertificate(certificate);
        setIsSpecializationModalOpen(true);
    };

    const closeSpecializationModal = () => {
        setIsSpecializationModalOpen(false);
        setSpecialization("");
        setCertificate("");
    };

    if (isRoleLoading) {
        // Show a loading spinner or placeholder while determining the user's role
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    if (userRole !== "ADMIN") {
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

    return (
        <div
            className="flex flex-col min-h-screen text-white"
            style={{
                background: "linear-gradient(to bottom, #1e1e1e, #121212)",
                backgroundImage: "url('/parttern.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
            }}
        >
            {/* Navbar */}
            <Navbar />
            <main className="flex-grow px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl font-bold my-6 text-left">
                    User Management
                </h1>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="userType" className="text-lg">
                            User Type:
                        </label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="members">Members</option>
                            <option value="doctors">Doctors</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">
                        {successMessage}
                    </div>
                )}

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <>
                            {displayedUsers.length > 0 ? (
                                <table className="w-full table-auto border border-gray-600 bg-[#1E1E1E] shadow-lg">
                                    <thead className="bg-gray-800 text-white text-lg">
                                        <tr>
                                            <th className="p-4 text-left w-[5%]">
                                                #
                                            </th>
                                            <th className="p-4 text-left w-[20%]">
                                                Name
                                            </th>
                                            <th className="p-4 text-left w-[20%]">
                                                Membership
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Create Date
                                            </th>
                                            <th className="p-4 text-left w-[25%]">
                                                Email
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="text-white text-lg">
                                        {displayedUsers.map((user, index) => (
                                            <tr
                                                key={user.id.toString()}
                                                className="border-b border-gray-600 bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                                            >
                                                <td className="p-4">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="p-4">
                                                    {user.username}
                                                </td>
                                                <td className="p-4">
                                                    {user.membership}
                                                </td>
                                                <td className="p-4">
                                                    {user.createdDate
                                                        ? new Date(
                                                              user.createdDate
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>
                                                <td className="p-4">
                                                    {user.email}
                                                </td>
                                                <td className="p-4 flex gap-3">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(user)
                                                        }
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                                    >
                                                        <FaEdit /> Update
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                user
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                                                    >
                                                        <FaTrash /> Ban
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            fetchUserById(
                                                                user.id.toString()
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                                                    >
                                                        <FaInfoCircle /> Detail
                                                    </button>
                                                    {userType === "doctors" && (
                                                        <button
                                                            onClick={() =>
                                                                openSpecializationModal(
                                                                    user.specialization,
                                                                    user.certificate
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                                                        >
                                                            <FaUserMd />{" "}
                                                            Specialization
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-lg">No users found.</p>
                                </div>
                            )}
                        </>
                    )}
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
            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                user={deletingUser}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
            />
            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                user={profileUser}
                closeModal={() => setIsProfileModalOpen(false)}
            />
            {/* Specialization Modal */}
            <SpecializationModal
                isOpen={isSpecializationModalOpen}
                specialization={specialization}
                certificate={certificate}
                closeModal={closeSpecializationModal}
            />
            {/* Footer */}
            <Footer />
        </div>
    );
}
