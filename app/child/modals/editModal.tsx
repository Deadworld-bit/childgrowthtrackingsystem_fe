import React from "react";

interface EditModalProps {
    isOpen: boolean;
    child: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    closeEditModal: () => void;
    saveChanges: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    child,
    handleChange,
    closeEditModal,
    saveChanges,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Update Child</h2>
                <div className="mb-4">
                    <label className="block text-sm">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={child.name}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm">DOB</label>
                    <input
                        type="date"
                        name="dob"
                        value={child.dob}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm">Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={child.gender}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm">Parent's Name</label>
                    <input
                        type="text"
                        name="parentName"
                        value={child.parentName}
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
    );
};

export default EditModal;