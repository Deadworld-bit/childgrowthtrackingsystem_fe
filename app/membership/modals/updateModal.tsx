"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MembershipPlan } from "@/app/api/membership";

interface EditMembershipPlanModalProps {
  isOpen: boolean;
  plan: MembershipPlan | null;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  closeEditModal: () => void;
  saveChanges: () => void;
}

export default function EditMembershipPlanModal({
  isOpen,
  plan,
  handleChange,
  closeEditModal,
  saveChanges,
}: EditMembershipPlanModalProps) {
  const [localFeatures, setLocalFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    maxChildren?: string;
    annualPrice?: string;
    duration?: string;
  }>({});

  useEffect(() => {
    if (plan) {
      setLocalFeatures(
        plan.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      );
    }
  }, [plan?.features]);

  useEffect(() => {
    const fakeEvent = {
      target: { name: "features", value: localFeatures.join(",") },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(fakeEvent);
  }, [localFeatures]);

  const onFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      setLocalFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setLocalFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateField = (name: string, value: any) => {
    let error: string | undefined;

    if (name === "name" && !value.trim()) {
      error = "Name is required.";
    } else if (name === "maxChildren" || name === "duration") {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        error = "Must be 0 or greater.";
      } else if (!Number.isInteger(numValue)) {
        error = "Must be a whole number.";
      }
    } else if (name === "annualPrice") {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        error = "Must be 0 or greater.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChange(e);
    validateField(e.target.name, e.target.value);
  };

  const handleSave = () => {
    const errs: typeof errors = {};

    errs.name = validateField("name", plan?.name);
    errs.maxChildren = validateField("maxChildren", plan?.maxChildren);
    errs.annualPrice = validateField("annualPrice", plan?.annualPrice);
    errs.duration = validateField("duration", plan?.duration);

    if (Object.values(errs).some((err) => err)) {
      setErrors(errs);
      return;
    }

    saveChanges();
    setErrors({});
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <button
          onClick={closeEditModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <FaTimes size={18} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Membership Plan
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={plan.name}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={plan.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>

        {/* Features */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Features</label>
          <ul className="flex flex-wrap gap-2 mb-2">
            {localFeatures.map((feat, i) => (
              <li
                key={i}
                className="flex items-center bg-blue-600 text-white px-2 py-1 rounded"
              >
                {feat}
                <button
                  onClick={() => removeFeature(i)}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={onFeatureKeyDown}
            placeholder="Type a feature and press Enter"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>

        {/* Max Children */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Max Children</label>
          <input
            type="number"
            name="maxChildren"
            value={plan.maxChildren}
            onChange={handleInputChange}
            min={0}
            step={1}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          {errors.maxChildren && (
            <p className="text-red-400 text-sm mt-1">{errors.maxChildren}</p>
          )}
        </div>

        {/* Annual Price */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Annual Price (VND)</label>
          <input
            type="number"
            name="annualPrice"
            value={plan.annualPrice}
            onChange={handleInputChange}
            min={0}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          {errors.annualPrice && (
            <p className="text-red-400 text-sm mt-1">{errors.annualPrice}</p>
          )}
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={plan.duration}
            onChange={handleInputChange}
            min={0}
            step={1}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
          {errors.duration && (
            <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={closeEditModal}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}