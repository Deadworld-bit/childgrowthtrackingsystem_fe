import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import userApi from "@/app/api/user";
import Cookies from "js-cookie";
import { MembershipPlan } from "@/app/api/membership";

interface PaymentModalProps {
    plan: MembershipPlan;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [cardValid, setCardValid] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const card = elements?.getElement(CardElement);
        if (!card || !stripe) {
            setErrorMessage("Stripe not initialized.");
            return;
        }

        const { token, error } = await stripe.createToken(card);

        if (error) {
            setErrorMessage(error.message || "An error occurred with the card.");
        } else {
            setErrorMessage(null);
            console.log("Token:", token); // Debug token to verify
            // For fake payment, assume any token is valid (test mode)
            try {
                const userCookie = Cookies.get("user");
                if (!userCookie) {
                    setErrorMessage("User not logged in.");
                    return;
                }
                const parsedUser = JSON.parse(userCookie);
                const userId = BigInt(parsedUser.id);
                const response = await userApi.setMembership(userId, plan.id);
                if (response.status === "ok" || response.status === "success") {
                    setSuccessMessage("Membership updated successfully!");
                    setTimeout(() => {
                        onClose();
                    }, 2000);
                } else {
                    setErrorMessage(response.message || "Failed to update membership.");
                }
            } catch (err) {
                setErrorMessage("An error occurred while updating membership.");
                console.error("API error:", err);
            }
        }
    };

    const handleCardChange = (event: any) => {
        if (event.complete) {
            setCardValid(true); // Stripe marks it complete if valid
        } else {
            setCardValid(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg">
                <h2 className="text-2xl mb-4 text-center">Payment for {plan.name}</h2>
                {successMessage && (
                    <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="card-element" className="block text-gray-700">
                            Enter your Visa Card:
                        </label>
                        <div className="mt-2">
                            <CardElement
                                id="card-element"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#424770",
                                            "::placeholder": {
                                                color: "#aab7c4",
                                            },
                                        },
                                    },
                                }}
                                onChange={handleCardChange}
                            />
                        </div>
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className={`w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded ${
                            cardValid ? "opacity-100" : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!cardValid || !stripe}
                    >
                        Validate Card
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;