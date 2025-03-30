"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface CreateUserModalProps {
  isOpen: boolean;
  user: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  closeModal: () => void;
  createUser: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  user,
  handleChange,
  closeModal,
  createUser,
}) => {
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (user.email) {
      validateEmail(user.email);
    }
  }, [user.email]);

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

  // Function to remove readonly on focus
  const removeReadOnly = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.removeAttribute("readOnly");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-gray-900 text-white rounded-lg shadow-lg ring-1 ring-white ring-opacity-5 transform transition-all">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Wrap in a form with autocomplete off */}
        <form autoComplete="off">
          {/* Hidden dummy inputs */}
          <input
            type="text"
            name="dummy-username"
            style={{ display: "none" }}
            autoComplete="username"
          />
          <input
            type="password"
            name="dummy-password"
            style={{ display: "none" }}
            autoComplete="new-password"
          />

          {/* Modal Title */}
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create New User
          </h2>

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={user.username || ""}
              onChange={handleInputChange}
              readOnly
              onFocus={removeReadOnly}
              autoComplete="off"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email || ""}
              onChange={handleInputChange}
              readOnly
              onFocus={removeReadOnly}
              autoComplete="off"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={user.password || ""}
              onChange={handleInputChange}
              readOnly
              onFocus={removeReadOnly}
              autoComplete="new-password"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Field */}
          <div className="mb-6">
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role"
              value={user.role}
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DOCTOR">DOCTOR</option>
              <option value="MEMBER">MEMBER</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={createUser}
              type="button"
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              disabled={!!emailError}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
