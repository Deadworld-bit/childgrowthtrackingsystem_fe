import React from "react";
import { MEMBERSHIP_PLANS } from "@/constants";
import Tag from "@/components/Tag";
import Button from "@/components/Button";

const Membership = () => {
    return (
        <section className="py-24 text-white">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Membership</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6">
                    How{" "}<span className="text-lime-400">MUCH</span> for the{" "}
                    <span className="text-lime-400">Services</span> ?
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MEMBERSHIP_PLANS.map((plan, index) => (
                        <div
                            key={index}
                            className="bg-neutral-900 border-white/10 p-6 rounded-3xl text-center"
                        >
                            <h2 className="text-3xl font-bold text-lime-400">
                                {plan.price}
                                <span className="text-lg text-gray-500">
                                    /mo
                                </span>
                            </h2>
                            <p className="text-white font-semibold mt-2">
                                {plan.name}
                            </p>
                            <p className="text-white text-sm mt-2">
                                {plan.description}
                            </p>
                            <Button type="submit" variant="primary" className="mt-4 whitespace-nowrap" size="sm">Start Free Trial</Button>
                            <ul className="mt-4 text-white space-y-2 text-left">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        ✅ {feature}
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