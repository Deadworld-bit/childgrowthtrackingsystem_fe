import React, { useState } from "react";

interface CreateModalProps {
    isOpen: boolean;
    child: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeCreateModal: () => void;
    saveChanges: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
    isOpen,
    child,
    handleChange,
    closeCreateModal,
    saveChanges,
}) => {
    const [error, setError] = useState("");

    const validateDOB = (dob: string) => {
        const today = new Date();
        const dobDate = new Date(dob);
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(today.getFullYear() - 18);

        if (dobDate > today) {
            setError("Date of birth cannot be in the future.");
            return false;
        } else if (dobDate < new Date(maxAgeDate.setDate(maxAgeDate.getDate() + 1))) {
            setError("Child must be under 18 years old.");
            return false;
        }
        setError("");
        return true;
    };

    const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        validateDOB(e.target.value);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Create New Child</h2>
                    <div className="mb-4">
                        <label className="block text-sm">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={child.name || ""}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm">DOB</label>
                        <input
                            type="date"
                            name="dob"
                            value={child.dob || ""}
                            onChange={handleDOBChange}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm">Gender</label>
                        <select
                            name="gender"
                            value={child.gender || ""}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={closeCreateModal}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (validateDOB(child.dob)) saveChanges();
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            disabled={!!error}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default CreateModal;
