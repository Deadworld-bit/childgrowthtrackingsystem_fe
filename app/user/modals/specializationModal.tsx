"use client";

import React from "react";

interface SpecializationModalProps {
  isOpen: boolean;
  specialization: string;
  certificate: string;
  closeModal: () => void;
}

const SpecializationModal: React.FC<SpecializationModalProps> = ({
  isOpen,
  specialization,
  certificate,
  closeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Specialization Details</h2>
        <div className="mb-4">
          <label className="block text-sm">Specialization</label>
          <p className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
            {specialization}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm">Certificate</label>
          <div className="w-full h-auto border border-gray-600 rounded overflow-hidden">
            <img
              src={certificate}
              alt="Certificate"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecializationModal;