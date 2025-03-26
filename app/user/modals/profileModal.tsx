"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "@/app/api/user";

interface ProfileModalProps {
  isOpen: boolean;
  user: User | null;
  closeModal: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  closeModal,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      {/* Modal Container with a gradient background */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg ring-1 ring-white ring-opacity-5 p-6">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section: Avatar */}
          <div className="flex flex-col items-center md:items-start md:w-1/3">
            <img
              src="/neutral.png"
              alt="Avatar"
              className="w-32 h-32 rounded-full mb-4 border-4 border-gray-700 shadow-lg"
            />
            <h2 className="text-2xl font-semibold text-center md:text-left">
              {user.username}
            </h2>
            <p className="text-gray-300 text-sm text-center md:text-left">
              {user.email}
            </p>
          </div>

          {/* Right Section: User Details */}
          <div className="md:w-2/3 space-y-4">
            <h3 className="text-xl font-bold border-b border-gray-700 pb-2">
              Profile Information
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <ProfileItem label="Role" value={user.role} />
              <ProfileItem label="Membership" value={user.membership} />
              <ProfileItem
                label="Created"
                value={new Date(user.createdDate).toLocaleDateString()}
              />
              <ProfileItem
                label="Updated"
                value={new Date(user.updateDate).toLocaleDateString()}
              />
              <ProfileItem
                label="Status"
                value={user.status ? "Active" : "Inactive"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * A small reusable component for displaying a label-value pair.
 */
const ProfileItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <span className="text-gray-400 uppercase text-xs tracking-wider">
      {label}
    </span>
    <span className="text-white">{value}</span>
  </div>
);

export default ProfileModal;
