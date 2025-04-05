"use client";

import React, { useState } from "react";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

type Membership = {
  id: bigint;
  name: string;
  description: string;
  features: string[];
  annual_price: number;
  duration: number;
  max_children: number;
  status: "active" | "inactive";
  created_date: Date;
  update_date: Date;
};

let nextId = BigInt(1); // Simple counter for generating new IDs

export default function MembershipPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([
    {
      id: nextId++,
      name: "Gold Plan",
      description: "Access to all premium features",
      features: ["Unlimited access", "Priority support"],
      annual_price: 120,
      duration: 12,
      max_children: 3,
      status: "active",
      created_date: new Date(),
      update_date: new Date(),
    },
  ]);

  const initialForm = {
    name: "",
    description: "",
    features: [] as string[],
    annual_price: 0,
    duration: 0,
    max_children: 0,
    status: "active" as "active" | "inactive",
  };

  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "features") {
      setForm({ ...form, features: value.split(",").map((f) => f.trim()) });
    } else if (["annual_price", "duration", "max_children"].includes(name)) {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId !== null) {
      // Update membership
      setMemberships((prev) =>
        prev.map((m) =>
          m.id === editId ? { ...m, ...form, update_date: new Date() } : m
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add new membership
      const newMembership: Membership = {
        ...form,
        id: nextId++,
        created_date: new Date(),
        update_date: new Date(),
      };
      setMemberships((prev) => [...prev, newMembership]);
    }

    setForm(initialForm);
  };

  const handleEdit = (membership: Membership) => {
    setIsEditing(true);
    setEditId(membership.id);
    setForm({
      name: membership.name,
      description: membership.description,
      features: membership.features,
      annual_price: membership.annual_price,
      duration: membership.duration,
      max_children: membership.max_children,
      status: membership.status,
    });
  };

  const handleDelete = (id: bigint) => {
    setMemberships((prev) => prev.filter((m) => m.id !== id));
    if (isEditing && editId === id) {
      setIsEditing(false);
      setEditId(null);
      setForm(initialForm);
    }
  };

  const handleView = (membership: Membership) => {
    setSelectedMembership(membership);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
        <Navbar />
        <header className="bg-white dark:bg-gray-800 shadow py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
            <h1 className="text-3xl font-bold">Membership Management</h1>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Membership" : "Add Membership"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Membership Name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Annual Price</label>
                <input
                  type="number"
                  name="annual_price"
                  placeholder="Annual Price"
                  value={form.annual_price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (months)"
                  value={form.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Max Children</label>
                <input
                  type="number"
                  name="max_children"
                  placeholder="Max Children"
                  value={form.max_children}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Features</label>
                <input
                  type="text"
                  name="features"
                  placeholder="Features (comma separated)"
                  value={form.features.join(", ")}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {isEditing ? "Update Membership" : "Add Membership"}
                </button>
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700 text-left text-sm uppercase font-medium">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Max Children</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Features</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {memberships.map((m) => (
                  <tr key={m.id.toString()} className="border-t dark:border-gray-600">
                    <td className="p-3">{m.id.toString()}</td>
                    <td className="p-3">{m.name}</td>
                    <td className="p-3">${m.annual_price}</td>
                    <td className="p-3">{m.duration} mo</td>
                    <td className="p-3">{m.max_children}</td>
                    <td className="p-3 capitalize">{m.status}</td>
                    <td className="p-3">{m.features.join(", ")}</td>
                    <td className="p-3">
                      {m.created_date.toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {m.update_date.toLocaleDateString()}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleView(m)}
                        className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Membership View Modal */}
        {selectedMembership && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/2 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                {selectedMembership.name}
              </h2>
              <p className="mb-2">
                <strong>Description:</strong> {selectedMembership.description}
              </p>
              <p className="mb-2">
                <strong>Features:</strong> {selectedMembership.features.join(", ")}
              </p>
              <p className="mb-2">
                <strong>Annual Price:</strong> ${selectedMembership.annual_price}
              </p>
              <p className="mb-2">
                <strong>Duration:</strong> {selectedMembership.duration} days
              </p>
              <p className="mb-2">
                <strong>Max Children:</strong> {selectedMembership.max_children}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {selectedMembership.status}
              </p>
              <p className="mb-2">
                <strong>Created:</strong>{" "}
                {selectedMembership.created_date.toLocaleDateString()}
              </p>
              <p className="mb-2">
                <strong>Updated:</strong>{" "}
                {selectedMembership.update_date.toLocaleDateString()}
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedMembership(null)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
