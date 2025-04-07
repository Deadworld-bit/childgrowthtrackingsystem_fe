"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Tag from "@/components/Tag";
import Button from "@/components/Button";
import Popup from "@/components/popup";
import userApi from "@/app/api/user";
import membershipPlanApi from "@/app/api/membership";
import { MembershipPlan } from "@/app/api/membership"; // Import the interface

const Membership: React.FC = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(
        []
    );
    const [message, setMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<"error" | "success">(
        "success"
    );

    // Fetch user's role from cookie
    useEffect(() => {
        const fetchUserRole = async () => {
            const userCookie = Cookies.get("user");
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    const userId = BigInt(parsedUser.id);
                    const response = await userApi.getUserById(userId);
                    if (
                        response.status === "ok" ||
                        response.status === "success"
                    ) {
                        setUserRole(response.data.role);
                    } else {
                        console.error(
                            "Error fetching user role:",
                            response.message
                        );
                    }
                } catch (err) {
                    console.error("Error fetching user role from API:", err);
                }
            }
        };
        fetchUserRole();
    }, []);

    // Fetch membership plans
    useEffect(() => {
        const fetchMembershipPlans = async () => {
            try {
                const response =
                    await membershipPlanApi.getActiveMembershipPlans();
                if (response.status === "ok" || response.status === "success") {
                    setMembershipPlans(response.data);
                } else {
                    setMessage(response.message);
                    setMessageType("error");
                }
            } catch (error) {
                setMessage("An error occurred while fetching plans");
                setMessageType("error");
            }
        };
        fetchMembershipPlans();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <section className="relative py-24 text-white bg-gradient-to-b from-gray-800 via-gray-700 to-neutral-800 overflow-hidden">
            {message && <Popup message={message} messageType={messageType} />}
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <Tag>Membership</Tag>
                </div>
                <h2 className="text-5xl md:text-6xl font-medium text-center mt-6">
                    How <span className="text-lime-400">MUCH</span> for the{" "}
                    <span className="text-lime-400">Services</span>?
                </h2>
                <div className="mt-12 flex flex-col md:flex-row justify-center gap-8">
                    {membershipPlans.map((plan, index) => {
                        const isPopular = index === 1;
                        return (
                            <div
                                key={plan.id.toString()}
                                className={`relative bg-neutral-900 border border-gray-700 p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 w-full max-w-md ${
                                    isPopular ? "ring-2 ring-lime-500" : ""
                                }`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-lime-500 text-black text-sm font-semibold py-1 px-3 rounded-full shadow-md">
                                        Most Popular
                                    </div>
                                )}
                                <h2 className="text-4xl font-bold text-lime-400">
                                    {plan.annualPrice === 0
                                        ? "Free"
                                        : `${plan.annualPrice.toLocaleString(
                                              "vi-VN"
                                          )}₫`}
                                    <span className="text-lg text-gray-500">
                                        /{plan.duration ===0 ? "unlimited" : plan.duration} day
                                    </span>
                                </h2>
                                <p className="text-white font-semibold mt-4 text-2xl">
                                    {plan.name}
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    {plan.description}
                                </p>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="mt-6 px-6 py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition-colors duration-200"
                                    size="sm"
                                >
                                    Start Free Trial
                                </Button>
                                <ul className="mt-6 text-white space-y-3 text-left">
                                    {plan.features
                                        .split(",")
                                        .map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-2 text-sm leading-tight"
                                            >
                                                <span className="text-lime-400">
                                                    ✔
                                                </span>
                                                {feature.trim()}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Membership;
