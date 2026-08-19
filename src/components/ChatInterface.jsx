import Sidebar from "./Sidebar";
import { Menu, Sun, Moon } from "lucide-react";
import SMARTLogo from "./SMARTLogo";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useTheme } from "../context/ThemeContext";
import { useApp } from "../context/AppContext";

function ChatInterface() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { activeConversationId, 
          conversations,
          sidebarOpen,
          setSideBarOpen,
        } = useApp();

  const currentConversation = conversations.find(
    (conv) => conv.id === activeConversationId,
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <button
        type="button"
        aria-label="Fermer la sidebar"
        className= {`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ease-out md:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSideBarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${isDarkMode ? "bg-[#112d41]" : "bg-[#f4feff]"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b rounded-br-xl ${
            isDarkMode
              ? "bg-linear-180 from-[#002835] to-[#005e78] border-gray-800"
              : "border-gray-300 bg-linear-180 from-[#008fb9] to-[#2dc5f1]"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Menu Toggle */}
            <button
              className={`p-2 rounded-lg transition-all ${
                isDarkMode ? "hover:bg-gray-800" : "bg-[#2dc5f1] hover:bg-[#a2e3f6]"
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
              isDarkMode ? "hover:bg-gray-800" : " bg-[#2dc5f1] hover:bg-[#a2e3f6]"
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
