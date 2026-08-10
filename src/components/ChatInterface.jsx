import Sidebar from "./Sidebar";
import { Menu, Sun, Moon } from "lucide-react";
import SMARTLogo from "./SMARTLogo";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useTheme } from "../context/ThemeContext";
import { useApp } from "../context/AppContext";

function ChatInterface() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { activeConversationId, conversations } = useApp();
  const { setSideBarOpen } = useApp();

  const currentConversation = conversations.find(
    (conv) => conv.id === activeConversationId,
  );

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode
              ? "bg-gray-950 border-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Menu Toggle */}
            <button
              className={`p-2 rounded-lg transition-all ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => setSideBarOpen((prev) => !prev)}
            >
              <Menu
                className={`w-5 h-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              />
            </button>

            {/* Logo */}
            <SMARTLogo className="w-11 h-13 text-white" />

            {/* Title */}
            <h1
              className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {currentConversation?.title || "SMART"}
            </h1>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {/* Conditional Rendering */}
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatInterface;
