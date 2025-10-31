import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh]">
      {/* Spinner */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div
          className="absolute inset-3 border-4 border-blue-100 border-t-blue-400 rounded-full animate-spin"
          style={{
            animationDirection: "reverse",
            animationDuration: "1s",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl animate-pulse">🩺</div>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
      <p className="text-gray-500 text-sm mt-1">
        Please hold on for a moment...
      </p>

      {/* Animated dots */}
      <div className="flex justify-center space-x-1 pt-1.5">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
