import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext.jsx";
import SocketContext from "../context/SocketContext.jsx";
import { FiSend, FiArrowLeft, FiImage } from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";
import { format } from "date-fns";

const ChatBox = ({ chatWith, onBack }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastActive, setLastActive] = useState("No messages yet");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom with smooth behavior
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch old text messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !chatWith) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages?from=${user.id}&to=${chatWith._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data);
        if (res.data.length > 0) {
          setLastActive(
            format(new Date(res.data[res.data.length - 1].createdAt), "h:mm a")
          );
        }
      } catch (err) {
        console.error("Error fetching messages:", err.response?.data || err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [user, chatWith]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("add-user", user.id);

      // Listen for online status updates
      socket.on("user-status", ({ userId, status }) => {
        if (userId === chatWith._id) {
          setIsOnline(status === "online");
        }
      });

      socket.on("msg-receive", (newMessage) => {
        if (newMessage.image) {
          const notification = document.createElement("div");
          notification.className =
            "fixed flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg bottom-20 right-4 animate-fade-in";
          notification.innerHTML = `
            <span class="mr-2">📷 You received an image!</span>
            <span class="text-xs opacity-80">(Will disappear when refreshed)</span>
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.classList.add("animate-fade-out");
            setTimeout(() => notification.remove(), 500);
          }, 3000);
        }
        setMessages((prev) => [...prev, newMessage]);
        setLastActive(format(new Date(newMessage.createdAt), "h:mm a"));
      });

      // Typing indicator simulation
      socket.on("typing-start", () => setIsTyping(true));
      socket.on("typing-stop", () => setIsTyping(false));

      // Check initial online status
      socket.emit("check-online", chatWith._id);

      return () => {
        socket.off("user-status");
        socket.off("msg-receive");
        socket.off("typing-start");
        socket.off("typing-stop");
      };
    }
  }, [socket, user, chatWith]);

  // Send text message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user || !chatWith) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        {
          from: user.id,
          to: chatWith._id,
          message,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      socket.emit("send-msg", {
        to: chatWith._id,
        message: res.data,
      });

      setMessages([...messages, res.data]);
      setLastActive(format(new Date(res.data.createdAt), "h:mm a"));
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
    }
  };

  // Typing indicator handler
  const handleTyping = () => {
    if (socket) {
      if (message.trim() && !isTyping) {
        socket.emit("typing-start", chatWith._id);
      } else if (!message.trim() && isTyping) {
        socket.emit("typing-stop", chatWith._id);
      }
    }
  };

  // Send image as base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageMessage = {
        from: user.id,
        to: chatWith._id,
        image: reader.result,
        createdAt: new Date().toISOString(),
      };

      socket.emit("send-msg", {
        to: chatWith._id,
        message: imageMessage,
      });

      setMessages((prev) => [...prev, imageMessage]);
      setLastActive(format(new Date(imageMessage.createdAt), "h:mm a"));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden shadow-xl bg-gray-50 rounded-xl">
      {/* Chat header */}
      <div className="flex items-center p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 mr-2 transition-all rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <FiArrowLeft size={20} className="text-white" />
            </button>
          )}
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 overflow-hidden bg-indigo-400 rounded-full">
                <img
                  src={
                    chatWith.profilePicture ||
                    `https://ui-avatars.com/api/?name=${chatWith.username}&background=random`
                  }
                  alt={chatWith.username}
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-400" : "bg-gray-400"
                }`}
              ></div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-white">
                {chatWith.username}
              </h3>
              <div className="flex items-center">
                {isTyping ? (
                  <span className="text-xs text-indigo-100 animate-pulse">
                    typing...
                  </span>
                ) : (
                  <p className="text-xs text-indigo-100">
                    {isOnline
                      ? "Online"
                      : messages.length > 0
                      ? `Active at ${lastActive}`
                      : "No messages yet"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div
        className="flex-1 p-4 overflow-y-auto bg-gray-50 bg-opacity-95"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 delay-100 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 delay-200 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-5 mb-4 bg-white rounded-full shadow-lg">
              <div className="p-3 bg-indigo-100 rounded-full">
                <FiSend size={28} className="text-indigo-600" />
              </div>
            </div>
            <h4 className="text-xl font-medium text-gray-700">
              No messages yet
            </h4>
            <p className="max-w-md mt-2 text-gray-500">
              Start the conversation with {chatWith.username} by sending a
              message or photo
            </p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex mb-4 ${
                m.from === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 relative ${
                  m.from === user.id
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow-md rounded-bl-none"
                } transition-all duration-200 transform hover:scale-[1.02]`}
              >
                {m.image ? (
                  <div className="relative group">
                    <img
                      src={m.image}
                      alt="sent-img"
                      className="object-cover w-full rounded-lg max-h-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black rounded-lg opacity-0 bg-opacity-20 group-hover:opacity-100">
                      <button
                        onClick={() => window.open(m.image, "_blank")}
                        className="px-3 py-1 text-sm text-white bg-black bg-opacity-50 rounded-full"
                      >
                        View Fullscreen
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm md:text-base">{m.message}</p>
                )}
                <div
                  className={`flex items-center justify-end mt-1 space-x-1 ${
                    m.from === user.id ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs">
                    {format(new Date(m.createdAt), "h:mm a")}
                  </span>
                  {m.from === user.id && (
                    <div className="flex">
                      {isOnline ? (
                        <>
                          <IoCheckmarkDone
                            size={14}
                            className="text-indigo-300"
                          />
                          <IoCheckmarkDone
                            size={14}
                            className="-ml-1 text-indigo-300"
                          />
                        </>
                      ) : (
                        <IoCheckmarkDone
                          size={14}
                          className="text-indigo-300"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`absolute w-3 h-3 -bottom-1 ${
                    m.from === user.id
                      ? "right-0 bg-indigo-500 transform -translate-x-1 rotate-45"
                      : "left-0 bg-white transform translate-x-1 rotate-45"
                  }`}
                ></div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="relative">
          <div className="flex items-center">
            <label className="p-2 mr-2 text-indigo-600 transition-all bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 active:scale-95">
              <FiImage size={22} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onBlur={() => socket?.emit("typing-stop", chatWith._id)}
                className="w-full px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {message && (
                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-14 top-1/2 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className={`ml-2 p-3 rounded-full transition-all ${
                message.trim()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-indigo-200 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
// Add fade-in and fade-out animations for notification