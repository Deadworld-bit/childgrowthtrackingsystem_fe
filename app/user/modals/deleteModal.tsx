import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  user: { id: string; name: string } | null;
  closeDeleteModal: () => void;
  handleDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, user, closeDeleteModal, handleDelete }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">
          Are you sure you want to delete <strong>{user.name}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
