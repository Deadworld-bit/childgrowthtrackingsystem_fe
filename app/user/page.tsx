"use client";

import { useState, useEffect } from "react";
import {
    FaEdit,
    FaPlus,
    FaTrash,
    FaInfoCircle,
    FaUserMd,
} from "react-icons/fa";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import CreateUserModal from "./modals/createModal";
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
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [creatingUser, setCreatingUser] = useState<Partial<User>>({});
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
    const [userType, setUserType] = useState("members");
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    // Fetch user's role from cookies
    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserRole(parsedUser.role);
        }
        setIsRoleLoading(false);
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
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user by ID
    const fetchUserById = async (id: bigint) => {
        try {
            const user = await userApi.getUserById(id);
            setProfileUser(user);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
        }
    };

    // Pagination
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

    // Create User
    const openCreateModal = () => {
        setCreatingUser({});
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreatingUser({});
    };

    // Create User
    const saveNewUser = async () => {
        try {
            const newUserData = {
                ...creatingUser,
            };
            const response = await userApi.createUser(
                newUserData as {
                    username: string;
                    email: string;
                    password: string;
                    role: string;
                }
            );

            if (response.status === "success" && response.data) {
                setUsers([...users, response.data]);
                setSuccessMessage(response.message);
            } else {
                setSuccessMessage("Failed to create user");
            }

            closeCreateModal();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Edit Modal
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
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    };

    // Delete Modal
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
                setUsers(users.filter((u) => u.id !== deletingUser.id));
                setSuccessMessage("User banned successfully!");
                closeDeleteModal();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // Specialization Modal
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

    // If role not loaded yet
    if (isRoleLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    // If not admin
    if (userRole !== "ADMIN") {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg">
                    You&apos;re not allowed to use this function.
                </p>
                <Link
                    href="./"
                    className="mt-2 text-sm text-blue-400 hover:underline"
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
            <main className="flex-grow px-4 md:px-8 lg:px-16 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        User Management
                    </h1>
                    <p className="text-gray-300 mt-2">
                        Manage your site&apos;s users with ease.
                    </p>
                </div>

                {/* Filter & Search */}
                <div className="mb-6 p-6 bg-[#1E1E1E] rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 flex items-center gap-2"
                            >
                                <FaPlus />
                                <span>Create New User</span>
                            </button>
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
                        <form autoComplete="off">
                            {/* Hidden dummy input to prevent autofill */}
                            <input
                                type="text"
                                name="hidden-field"
                                style={{ display: "none" }}
                                autoComplete="username"
                            />
                            <input
                                type="text"
                                name="user-search"
                                autoComplete="off"
                                placeholder="Search by username or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500 rounded-lg text-white">
                        {successMessage}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto bg-[#1E1E1E] rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading...</p>
                        </div>
                    ) : displayedUsers.length > 0 ? (
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="p-4 text-left w-[5%]">#</th>
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
                            <tbody>
                                {displayedUsers.map((user, index) => (
                                    <tr
                                        key={user.id.toString()}
                                        className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="p-4">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="p-4">{user.username}</td>
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
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            {/* 
                                                2-column layout for buttons using CSS grid.
                                                This places 4 buttons in a 2x2 arrangement.
                                            */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                    className="flex items-center justify-center gap-2 px-2 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition text-sm"
                                                >
                                                    <FaEdit />
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(user)
                                                    }
                                                    className="flex items-center justify-center gap-2 px-2 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition text-sm"
                                                >
                                                    <FaTrash />
                                                    Ban
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        fetchUserById(user.id)
                                                    }
                                                    className="flex items-center justify-center gap-2 px-2 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition text-sm"
                                                >
                                                    <FaInfoCircle />
                                                    Detail
                                                </button>
                                                {userType === "doctors" && (
                                                    <button
                                                        onClick={() =>
                                                            openSpecializationModal(
                                                                user.specialization,
                                                                user.certificate
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 px-2 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition text-sm"
                                                    >
                                                        <FaUserMd />
                                                        Specialization
                                                    </button>
                                                )}
                                            </div>
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
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 gap-6">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-white transition ${
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
                        className={`px-4 py-2 rounded-lg text-white transition ${
                            currentPage === totalPages
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </main>

            {/* Modals */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                user={creatingUser}
                handleChange={(e) =>
                    setCreatingUser({
                        ...creatingUser,
                        [e.target.name]: e.target.value,
                    })
                }
                closeModal={closeCreateModal}
                createUser={saveNewUser}
            />

            <EditModal
                isOpen={isEditModalOpen}
                user={editingUser!}
                handleChange={handleChange}
                closeEditModal={closeEditModal}
                saveChanges={saveChanges}
            />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                user={deletingUser}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                user={profileUser}
                closeModal={() => setIsProfileModalOpen(false)}
            />
            <SpecializationModal
                isOpen={isSpecializationModalOpen}
                specialization={specialization}
                certificate={certificate}
                closeModal={closeSpecializationModal}
            />
            <Footer />
        </div>
    );
}
