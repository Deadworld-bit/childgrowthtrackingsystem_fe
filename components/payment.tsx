import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentModal: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [cardValid, setCardValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateCard = (cardNumber: string) => {
    const visaRegex = /^4\d{12,18}$/;
    return visaRegex.test(cardNumber);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefault();
    // const card = elements?.getElement(CardElement);
    // if (!card) return;

    // const {token, error} = await stripe?.createToken(card);

    // if (error) {
    //   setErrorMessage(error.message);
    // } else {
    //   setErrorMessage(null);
    //   alert("Card is valid!");
    // }
  };

  const handleCardChange = (event: any) => {
    if (event.complete) {
      const isValid = validateCard(event.element?.value || "");
      setCardValid(isValid);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4 text-center">Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="card-element" className="block text-gray-700">Enter your Visa Card:</label>
            <div className="mt-2">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4"
                      }
                    },
                  },
                }}
                onChange={handleCardChange}
              />
            </div>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            className={`w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded ${cardValid ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
            disabled={!cardValid}
          >
            Validate Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
