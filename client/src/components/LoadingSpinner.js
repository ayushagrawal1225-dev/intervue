import React from "react";

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "large":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`loading-spinner ${getSizeClasses()} border-primary-600`}
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
