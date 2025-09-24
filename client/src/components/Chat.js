import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import {
  selectChatIsOpen,
  selectChatMessages,
  closeChat,
  clearUnreadCount,
} from "../store/slices/chatSlice";
import { selectUserType, selectStudentName } from "../store/slices/userSlice";

const Chat = () => {
  const dispatch = useDispatch();
  const { sendChatMessage } = useSocket();

  const isOpen = useSelector(selectChatIsOpen);
  const messages = useSelector(selectChatMessages);
  const userType = useSelector(selectUserType);
  const studentName = useSelector(selectStudentName);

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(clearUnreadCount());
      scrollToBottom();
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      sendChatMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-primary-600"
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
          <h3 className="text-sm font-medium text-gray-900">Chat</h3>
        </div>

        <button
          onClick={() => dispatch(closeChat())}
          className="text-gray-400 hover:text-gray-600"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isTeacher ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs break-words ${
                  message.isTeacher
                    ? "chat-bubble teacher"
                    : "chat-bubble student"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium ${
                      message.isTeacher ? "text-primary-200" : "text-gray-600"
                    }`}
                  >
                    {message.sender}
                  </span>
                  <span
                    className={`text-xs ${
                      message.isTeacher ? "text-primary-200" : "text-gray-500"
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p>{message.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm py-8">
            <svg
              className="mx-auto h-8 w-8 text-gray-400 mb-2"
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
            <p>No messages yet</p>
            <p className="text-xs">Start a conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={1000}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? (
              <div className="loading-spinner w-4 h-4"></div>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{userType === "teacher" ? "Teacher" : studentName}</span>
          <span>{newMessage.length}/1000</span>
        </div>
      </form>
    </div>
  );
};

export default Chat;
