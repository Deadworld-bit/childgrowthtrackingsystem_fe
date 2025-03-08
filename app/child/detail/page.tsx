"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

export default function ChildDetailPage() {
    const [entries, setEntries] = useState([
        { date: "2024-01-20", weight: 24, height: 122, bmi: 16.1 }, // Underweight
        { date: "2024-02-25", weight: 38, height: 130, bmi: 22.5 }, // Normal weight
        { date: "2024-03-02", weight: 20, height: 120, bmi: 13.9 }, // Underweight
        { date: "2024-04-08", weight: 47, height: 134, bmi: 26.2 }, // Overweight
        { date: "2024-05-15", weight: 27, height: 124, bmi: 17.6 }, // Underweight
        { date: "2024-06-22", weight: 55, height: 137, bmi: 29.2 }, // Overweight
        { date: "2024-07-29", weight: 30, height: 126, bmi: 18.9 }, // Normal weight
        { date: "2024-08-05", weight: 42, height: 132, bmi: 24.1 }, // Normal weight
        { date: "2024-09-12", weight: 26, height: 123, bmi: 17.2 }, // Underweight
        { date: "2024-10-19", weight: 34, height: 128, bmi: 20.8 }, // Normal weight
        { date: "2024-11-26", weight: 50, height: 135, bmi: 27.4 }, // Overweight
        { date: "2024-12-03", weight: 22, height: 121, bmi: 14.9 }, // Underweight
        { date: "2025-01-20", weight: 36, height: 129, bmi: 21.6 }, // Normal weight
        { date: "2025-02-25", weight: 60, height: 139, bmi: 31.1 }, // Overweight
        { date: "2025-03-02", weight: 28, height: 125, bmi: 18.5 }, // Normal weight
        { date: "2025-04-08", weight: 62, height: 140, bmi: 31.6 }, // Overweight
        { date: "2025-05-15", weight: 40, height: 131, bmi: 23.2 }, // Normal weight
        { date: "2025-06-22", weight: 67, height: 142, bmi: 33.3 }, // Overweight
        { date: "2025-07-29", weight: 29, height: 125, bmi: 18.5 }, // Normal weight
        { date: "2025-08-05", weight: 45, height: 133, bmi: 25.4 }, // Overweight
        { date: "2025-09-12", weight: 32, height: 127, bmi: 19.8 }, // Normal weight
        { date: "2025-10-19", weight: 52, height: 136, bmi: 28.1 }, // Overweight
        { date: "2025-11-26", weight: 26, height: 123, bmi: 17.2 }, // Underweight
        { date: "2025-12-03", weight: 70, height: 143, bmi: 34.2 }, // Overweight
    ]);

    const [activeTab, setActiveTab] = useState("bmi");
    const years = [
        ...new Set(entries.map((entry) => entry.date.split("-")[0])),
    ];
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const filteredEntries = entries.filter((entry) =>
        entry.date.startsWith(selectedYear)
    );

    const getBmiClass = (bmi: number) => {
        if (bmi < 18.5) return "bg-blue-500";
        if (bmi >= 18.5 && bmi <= 24.9) return "bg-green-500";
        if (bmi >= 25 && bmi <= 29.9) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white p-5">
                <h1 className="text-2xl font-bold">Child Name</h1>
                <div className="mt-5 flex gap-4">
                    <input
                        className="p-2 rounded bg-gray-800"
                        placeholder="Height (cm)"
                    />
                    <input
                        className="p-2 rounded bg-gray-800"
                        placeholder="Weight (kg)"
                    />
                    <button className="p-2 bg-blue-500 rounded">
                        Add Entry
                    </button>
                </div>
                <div className="mt-8 bg-gray-800 p-5 rounded h-72 relative">
                    <div className="flex gap-3 mb-3">
                        {["weight", "height", "bmi"].map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`p-2 rounded ${
                                    activeTab === key
                                        ? "bg-blue-500"
                                        : "bg-gray-700"
                                }`}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredEntries}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#444"
                            />
                            <XAxis
                                dataKey="date"
                                stroke="#fff"
                                tickFormatter={(date) =>
                                    new Date(date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }
                                tickMargin={10}
                            />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#333",
                                    color: "#fff",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={activeTab}
                                stroke="#38bdf8"
                                strokeWidth={2}
                                dot={{ fill: "#38bdf8" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[-2.5rem] right-2">
                        <select
                            className="p-2 bg-gray-700 rounded"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <table className="mt-10 w-full text-left border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="p-2">Date</th>
                            <th className="p-2">Weight (kg)</th>
                            <th className="p-2">Height (cm)</th>
                            <th className="p-2">BMI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.map((entry, index) => (
                            <tr
                                key={index}
                                className={`border-t border-gray-700 ${getBmiClass(
                                    entry.bmi
                                )}`}
                            >
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.weight}</td>
                                <td className="p-2">{entry.height}</td>
                                <td className="p-2">{entry.bmi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <p className="text-lg font-semibold">
                        <span className="bg-blue-500 p-1 rounded mr-2">
                            Underweight: BMI &lt; 18.5
                        </span>
                        <span className="bg-green-500 p-1 rounded mr-2">
                            Normal weight: BMI 18.5–24.9
                        </span>
                        <span className="bg-yellow-500 p-1 rounded mr-2">
                            Overweight: BMI 25–29.9
                        </span>
                        <span className="bg-red-500 p-1 rounded">
                            Obesity: BMI ≥ 30
                        </span>
                    </p>
                </div>
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">
                        Posts from Users and Doctors
                    </h2>
                    <div className="bg-gray-800 p-5 rounded mb-4">
                        <h3 className="text-lg font-semibold">
                            User Post Title
                        </h3>
                        <p className="mt-2">This is a post from a user...</p>
                    </div>
                    <div className="bg-gray-800 p-5 rounded mb-4">
                        <h3 className="text-lg font-semibold">
                            Doctor Post Title
                        </h3>
                        <p className="mt-2">This is a post from a doctor...</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
