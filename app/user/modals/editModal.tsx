"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface EditModalProps {
  isOpen: boolean;
  user:
    | {
        id: bigint;
        username: string;
        email: string;
        role: string;
        membership: string;
      }
    | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  closeEditModal: () => void;
  saveChanges: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  user,
  handleChange,
  closeEditModal,
  saveChanges,
}) => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleChange(e);
    if (e.target.name === "email") {
      validateEmail(e.target.value);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-gray-900 text-white rounded-lg shadow-lg ring-1 ring-white ring-opacity-5 transform transition-all">
        {/* Close Button */}
        <button
          onClick={closeEditModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">Update User</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Role Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Role</label>
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

        {/* Membership Field */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Membership</label>
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={closeEditModal}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            disabled={!!emailError} // Disable if invalid email
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
