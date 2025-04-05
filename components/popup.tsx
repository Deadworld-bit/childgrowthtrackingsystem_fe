import React from "react";

interface PopupProps {
  message: string;
  messageType: "error" | "success";
}

const Popup: React.FC<PopupProps> = ({ message, messageType }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transform transition-all duration-300">
        <p
          className={`text-center text-xl font-semibold ${
            messageType === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default Popup;
