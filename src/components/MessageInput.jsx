import { Send } from 'lucide-react';
import { useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import openaiservice from '../context/services/openaiservice';
import { CONFIG } from '../config/config';

function MessageInput() {

    const {isDarkMode} = useTheme();
    const inputRef = useRef(null);
    const [inputText, setInputText] = useState("");

    const {
        //setActiveConversationId, 
        isLoading, 
        setIsLoading, 
        createConversation, 
        updateConversationTitle, 
        getCurrentConversation, 
        activeConversationId, 
        addMessage,
        apiKey,
    } = useApp();

    const handleMessage = async () => {
        if(!inputText.trim() ||isLoading) return;

        let conversationId = activeConversationId;

        if (!conversationId) {
        conversationId = createConversation();
        }
        
        if(!conversationId){
            conversationId = Date.now().toString();
            const title = 
                inputText.length > 30 ? inputText.substring(0,30) + "..." : inputText;

            updateConversationTitle(conversationId, title);
        }

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: "user", 
            timestamp : new Date().toISOString(),
        };

        addMessage(conversationId, userMessage);

        const currentConv = getCurrentConversation();
        
        if(!currentConv || currentConv.messages.length === 0){
            updateConversationTitle(conversationId, inputText);
        }

        setInputText("");
        setIsLoading(true);

        try {
            const currentMessages = getCurrentConversation()?.messages || [];
            const messages = [
                ...currentMessages.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant", 
                content: msg.text,
            })),
            {role: "user", content: inputText}, 
            ];

            const response = await openaiservice.sendMessage(messages, apiKey, {
                model: CONFIG.OPENAI_MODEL,
                maxTokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE
            });

            if(response.success){
                const aiMessage = {
                    id: Date.now() + 1,
                    text: response.data,
                    sender: "assistant", 
                    timestamp: new Date().toISOString()
                }
                addMessage(conversationId, aiMessage)
            } else {
                const errorMessage = {
                    id : Date.now() + 1 , 
                    text: response.error || "An unexpected error occured , please try again", 
                    sender: "assistant",
                    timestamp: new Date().toISOString(),
                };
                addMessage(conversationId, errorMessage)
            }
        }catch(error){
            console.error("Error sending message", error);
            const errorMessage = {
                id : Date.now() + 1 , 
                text: "An unexpected error occured , please try again", 
                sender: "assistant",
                timestamp: new Date().toISOString(),
            }

            addMessage(conversationId, errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPass = (e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            handleMessage();
        }
    }

  return (
    <div 
        className = {`border-t p-4 ${
            isDarkMode 
                ? "border-gray-800 bg-gray-900"
                : "border-gray-200 bg-white-50"}
            `}
    >
        <div className = "max-w-3xl mx-auto">
            <div 
                className = {`relative flex items-end gap-3 border rounded-2xl p-3 shadow-lg transition-all ${
                    isDarkMode 
                    ? "bg-gray-800 border-gray-700 focus:focus-within:border-gray-600" 
                    : "bg-white border-gray-300 focus:within-border-gray-400"
                }`}
            >
                <textarea
                    className = {`flex-1 resize-none bg-tranparent border-0 outline-none max-h-35 ${
                        isDarkMode 
                        ? "text-white placeholder-gray-500" 
                        : "text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder = "Chat with SMART..."
                    rows = {1}
                    style = {{height: "auto" , minHeight: "24px"}}
                    value = {inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    ref = {inputRef}
                    onKeyPress={handleKeyPass}

                    onInput = {(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                    }}

                />
                <button onClick = {handleMessage} disabled = {!inputText.trim() || isLoading}
                    className = {`p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDarkMode 
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                >
                    <Send className = "w-4 h-4"/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default MessageInput