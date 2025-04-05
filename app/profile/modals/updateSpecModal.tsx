"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface UpdateDoctorModalProps {
  isOpen: boolean;
  doctor: {
    id: bigint;
    specialization: string;
    certificate: string;
  } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  closeUpdateModal: () => void;
  saveChanges: () => void;
}

const UpdateDoctorModal: React.FC<UpdateDoctorModalProps> = ({
  isOpen,
  doctor,
  handleChange,
  closeUpdateModal,
  saveChanges,
}) => {
  const [specializationError, setSpecializationError] = useState<string | null>(null);
  const [certificateUrlError, setCertificateUrlError] = useState<string | null>(null);

  // Validate the certificate URL
  const validateCertificateUrl = (url: string) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      setCertificateUrlError("Invalid URL format");
    } else {
      setCertificateUrlError(null);
    }
  };

  // Handle changes in specialization and certificate URL fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "certificateUrl") {
      validateCertificateUrl(e.target.value);
    }
    handleChange(e);
  };

  useEffect(() => {
    if (doctor) {
      setSpecializationError(null); // Reset errors when doctor data changes
      setCertificateUrlError(null);
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

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
        <h2 className="text-2xl font-bold mb-6 text-center">Update Doctor Profile</h2>

        {/* Specialization Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={doctor.specialization}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {specializationError && (
            <p className="text-red-500 text-sm mt-1">{specializationError}</p>
          )}
        </div>

        {/* Certificate URL Field */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Certificate URL</label>
          <input
            type="url"
            name="certificate"
            value={doctor.certificate}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {certificateUrlError && (
            <p className="text-red-500 text-sm mt-1">{certificateUrlError}</p>
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
            disabled={!!specializationError || !!certificateUrlError}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctorModal;
