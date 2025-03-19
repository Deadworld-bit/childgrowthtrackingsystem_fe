"use client";

import React, { useState, useEffect } from "react";

interface EditModalProps {
  isOpen: boolean;
  user: { id: BigInt; username: string; email: string, role: string, membership: string} | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  closeEditModal: () => void;
  saveChanges: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, user, handleChange, closeEditModal, saveChanges }) => {
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      validateEmail(user.email);
    }
  }, [user?.email]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChange(e);
    if (e.target.name === "email") {
      validateEmail(e.target.value);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Update User</h2>

        <div className="mb-4">
          <label className="block text-sm">Name</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            disabled={!!emailError} // Disable save button if email is invalid
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;