import React from "react";
import { User } from "@/app/api/user";

interface ProfileModalProps {
    isOpen: boolean;
    user: User | null;
    closeModal: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, user, closeModal }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">User Profile</h2>
                    <button onClick={closeModal} className="text-red-500 hover:text-red-700">X</button>
                </div>
                <div className="flex flex-col items-center">
                    <img src="/neutral.png" alt="Avatar" className="w-24 h-24 rounded-full mb-4 border-2 border-gray-600" />
                    <p className="mb-2"><strong>Name:</strong> {user.userName}</p>
                    <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-2"><strong>Role:</strong> {user.role}</p>
                    <p className="mb-2"><strong>Membership:</strong> {user.membership}</p>
                    <p className="mb-2"><strong>Created Date:</strong> {new Date(user.createdDate).toLocaleDateString()}</p>
                    <p className="mb-2"><strong>Updated Date:</strong> {new Date(user.updatedDate).toLocaleDateString()}</p>
                    <p className="mb-2"><strong>Status:</strong> {user.status ? "Active" : "Inactive"}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;