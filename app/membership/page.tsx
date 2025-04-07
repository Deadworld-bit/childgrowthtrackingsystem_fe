"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import membershipPlanApi, { MembershipPlan } from "@/app/api/membership";
import userApi from "@/app/api/user";
import CreateMembershipPlanModal from "@/app/membership/modals/createModal";
import EditMembershipPlanModal from "@/app/membership/modals/updateModal";
import DisableModal from "@/app/membership/modals/disableModal";
import ActivateModal from "@/app/membership/modals/activeModal";
import Cookies from "js-cookie";
import Link from "next/link";

const MEMBERSHIPS_PER_PAGE = 6;

export default function MembershipPage() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [disablePlan, setDisablePlan] = useState<MembershipPlan | null>(null);
    const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
    const [activePlan, setActivePlan] = useState<MembershipPlan | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Fetch user's role from API using userId from cookie
    useEffect(() => {
        const fetchUserRole = async () => {
            const userCookie = Cookies.get("user");
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    const userId = BigInt(parsedUser.id);
                    const response = await userApi.getUserById(userId);
                    if (response.status === "ok" || response.status === "success") {
                        setUserRole(response.data.role);
                    } else {
                        setErrorMessage(response.message);
                        setTimeout(() => setErrorMessage(null), 3000);
                        console.error(
                            "Error fetching user role:",
                            response.message
                        );
                    }
                } catch (err) {
                    console.error("Error fetching user role from API:", err);
                }
            }
            setIsRoleLoading(false);
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        fetchPlans();
    }, []);

    // Fetch plans from API
    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            let response;
            response = await membershipPlanApi.getMembershipPlans();
            if (response.status === "ok" || response.status === "success") {
                setPlans(response.data);
            } else {
                setErrorMessage(response.message);
                setTimeout(() => setErrorMessage(null), 3000);
                console.error("Error fetching plans:", response.message);
                setPlans([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination
    const startIndex = (currentPage - 1) * MEMBERSHIPS_PER_PAGE;
    const filteredPlans = plans.filter(
        (plans) =>
            plans.name &&
            plans.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedPlans = filteredPlans.slice(
        startIndex,
        startIndex + MEMBERSHIPS_PER_PAGE
    );
    const totalPages = Math.ceil(filteredPlans.length / MEMBERSHIPS_PER_PAGE);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    //Create Modal
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const handleCreate = async (planData: {
        name: string;
        description: string;
        features: string;
        maxChildren: number;
        annualPrice: number;
        duration: number;
    }) => {
        try {
            const response = await membershipPlanApi.createMembershipPlan(
                planData as MembershipPlan
            );
            if (response.status === "ok" || response.status === "success") {
                setPlans([response.data, ...plans]);
                setSuccessMessage("Plan created successfully!");
                closeCreateModal();
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                setErrorMessage(response.message);
                closeCreateModal();
                setTimeout(() => setErrorMessage(null), 3000);
                console.error("Error creating plan:", response.message);
            }
        } catch (error) {
            console.error("Error creating plan:", error);
        }
    };

    // Edit Modal
    const openEditModal = (plan: MembershipPlan) => {
        setEditingPlan(plan);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingPlan(null);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        if (!editingPlan) return;
        const { name, value } = e.target;
        setEditingPlan({ ...editingPlan, [name]: value });
    };

    const saveChanges = async () => {
        if (editingPlan) {
            try {
                const response = await membershipPlanApi.updateMembershipPlan(
                    editingPlan.id,
                    editingPlan
                );
                if (response.status === "ok" || response.status === "success") {
                    setPlans(
                        plans.map((plan) =>
                            plan.id === response.data.id ? response.data : plan
                        )
                    );
                    setSuccessMessage("Plan updated successfully!");
                    closeEditModal();
                    setTimeout(() => setSuccessMessage(null), 3000);
                } else {
                    setErrorMessage(response.message);
                    closeEditModal();
                    setTimeout(() => setErrorMessage(null), 3000);
                    console.error("Error updating plan:", response.message);
                }
            } catch (error) {
                console.error("Error updating plan:", error);
            }
        }
    };

    // Active Modal
    const openActiveModal = (plan: MembershipPlan) => {
        setActivePlan(plan);
        setIsActiveModalOpen(true);
    };

    const closeActiveModal = () => {
        setIsActiveModalOpen(false);
        setActivePlan(null);
    };

    const handleActive = async () => {
        if (activePlan) {
            try {
                const response = await membershipPlanApi.activeMembershipPlan(
                    activePlan.id
                );
                if (response.status === "ok" || response.status === "success") {
                    setPlans(
                        plans.map((plan) =>
                            plan.id === activePlan.id
                                ? { ...plan, status: true }
                                : plan
                        )
                    );
                    setSuccessMessage("Plan activated successfully!");
                    closeActiveModal();
                    setTimeout(() => setSuccessMessage(null), 3000);
                } else {
                    setErrorMessage(response.message);
                    closeActiveModal();
                    setTimeout(() => setErrorMessage(null), 3000);
                    console.error("Error activating plan:", response.message);
                }
            } catch (error) {
                console.error("Error activating plan:", error);
            }
        }
    };

    // Disable Modal
    const openDisableModal = (plan: MembershipPlan) => {
        setDisablePlan(plan);
        setIsDisableModalOpen(true);
    };

    const closeDisableModal = () => {
        setIsDisableModalOpen(false);
        setDisablePlan(null);
    };

    const handleDisable = async () => {
        if (disablePlan) {
            try {
                const response = await membershipPlanApi.disableMembershipPlan(
                    disablePlan.id
                );
                if (response.status === "ok" || response.status === "success") {
                    setPlans(
                        plans.map((plan) =>
                            plan.id === disablePlan.id
                                ? { ...plan, status: false }
                                : plan
                        )
                    );
                    setSuccessMessage("Plan disabled successfully!");
                    closeDisableModal();
                    setTimeout(() => setSuccessMessage(null), 3000);
                } else {
                    setErrorMessage(response.message);
                    closeDisableModal();
                    setTimeout(() => setErrorMessage(null), 3000);
                    console.error("Error disable plan:", response.message);
                }
            } catch (error) {
                console.error("Error disable plan:", error);
            }
        }
    };

    if (isRoleLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
                <h1 className="text-3xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

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
                <div className="mb-6 ">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Membership Management
                    </h1>
                    <p className="text-gray-300 mt-2">
                        Manage your site&apos;s membership plans with ease.
                    </p>
                </div>

                {/* Filter & Search */}
                <div className="mb-6 p-6 bg-[#1E1E1E] rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                        >
                            + Create Plan
                        </button>
                        <form autoComplete="off">
                            <input
                                type="text"
                                name="hidden-field"
                                style={{ display: "none" }}
                                autoComplete="name"
                            />
                            <input
                                type="text"
                                name="user-search"
                                autoComplete="off"
                                placeholder="Search by name"
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

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-500 rounded-lg text-white">
                        {errorMessage}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto bg-[#1E1E1E] rounded-lg shadow-md">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading...</p>
                        </div>
                    ) : displayedPlans.length > 0 ? (
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="p-4 text-left w-[5%]">#</th>
                                    <th className="p-4 text-left w-[10%]">
                                        Name
                                    </th>
                                    <th className="p-4 text-left w-[15%]">
                                        Description
                                    </th>
                                    <th className="p-4 text-left w-[15%]">
                                        Features
                                    </th>
                                    <th className="p-4 text-left w-[10%]">
                                        Create Date
                                    </th>
                                    <th className="p-4 text-left w-[10%]">
                                        Max Children
                                    </th>
                                    <th className="p-4 text-left w-[10%]">
                                        Annual Price
                                    </th>
                                    <th className="p-4 text-left w-[5%]">
                                        Duration
                                    </th>
                                    <th className="p-4 text-left w-[5%]">
                                        Status
                                    </th>
                                    <th className="p-4 text-left w-[15%]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedPlans.map((plan, index) => (
                                    <tr
                                        key={plan.id.toString()}
                                        className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="p-4">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="p-4">{plan.name}</td>
                                        <td className="p-4">
                                            {plan.description}
                                        </td>
                                        <td className="p-4">
                                            <ul className="list-disc list-inside">
                                                {plan.features
                                                    .split(",")
                                                    .map((feat, i) => (
                                                        <li key={i}>
                                                            {feat.trim()}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </td>
                                        <td className="p-4">
                                            {plan.createdDate
                                                ? new Date(
                                                      plan.createdDate
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td className="p-4">
                                            {plan.maxChildren}
                                        </td>
                                        <td className="p-4">
                                            {plan.annualPrice} VND
                                        </td>
                                        <td className="p-4">
                                            {plan.duration} days
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    plan.status
                                                        ? "bg-green-600 text-white"
                                                        : "bg-red-600 text-white"
                                                }`}
                                            >
                                                {plan.status
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(plan)
                                                    }
                                                    className="flex items-center justify-center gap-2 px-2 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition text-sm"
                                                >
                                                    <FaEdit />
                                                    Update
                                                </button>
                                                {plan.status ? (
                                                    <button
                                                        onClick={() =>
                                                            openDisableModal(
                                                                plan
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 px-2 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition text-sm"
                                                    >
                                                        <FaTrash />
                                                        Disable
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            openActiveModal(
                                                                plan
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 px-2 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition text-sm"
                                                    >
                                                        <FaCheckCircle />
                                                        Activate
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
            <CreateMembershipPlanModal
                isOpen={isCreateModalOpen}
                closeModal={closeCreateModal}
                createPlan={handleCreate}
            />
            <EditMembershipPlanModal
                isOpen={isEditModalOpen}
                plan={editingPlan!}
                handleChange={handleChange}
                closeEditModal={closeEditModal}
                saveChanges={saveChanges}
            />
            <DisableModal
                isOpen={isDisableModalOpen}
                membershipPlan={disablePlan}
                closeDisableModal={closeDisableModal}
                handleDisable={handleDisable}
            />
            <ActivateModal
                isOpen={isActiveModalOpen}
                membershipPlan={activePlan}
                closeActiveModal={closeActiveModal}
                handleActivate={handleActive}
            />
            <Footer />
        </div>
    );
}
