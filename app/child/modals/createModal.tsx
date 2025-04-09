import React, { useState, useEffect } from "react";

interface EditModalProps {
    isOpen: boolean;
    child: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    closeCreateModal: () => void;
    saveChanges: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    child,
    handleChange,
    closeCreateModal,
    saveChanges,
}) => {
    const [nameError, setNameError] = useState("");
    const [dobError, setDobError] = useState("");

    // Validate Name
    const validateName = (name: string) => {
        if (!name || name.trim() === "") {
            setNameError("Name cannot be empty.");
        } else {
            setNameError("");
        }
    };

    // Validate DOB
    const validateDOB = (dob: string) => {
        if (!dob) {
            setDobError("Date of birth cannot be empty.");
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(dob);
        const age = currentDate.getFullYear() - selectedDate.getFullYear();
        const monthDiff = currentDate.getMonth() - selectedDate.getMonth();
        const dayDiff = currentDate.getDate() - selectedDate.getDate();

        if (selectedDate > currentDate) {
            setDobError("Date of birth cannot be in the future.");
        } else if (
            age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff > 0)))
        ) {
            setDobError("The child must be under 18 years old.");
        } else {
            setDobError("");
        }
    };

    // Handle Name changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        validateName(e.target.value);
    };

    // Handle DOB changes
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        validateDOB(e.target.value);
    };

    // Validate fields when modal opens or child data changes
    useEffect(() => {
        validateName(child.name);
        validateDOB(child.dob);
    }, [child.name, child.dob]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Create Child</h2>
                <div className="mb-4">
                    <label className="block text-sm">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={child.name || ""}
                        onChange={handleNameChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm">DOB</label>
                    <input
                        type="date"
                        name="dob"
                        value={child.dob || ""}
                        onChange={handleDateChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm">Gender</label>
                    <select
                        name="gender"
                        value={child.gender}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
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
                        onClick={saveChanges}
                        disabled={!!nameError || !!dobError}
                        className={`px-4 py-2 rounded-lg text-white ${nameError || dobError ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;