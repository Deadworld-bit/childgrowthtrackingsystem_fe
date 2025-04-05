"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { MEMBERSHIP_PLANS } from "@/constants";
import Tag from "@/components/Tag";
import Button from "@/components/Button";
import userApi from "@/app/api/user"; // adjust path as needed
import Popup from "@/components/popup"; // adjust path as needed

const Membership: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string>(""); // message text
  const [messageType, setMessageType] = useState<"error" | "success">("success");

  // Load user data from cookie on component mount
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  // Automatically clear the popup message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleMembershipChange = async (selectedPlanName: string) => {
    if (!user) {
      setMessage("User is not logged in.");
      setMessageType("error");
      return;
    }

    const currentMembership = user.membership?.toUpperCase();
    const newMembership = selectedPlanName.toUpperCase();

    // Prevent downgrade from PREMIUM to BASIC
    if (currentMembership === "PREMIUM" && newMembership === "BASIC") {
      setMessage("You already have PREMIUM. Downgrading to BASIC is not allowed.");
      setMessageType("error");
      return;
    }

    // If the membership is already the same, no need to update
    if (currentMembership === newMembership) {
      setMessage(`You already have the ${selectedPlanName} membership.`);
      setMessageType("error");
      return;
    }

    try {
      // Call the API with the user id (as a path variable) and new membership (as a request parameter)
      const response = await userApi.updateUserMembership(BigInt(user.id), newMembership);
      if (response.status === "ok") {
        // Since the API returns data: null, update the local user object manually
        const updatedUser = { ...user, membership: newMembership };
        setUser(updatedUser);
        Cookies.set("user", JSON.stringify(updatedUser));
        setMessage(`Membership updated to ${selectedPlanName} successfully!`);
        setMessageType("success");
      } else {
        setMessage("There was an error updating your membership.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      setMessage("There was an error updating your membership. Please try again later.");
      setMessageType("error");
    }
  };

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
          {MEMBERSHIP_PLANS.map((plan, index) => {
            const isPopular = index === 1;
            return (
              <div
                key={index}
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
                  {plan.price}
                  <span className="text-lg text-gray-500">/mo</span>
                </h2>
                <p className="text-white font-semibold mt-4 text-2xl">
                  {plan.name}
                </p>
                <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
                <Button
                  type="button"
                  variant="primary"
                  className="mt-6 px-6 py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition-colors duration-200"
                  size="sm"
                  onClick={() => handleMembershipChange(plan.name)}
                >
                  Start Free Trial
                </Button>
                <ul className="mt-6 text-white space-y-3 text-left">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm leading-tight"
                    >
                      <span className="text-lime-400">✔</span>
                      {feature}
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
