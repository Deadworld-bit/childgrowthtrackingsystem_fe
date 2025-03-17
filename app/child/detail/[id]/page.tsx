"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import childApi, { Child } from "@/app/api/child";
import metricApi, { Metric } from "@/app/api/metric";
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
    const params = useParams();
    const { id } = params; // Get child ID from the URL
    const [childDetail, setChildDetail] = useState<Child | null>(null);
    const [entries, setEntries] = useState<Metric[]>([]);
    const [activeTab, setActiveTab] = useState("bmi");
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        if (id && typeof id === "string") {
            fetchChildDetails(id);
            fetchChildMetrics(id);
        }
    }, [id]);

    const fetchChildDetails = async (childId: string) => {
        try {
            const childData = await childApi.getChildById(BigInt(childId));
            setChildDetail(childData);
        } catch (error) {
            console.error("Error fetching child details:", error);
        }
    };

    const fetchChildMetrics = async (childId: string) => {
        try {
            const metrics = await metricApi.getMetricsByChildId(BigInt(childId));
            setEntries(metrics);
            if (metrics.length > 0) {
                const years = [
                    ...new Set(metrics.map((entry) => entry.recordedDate.getFullYear().toString())),
                ];
                setSelectedYear(years[0]);
            }
        } catch (error) {
            console.error("Error fetching child metrics:", error);
        }
    };

    const filteredEntries = entries.filter((entry) =>
        entry.recordedDate.toISOString().startsWith(selectedYear)
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
                <h1 className="text-2xl font-bold">
                    {childDetail ? childDetail.name : "Loading..."}
                </h1>
                <p className="mt-2">Gender: {childDetail?.gender || "N/A"}</p>
                <p className="mt-2">
                    Date of Birth:{" "}
                    {childDetail?.dob
                        ? new Date(childDetail.dob).toLocaleDateString()
                        : "N/A"}
                </p>
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
                                dataKey="recordedDate"
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
                            {[...new Set(entries.map((entry) => entry.recordedDate.getFullYear().toString()))].map((year) => (
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
                                <td className="p-2">{entry.recordedDate.toLocaleDateString()}</td>
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