"use client";

import { useState } from "react";
import { Line } from "recharts";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";

export default function ChildDetailPage() {
    const [entries, setEntries] = useState([
        { date: "2025-02-20", weight: 25, height: 120, bmi: 17.3 },
        { date: "2025-02-25", weight: 26, height: 121, bmi: 17.7 },
        { date: "2025-03-02", weight: 27, height: 122, bmi: 18.1 },
        { date: "2025-03-08", weight: 27.5, height: 123, bmi: 18.2 },
        { date: "2025-03-15", weight: 28, height: 124, bmi: 18.4 },
        { date: "2025-03-22", weight: 28.5, height: 125, bmi: 18.7 },
        { date: "2025-03-29", weight: 29, height: 126, bmi: 18.9 },
        { date: "2025-04-05", weight: 29.5, height: 127, bmi: 19.1 },
        { date: "2025-04-12", weight: 30, height: 128, bmi: 19.3 },
        { date: "2025-04-19", weight: 30.5, height: 129, bmi: 19.5 },
        { date: "2025-04-26", weight: 31, height: 130, bmi: 19.8 },
        { date: "2025-05-03", weight: 31.5, height: 131, bmi: 20.0 },
    ]);

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white p-5">
                <h1 className="text-2xl font-bold">Child Name</h1>

                {/* Input Section */}
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

                {/* Graph Placeholder */}
                <div className="mt-5 bg-gray-800 p-5 rounded h-64 flex items-center justify-center">
                    <p>Graph will go here</p>
                </div>

                {/* Data Table */}
                <table className="mt-5 w-full text-left border border-gray-700">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="p-2">Date</th>
                            <th className="p-2">Weight (kg)</th>
                            <th className="p-2">Height (cm)</th>
                            <th className="p-2">BMI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr
                                key={index}
                                className="border-t border-gray-700"
                            >
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.weight}</td>
                                <td className="p-2">{entry.height}</td>
                                <td className="p-2">{entry.bmi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}
