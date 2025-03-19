"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaPlus } from "react-icons/fa";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import Link from "next/link";
import EditModal from "./modals/editModal";
import DeleteModal from "./modals/deleteModal";
import CreateModal from "./modals/createModal"; // Import CreateModal
import childApi, { Child } from "@/app/api/child";
import Cookies from "js-cookie";

const USERS_PER_PAGE = 9;

export default function ChildPage() {
    const [children, setChildren] = useState<Child[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for Create Modal
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [deletingChild, setDeletingChild] = useState<Child | null>(null);
    const [creatingChild, setCreatingChild] = useState<Partial<Child>>({}); // State for new child
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("haveDoctor"); // New state for filter
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
    const totalPages = Math.ceil(children.length / USERS_PER_PAGE);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // State to store user ID
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    // Fetch user's role and ID from cookies
    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserRole(parsedUser.role); // Assuming the user object has a `role` property
            setUserId(parsedUser.id); // Assuming the user object has an `id` property
        }
        setIsRoleLoading(false); // Role check is complete
    }, []);

    useEffect(() => {
        fetchChildren();
    }, [filter, userRole, userId]);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            let data: Child[] = [];
            if (userRole === "ADMIN") {
                // ADMIN fetches children based on filter
                data =
                    filter === "haveDoctor"
                        ? await childApi.getChildHaveDoctor()
                        : await childApi.getChildDontHaveDoctor();
            } else if (userRole === "MEMBER" && userId) {
                // MEMBER fetches children by parent ID
                data = await childApi.getChildByParentId(BigInt(userId));
            }
            setChildren(data);
        } catch (error) {
            console.error("Error fetching children:", error);
            setChildren([]); // Set children to an empty array in case of error
        } finally {
            setIsLoading(false);
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

    // Open Create Modal
    const openCreateModal = () => {
        setCreatingChild({});
        setIsCreateModalOpen(true);
    };

    // Close Create Modal
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreatingChild({});
    };

    // Handle Create Change
    const handleCreateChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setCreatingChild({ ...creatingChild, [e.target.name]: e.target.value });
    };

    // Save New Child
    const saveNewChild = async () => {
        try {
            const newChild = await childApi.createChild(creatingChild as Child);
            setChildren([...children, newChild]);
            setSuccessMessage("Child created successfully!");
            closeCreateModal();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error creating child:", error);
        }
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
                setChildren(
                    children.filter((child) => child.id !== deletingChild.id)
                );
                setSuccessMessage("Child deleted successfully!");
                closeDeleteModal();
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                console.error("Error deleting child:", error);
            }
        }
    };

    if (isRoleLoading) {
        // Show a loading spinner or placeholder while determining the user's role
        return (
            <div className="flex flex-col min-h-screen text-white items-center justify-center bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    if (userRole !== "ADMIN" && userRole !== "MEMBER" && userRole !== "DOCTOR") {
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
                    Child Management
                </h1>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                        {/* Hide Create Button for DOCTOR */}
                        {userRole !== "DOCTOR" && (
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                            >
                                <FaPlus /> Create New Child
                            </button>
                        )}
                        {userRole === "ADMIN" && (
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            {displayedChildren.length > 0 ? (
                                <table className="w-full table-auto border border-gray-600 bg-[#1E1E1E] shadow-lg">
                                    <thead className="bg-gray-800 text-white text-lg">
                                        <tr>
                                            <th className="p-4 text-left w-[5%]">
                                                #
                                            </th>
                                            <th className="p-4 text-left w-[20%]">
                                                Name
                                            </th>
                                            <th className="p-4 text-left w-[15%]">
                                                DOB
                                            </th>
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
                                        {displayedChildren.map(
                                            (child, index) => (
                                                <tr
                                                    key={child.id.toString()}
                                                    className="border-b border-gray-600 bg-[#2D2D2D] hover:bg-[#3A3A3A]"
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
                                                        {child.createDate
                                                            ? new Date(
                                                                  child.createDate
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                    <td className="p-4 flex gap-3">
                                                        {/* Hide Update and Delete Buttons for DOCTOR */}
                                                        {userRole !== "DOCTOR" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            child
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                                                >
                                                                    <FaEdit />{" "}
                                                                    Update
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        openDeleteModal(
                                                                            child
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                                                                >
                                                                    <FaTrash />{" "}
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                        <Link
                                                            href={`/child/detail/${child.id}`}
                                                        >
                                                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
                                                                <FaInfoCircle />{" "}
                                                                Detail
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-lg">
                                        No children found.
                                    </p>
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

            {/* Create Modal */}
            <CreateModal
                isOpen={isCreateModalOpen}
                child={creatingChild}
                handleChange={handleCreateChange}
                closeCreateModal={closeCreateModal}
                saveChanges={saveNewChild}
            />

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