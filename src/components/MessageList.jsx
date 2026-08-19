import { useEffect, useRef } from "react";
import SMARTLogo from "./SMARTLogo";
import { User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

function MessageList() {
  const { isDarkMode } = useTheme();
  const { getCurrentConversation, isLoading } = useApp();
  const messagesEndRef = useRef(null);

  const currentConversation = getCurrentConversation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, isLoading]);

  if (!currentConversation || currentConversation.messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <span className="font-Corinthia absolute inset-0 flex items-center justify-center text-8xl font-bold text-[#2dc5f1]/10 pointer-events-none select-none">
        System for Maintenance Assistance , Research and Technical expertise
        </span>
        <SMARTLogo className="w-25 h-30 text-gray-500 mb-4" />
        <h2
          className={` italic font-Corinthia text-3xl max-w-md mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          La maintenance , plus fluide que jamais !
        </h2>
        <p
          className={`text-2xl font-semibold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {" "}
          Que puis-je faire pour vous aujourd'hui ?
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* I will use map method */}
        {currentConversation.messages.map((message) => (
          <div
            className={`mb-6 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
            key={message.id}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className="w-8 h-8 shrink-0">
                {/* Conditional Rendering */}
                {message.sender === "user" ? (
                  <div className="w-8 h-8 bg-linear-to-br from-[#008fb9] to-[#2dc5f1] rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 ${
                      isDarkMode ? "bg-gray-700" : "bg-white"
                    } rounded-full flex items-center justify-center shadow-md`}
                  >
                    <SMARTLogo
                      className={`w-7 h-8 ${isDarkMode ? "text-gray-500" : "text-white"}`}
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.sender === "user"
                    ? isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                    : isDarkMode
                      ? "bg-gray-600 text-gray-100 border-gray-600"
                      : "bg-[#ffe3e9] text-gray-900 border-gray-200"
                } ${
                  message.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-word">
                  {message.text}
                </p>
                <p
                  className={`text-[10px] mt-1.5 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional Rendering Loading */}
      {isLoading && (
        <div className="mb-6 flex items-start">
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <SMARTLogo className="w-4 h-4 text-gray-700" />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full animate-bounce`}></div>
                <div
                  className={`w-2 h-2 rounded-full animate-bounce`}
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full animate-bounce`}
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
