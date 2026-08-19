import { createContext, useContext, useEffect, useState } from "react";
import { CONFIG } from "../config/config.js";

const AppContext = createContext();

// Custom hooks to use app context

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must used within App Provider");
  }
  return context;
};

//App state Provider
export const AppProvider = ({ children }) => {
  // load conversation from local storage.

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    return saved ? JSON.parse(saved) : [];
  });

  //load active conversation id from local storage
  const [activeConversationId, setActiveConversationId] = useState(() => {
    return localStorage.getItem("activeConversationId") || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  //Load sidebar state from local storage
  const [sidebarOpen, setSideBarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      return false;
    }
    return saved ? JSON.parse(saved) : true;
  });

  //
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const handleViewportChange = (event) => {
      if (event.matches) {
        setSideBarOpen(false);
      }
    };

    mobileQuery.addEventListener("change", handleViewportChange);

    return () => {
      mobileQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  // save conversation to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  // Save active conversation ID to local storage
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem("activeConversationId", activeConversationId);
    } else {
      localStorage.removeItem("activeConversationId");
    }
  }, [activeConversationId]);

  // Save sidebar state to local storage
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Create a new conversation
  const createConversation = () => {
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  // Delete a conversation
  const deleteConversation = (id) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));

    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  //clear all conversation
  const clearAllConversation = () => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem("conversations");
    localStorage.removeItem("activeConversationId");
  };

  //Add a message to a conversation
  const addMessage = (conversationId, message) => {
    setConversations((prev) =>
      prev.map((conv) => {
        return conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv;
      }),
    );
  };

  //Update the conversation title
  const updateConversationTitle = (conversationId, title) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              title: title.length > 30 ? title.substring(0, 30) + "..." : title,
            }
          : conv,
      ),
    );
  };

  const getCurrentConversation = () => {
    return conversations.find((conv) => conv.id === activeConversationId);
  };

  const value = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    setIsLoading,
    sidebarOpen,
    setSideBarOpen,
    createConversation,
    deleteConversation,
    clearAllConversation,
    addMessage,
    updateConversationTitle,
    getCurrentConversation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
