import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleChat,
  selectChatIsOpen,
  selectChatUnreadCount,
} from "../store/slices/chatSlice";

const ChatButton = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectChatIsOpen);
  const unreadCount = useSelector(selectChatUnreadCount);

  const handleToggle = () => {
    dispatch(toggleChat());
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative p-2 rounded-lg transition-colors ${
        isOpen
          ? "bg-primary-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Unread Badge */}
      {unreadCount > 0 && !isOpen && (
        <div className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </button>
  );
};

export default ChatButton;
