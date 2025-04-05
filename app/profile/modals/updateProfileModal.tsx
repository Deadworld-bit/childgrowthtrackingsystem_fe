"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

interface UpdateProfileModalProps {
  isOpen: boolean;
  user: {
    id: bigint;
    username: string;
    email: string;
    password: string;
  } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  closeUpdateModal: () => void;
  saveChanges: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isOpen,
  user,
  handleChange,
  closeUpdateModal,
  saveChanges,
}) => {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      validateEmail(user.email);
      setConfirmPassword(""); 
    }
  }, [user?.email]);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);
    }
  };

  // Check password security
  const isPasswordSecure = (password: string) => {
    const minLength = 10;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  // Generate a secure random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let generatedPassword = "";
    for (let i = 0; i < 12; i++) {
      generatedPassword += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }
    setSuggestedPassword(generatedPassword);
  };

  // Handle changes on username, email and password fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      validateEmail(e.target.value);
    }
    if (e.target.name === "password") {
      if (!isPasswordSecure(e.target.value)) {
        setPasswordError(
          "Password must be at least 10 characters long and include uppercase, lowercase, numbers, and special characters."
        );
      } else {
        setPasswordError(null);
      }
    }
    handleChange(e);
  };

  // Handle confirm password field separately
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  // Check if confirm password matches the new password
  const isConfirmPasswordValid = () => {
    if (user && user.password && confirmPassword) {
      return user.password === confirmPassword;
    }
    return true;
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={closeUpdateModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Username</label>
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

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          {suggestedPassword && (
            <p className="text-sm text-gray-400 mt-2">
              Suggested Password:{" "}
              <span
                className="text-green-400 cursor-pointer hover:underline"
                onClick={() => {
                  const syntheticEvent = {
                    target: {
                      name: "password",
                      value: suggestedPassword,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(syntheticEvent);
                }}
              >
                {suggestedPassword}
              </span>
            </p>
          )}
          <button
            type="button"
            onClick={generatePassword}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            Generate a secure password
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {confirmPassword && !isConfirmPasswordValid() && (
            <p className="text-red-500 text-sm mt-1">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={closeUpdateModal}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            disabled={!!emailError || !!passwordError || !isConfirmPasswordValid()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
