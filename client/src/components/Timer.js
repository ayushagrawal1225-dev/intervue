import React from "react";

const Timer = ({ timeRemaining = 0, variant = "normal", size = "medium" }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return "timer-danger";
      case "warning":
        return "timer-warning";
      default:
        return "timer-normal";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-12 h-12 text-sm";
      case "large":
        return "w-20 h-20 text-xl";
      default:
        return "w-16 h-16 text-base";
    }
  };

  if (timeRemaining <= 0) {
    return (
      <div
        className={`timer-circle ${getSizeClasses()} border-gray-300 text-gray-500 bg-gray-50`}
      >
        <span className="font-bold">0:00</span>
      </div>
    );
  }

  return (
    <div className={`timer-circle ${getSizeClasses()} ${getVariantClasses()}`}>
      <span className="font-bold">{formatTime(timeRemaining)}</span>

      {/* Pulse animation for urgent times */}
      {timeRemaining <= 10 && (
        <div className="absolute inset-0 rounded-full border-4 border-error-500 animate-ping opacity-75" />
      )}
    </div>
  );
};

export default Timer;
