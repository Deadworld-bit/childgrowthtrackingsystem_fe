"use client";

import React from "react";

interface EditModalProps {
  isOpen: boolean;
  user: { id: BigInt; userName: string; email: string, role: string, membership: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  closeEditModal: () => void;
  saveChanges: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, user, handleChange, closeEditModal, saveChanges }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Update User</h2>

        <div className="mb-4">
          <label className="block text-sm">Name</label>
          <input
            type="text"
            name="userName"
            value={user.userName}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DOCTOR">DOCTOR</option>
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm">Membership</label>
          <select
            name="membership"
            value={user.membership}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BASIC">BASIC</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
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