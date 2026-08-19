import { MessageSquare, Plus, Trash2, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const { isDarkMode } = useTheme();
  const {
    conversations , 
    activeConversationId , 
    setActiveConversationId , 
    createConversation , 
    deleteConversation, 
    clearAllConversation, 
    sidebarOpen, 
  } = useApp();


  return (
    <div
      className={`${
        sidebarOpen 
          ? "w-64 translate-x-0 opacity-100"
          : "w-64 -translate-x-full opacity-0 md:w-0 md:translate-x-0 md:opacity-100"
      } fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden
        transition-[transform,opacity,width]
        duration-300
        ease-out
        shadow-2xl
        rounded-br-xl
        md:relative md:inset auto md:z-auto md:shadow-none ${
        isDarkMode
          ? "bg-gray-800 text-white border-r border-gray-800"
          : "bg-linear-135 from-[#008fb9] to-[#2dc5f1] border-none text-gray-900 border-r border-gray-500"
      }`}
    >
      {/* New chat button */}
      <div className="p-3">
        <button
          onClick = {createConversation}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
            isDarkMode
            ? "border-gray-800 bg-gray-900 hover:bg-gray-800 text-white" 
            : "border-gray-300 bg-[#c4f9ff] hover:bg-[#a2e3f6]"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-3">
        {/* Conditionnal Rendering */}
        {conversations.length === 0 ? ( 
          <div className={`text-center p-4 text-sm`}>No conversation yet</div> 
        ) : (
          conversations.map((conversation) => {
            return (
              <div
                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all mb-1 ${ 
                  isDarkMode 
                    ? "bg-gray-700 border border-gray-700" 
                    : "bg-[#2dc5f1] border border-[#2dc5f1]"
                  } ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-[#c4f9ff]"}`}
                  onClick = {() => setActiveConversationId(conversation.id)}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-sm flex-1 truncate">
                  {conversation.title}
                </span>
                <button onClick = {(e) => {
                  e.stopPropagation();
                  deleteConversation(conversation.id);
                }}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-300"
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className={`p-3 border-t border-none`}>
        {/* Clear All Chats */}
        {/* Conditionnal Rendering */}
        {conversations.length > 0 && (
          <button
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-sm mb-2 ${
              isDarkMode 
                ? "hover:bg-gray-900 text-red-400" 
                : "hover:bg-[#2dc5f1] text-red-600"
              }`}
              onClick = {clearAllConversation}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Chats</span>
          </button>
        )}

        {/* User Info */}
        <div className={`flex items-center gap-3 p-2 rounded-lg mt-1`}>
          <User className="w-4 h-4" />
          <span className="text-sm">User Name</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
