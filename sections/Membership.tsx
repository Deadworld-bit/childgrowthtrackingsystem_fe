import React from "react";
import { MEMBERSHIP_PLANS } from "@/constants";

const Membership = () => {
    return (
        <section className="flex flex-col items-center bg-neutral-950 py-24 text-white">
            <h3 className="text-center text-white text-xl">Memberships</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 bg-neutral-950 py-24 text-white">
                {MEMBERSHIP_PLANS.map((plan, index) => (
                    <div
                        key={index}
                        className="bg-[#343435] p-6 rounded-2xl w-80 shadow-lg text-center"
                    >
                        <h2 className="text-3xl font-bold text-[#1976D2]">
                            {plan.price}
                            <span className="text-lg text-gray-500">/mo</span>
                        </h2>
                        <p className="text-white font-semibold mt-2">
                            {plan.name}
                        </p>
                        <p className="text-white text-sm mt-2">
                            {plan.description}
                        </p>
                        <button className="bg-[#4A90E2] hover:bg-[#1976D2] text-white font-bold py-2 px-4 w-full rounded-lg mt-4 transition duration-300">
                            Start Free Trial
                        </button>
                        <ul className="mt-4 text-white space-y-2 text-left">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    ✅ {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Membership;
