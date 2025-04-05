"use client";

import { useState, useEffect } from "react";
import {
    FaEdit,
    FaTrash,
    FaInfoCircle,
    FaPlus,
    FaUserMd,
} from "react-icons/fa";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Link from "next/link";
import EditModal from "./modals/editModal";
import DeleteModal from "./modals/deleteModal";
import CreateModal from "./modals/createModal";
import SetDoctorModal from "./modals/setDoctorModal";
import childApi, { Child } from "@/app/api/child";
import userApi, { User } from "@/app/api/user";
import Cookies from "js-cookie";

const USERS_PER_PAGE = 9;

export default function ChildPage() {
    const [children, setChildren] = useState<Child[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSetDoctorModalOpen, setIsSetDoctorModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [deletingChild, setDeletingChild] = useState<Child | null>(null);
    const [creatingChild, setCreatingChild] = useState<Partial<Child>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("haveDoctor");
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; role: string; membership: string } | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [doctors, setDoctors] = useState<User[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);

    const totalPages = Math.ceil(children.length / USERS_PER_PAGE);

    // Fetch user's role and ID from cookies
    useEffect(() => {
        const fetchUserData = async () => {
            const user = Cookies.get("user");
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    // Fetch user data from API to get the latest role info
                    const userData = await userApi.getUserById(parsedUser.id);
                    setUser({
                        id: userData.id.toString(),
                        role: userData.role,
                        membership: userData.membership || "BASIC", 
                    });
                    setUserRole(userData.role);
                    setUserId(userData.id.toString());
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

    // Fetch children whenever filter, userRole, or userId changes
    useEffect(() => {
        fetchChildren();
    }, [filter, userRole, userId]);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            let data: Child[] = [];
            if (userRole === "ADMIN") {
                data =
                    filter === "haveDoctor"
                        ? await childApi.getChildHaveDoctor()
                        : await childApi.getChildDontHaveDoctor();
            } else if (userRole === "MEMBER" && userId) {
                data = await childApi.getChildByParentId(BigInt(userId));
            } else if (userRole === "DOCTOR" && userId) {
                data = await childApi.getChildByDoctorId(BigInt(userId));
            }
            setChildren(data);
        } catch (error) {
            console.error("Error fetching children:", error);
            setChildren([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const data = await userApi.getDoctors();
            setDoctors(data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    // Filter & Pagination
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

    // Create Child
    const openCreateModal = () => {
        // Check if user is a MEMBER, not PREMIUM, and already has at least one child.
        if (
          userRole === "MEMBER" &&
          user?.membership?.toUpperCase() !== "PREMIUM" &&
          children.length >= 1
        ) {
          setSuccessMessage(
            "You have reached the child limit. Please upgrade your membership to add more children."
          );
          setTimeout(() => setSuccessMessage(null), 3000);
          return;
        }
        setCreatingChild({});
        setIsCreateModalOpen(true);
      };      

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreatingChild({});
    };

    const saveNewChild = async () => {
        if (!userId) {
            console.error("Parent ID is missing. Please log in again.");
            return;
        }

        try {
            const newChildData = {
                ...creatingChild,
                dob: creatingChild.dob ? creatingChild.dob.toString() : "",
                parentId: parseInt(userId),
            };
            const newChild = await childApi.createChild(
                newChildData as {
                    name: string;
                    dob: string;
                    gender: string;
                    parentId: number;
                }
            );
            setChildren([...children, newChild]);
            setSuccessMessage("Child created successfully!");
            closeCreateModal();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error creating child:", error);
        }
    };

    // Edit Child
    const openEditModal = (child: Child) => {
        setEditingChild(child);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingChild(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (editingChild) {
            setEditingChild({
                ...editingChild,
                [e.target.name]: e.target.value,
            });
        }
    };

    const saveChanges = async () => {
        if (editingChild) {
            try {
                const updatedChildData = {
                    name: editingChild.name,
                    dob: editingChild.dob,
                    gender: editingChild.gender,
                };

                const updatedChild = await childApi.updateChild(
                    editingChild.id,
                    updatedChildData
                );

                setChildren(
                    children.map((child) =>
                        child.id === updatedChild.id ? updatedChild : child
                    )
                );
                setSuccessMessage("Child updated successfully!");
                closeEditModal();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error("Error updating child:", error);
            }
        }
    };

    // Delete Child
    const openDeleteModal = (child: Child) => {
        setDeletingChild(child);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingChild(null);
    };

    const handleDelete = async () => {
        if (deletingChild) {
            try {
                await childApi.deleteChild(deletingChild.id);
                setChildren(children.filter((c) => c.id !== deletingChild.id));
                setSuccessMessage("Child deleted successfully!");
                closeDeleteModal();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error("Error deleting child:", error);
            }
        }
    };

    // Set Doctor
    const openSetDoctorModal = (child: Child) => {
        setSelectedChild(child);
        fetchDoctors();
        setIsSetDoctorModalOpen(true);
    };

    const closeSetDoctorModal = () => {
        setIsSetDoctorModalOpen(false);
        setSelectedChild(null);
    };

    const handleSetDoctor = async (doctorId: bigint) => {
        if (!selectedChild || !selectedChild.id) {
            console.error("No child selected for setting a doctor.");
            setSuccessMessage("Failed to set doctor. No child selected.");
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
        }

        try {
            await childApi.setDoctor(selectedChild.id, doctorId); // API returns null, so no need to store response

            // Since API doesn't return updated child data, update manually if necessary
            setChildren(
                children.map((child) =>
                    child.id === selectedChild.id
                        ? { ...child, doctorId }
                        : child
                )
            );

            setSuccessMessage("Doctor set successfully!");
            closeSetDoctorModal();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error setting doctor:", error);
            setSuccessMessage("Failed to set doctor.");
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    // Loading or Access Denied
    if (isRoleLoading) {
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    if (
        userRole !== "ADMIN" &&
        userRole !== "MEMBER" &&
        userRole !== "DOCTOR"
    ) {
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

            <main className="flex-grow px-4 md:px-8 lg:px-16 py-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Child Management
                    </h1>
                    <p className="text-gray-300 mt-2">
                        Manage your site&apos;s children with ease.
                    </p>
                </div>
                <div className="mb-6 p-6 bg-[#1E1E1E] rounded-lg shadow-md">
                    {/* Admin Filter & Create Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {userRole === "MEMBER" && (
                                <button
                                    onClick={openCreateModal}
                                    className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 flex items-center gap-2"
                                >
                                    <FaPlus />
                                    <span>Create New Child</span>
                                </button>
                            )}

                            {userRole === "ADMIN" && (
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="haveDoctor">
                                        Children with Doctor
                                    </option>
                                    <option value="dontHaveDoctor">
                                        Children without Doctor
                                    </option>
                                </select>
                            )}
                        </div>

                        {/* Search */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500 text-white rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Table Container */}
                <div className="overflow-x-auto bg-[#1E1E1E] rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <>
                            {displayedChildren.length > 0 ? (
                                <table className="w-full table-auto border-collapse">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="p-4 text-left w-[5%]">
                                                #
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Name
                                            </th>
                                            <th className="p-4 text-left w-[10%]">
                                                DOB
                                            </th>
                                            <th className="p-4 text-left w-[10%]">
                                                Gender
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Parent&apos;s Name
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Doctor&apos;s Name
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Created Date
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedChildren.map(
                                            (child, index) => (
                                                <tr
                                                    key={child.id.toString()}
                                                    className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td className="p-4">
                                                        {child.name}
                                                    </td>
                                                    <td className="p-4">
                                                        {child.dob
                                                            ? new Date(
                                                                  child.dob
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                    <td className="p-4">
                                                        {child.gender}
                                                    </td>
                                                    <td className="p-4">
                                                        {child.parentName}
                                                    </td>
                                                    <td className="p-4">
                                                        {child.doctorName}
                                                    </td>
                                                    <td className="p-4">
                                                        {child.createDate
                                                            ? new Date(
                                                                  child.createDate
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                    <td className="p-4">
                                                        {/* Two-column grid for action buttons */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {userRole !==
                                                                "DOCTOR" && (
                                                                <>
                                                                    {/* Update Button */}
                                                                    <button
                                                                        onClick={() =>
                                                                            openEditModal(
                                                                                child
                                                                            )
                                                                        }
                                                                        className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition text-sm"
                                                                    >
                                                                        <FaEdit />
                                                                        Update
                                                                    </button>
                                                                    {/* Delete Button */}
                                                                    <button
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                child
                                                                            )
                                                                        }
                                                                        className="flex items-center justify-center gap-1 px-2 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition text-sm"
                                                                    >
                                                                        <FaTrash />
                                                                        Delete
                                                                    </button>
                                                                    {/* Doctor Button (Admin only, child has no doctor) */}
                                                                    {userRole ===
                                                                        "ADMIN" &&
                                                                        !child.doctorId && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    openSetDoctorModal(
                                                                                        child
                                                                                    )
                                                                                }
                                                                                className="flex items-center justify-center gap-1 px-2 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition text-sm"
                                                                            >
                                                                                <FaUserMd />
                                                                                Doctor
                                                                            </button>
                                                                        )}
                                                                </>
                                                            )}
                                                            {/* Detail Button */}
                                                            <Link
                                                                href={`/child/detail/${child.id}`}
                                                                className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition text-sm"
                                                            >
                                                                <FaInfoCircle />
                                                                Detail
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-lg text-gray-300">
                                        No children found.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {displayedChildren.length > 0 && (
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
                )}
            </main>

            {/* Create Modal */}
            <CreateModal
                isOpen={isCreateModalOpen}
                child={creatingChild}
                handleChange={(e) =>
                    setCreatingChild({
                        ...creatingChild,
                        [e.target.name]: e.target.value,
                    })
                }
                closeCreateModal={closeCreateModal}
                saveChanges={saveNewChild}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={isEditModalOpen}
                child={editingChild}
                handleChange={handleChange}
                closeEditModal={closeEditModal}
                saveChanges={saveChanges}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                child={deletingChild}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
            />

            {/* Set Doctor Modal */}
            <SetDoctorModal
                isOpen={isSetDoctorModalOpen}
                doctors={doctors}
                closeSetDoctorModal={closeSetDoctorModal}
                handleSetDoctor={handleSetDoctor}
            />

            <Footer />
        </div>
    );
}
