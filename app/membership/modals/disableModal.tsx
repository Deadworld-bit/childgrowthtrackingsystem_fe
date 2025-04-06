"use client";

import React from "react";

interface MembershipPlan {
    id: BigInt;
    name: string;
}

interface DisableModalProps {
    isOpen: boolean;
    membershipPlan: MembershipPlan | null;
    closeDisableModal: () => void;
    handleDisable: () => void;
}

const DisableModal: React.FC<DisableModalProps> = ({
    isOpen,
    membershipPlan,
    closeDisableModal,
    handleDisable,
}) => {
    if (!isOpen || !membershipPlan) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Confirm Disable</h2>
                <p className="mb-4">
                    Are you sure you want to disable{" "}
                    <strong>{membershipPlan.name}</strong>?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeDisableModal}
                        className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDisable}
                        className="px-4 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition text-white"
                    >
                        Disable
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisableModal;
