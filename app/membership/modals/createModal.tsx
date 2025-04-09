"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface CreateMembershipPlanModalProps {
    isOpen: boolean;
    closeModal: () => void;
    createPlan: (plan: {
        name: string;
        description: string;
        features: string;
        maxChildren: number;
        annualPrice: number;
        duration: number;
    }) => void;
}

export default function CreateMembershipPlanModal({
    isOpen,
    closeModal,
    createPlan,
}: CreateMembershipPlanModalProps) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        features: "",
        maxChildren: 0,
        annualPrice: 0,
        duration: 0,
    });

    const [localFeatures, setLocalFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        maxChildren?: string;
        annualPrice?: string;
        duration?: string;
    }>({});

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "name"
                    ? value.toUpperCase()
                    : name === "description" || name === "features"
                    ? value 
                    : Number(value), 
        }));
        setErrors((errs) => ({ ...errs, [name]: undefined }));
    };

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

    const handleSubmit = () => {
        const errs: typeof errors = {};
        if (!form.name || !form.name.trim()) {
            errs.name = "Name is required.";
        }
        if (form.maxChildren < 0) errs.maxChildren = "Must be 0 or greater.";
        else if (!Number.isInteger(form.maxChildren))
            errs.maxChildren = "Must be a whole number.";

        if (form.annualPrice < 0) errs.annualPrice = "Must be 0 or greater.";

        if (form.duration < 0) errs.duration = "Must be 0 or greater.";
        else if (!Number.isInteger(form.duration))
            errs.duration = "Must be a whole number.";

        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        createPlan({
            ...form,
            features: localFeatures.join(","),
        });

        // reset
        setForm({
            name: "",
            description: "",
            features: "",
            maxChildren: 0,
            annualPrice: 0,
            duration: 0,
        });
        setLocalFeatures([]);
        closeModal();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg p-6 bg-gray-900 text-white rounded-lg shadow-lg">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                >
                    <FaTimes size={18} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Membership Plan
                </h2>

                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                    {errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
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
                        value={form.maxChildren}
                        onChange={handleChange}
                        min={0}
                        step={1}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                    {errors.maxChildren && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.maxChildren}
                        </p>
                    )}
                </div>

                {/* Annual Price */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">
                        Annual Price (VND)
                    </label>
                    <input
                        type="number"
                        name="annualPrice"
                        value={form.annualPrice}
                        onChange={handleChange}
                        min={0}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                    {errors.annualPrice && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.annualPrice}
                        </p>
                    )}
                </div>

                {/* Duration */}
                <div className="mb-6">
                    <label className="block text-sm mb-1">
                        Duration (days)
                    </label>
                    <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        min={0}
                        step={1}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    />
                    {errors.duration && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.duration}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}