"use client";

import React from "react";

interface MembershipPlan {
    id: BigInt;
    name: string;
}

interface ActivateModalProps {
    isOpen: boolean;
    membershipPlan: MembershipPlan | null;
    closeActiveModal: () => void;
    handleActivate: () => void;
}

const ActivateModal: React.FC<ActivateModalProps> = ({
    isOpen,
    membershipPlan,
    closeActiveModal,
    handleActivate,
}) => {
    if (!isOpen || !membershipPlan) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Confirm Activate</h2>
                <p className="mb-4">
                    Are you sure you want to activate{" "}
                    <strong>{membershipPlan.name}</strong>?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeActiveModal}
                        className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleActivate}
                        className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition text-white"
                    >
                        Activate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivateModal;
