import React from "react";
import { MEMBERSHIP_PLANS } from "@/constants";
import Tag from "@/components/Tag";
import Button from "@/components/Button";

const Membership = () => {
    return (
        <section className="py-24 text-white bg-gradient-to-b from-gray-800 via-gray-700 to-neutral-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <Tag>Membership</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6">
                    How <span className="text-lime-400">MUCH</span> for the{" "}
                    <span className="text-lime-400">Services</span> ?
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MEMBERSHIP_PLANS.map((plan, index) => (
                        <div
                            key={index}
                            className="bg-neutral-900 border border-gray-700 p-8 rounded-3xl text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-4xl font-bold text-lime-400">
                                {plan.price}
                                <span className="text-lg text-gray-500">
                                    /mo
                                </span>
                            </h2>
                            <p className="text-white font-semibold mt-4 text-xl">
                                {plan.name}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                {plan.description}
                            </p>
                            <Button
                                type="submit"
                                variant="primary"
                                className="mt-6 px-6 py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition-colors duration-200"
                                size="sm"
                            >
                                Start Free Trial
                            </Button>
                            <ul className="mt-6 text-white space-y-3 text-left">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <span className="text-lime-400">✔</span>{" "}
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Membership;
