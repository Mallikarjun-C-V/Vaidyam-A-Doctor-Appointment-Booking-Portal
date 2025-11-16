import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

// --- SVG Icon Components ---
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
  </svg>
);

const MinimizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// --- Random Pulse Animation Component ---
const RandomPulseButton = ({ onClick, children }) => {
  const buttonRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (buttonRef.current) {
        // Generate random scale between 1.0 and 1.2
        const randomScale = 1.0 + Math.random() * 0.2;
        const randomDuration = 1500 + Math.random() * 1000; // 1.5s to 2.5s
        
        buttonRef.current.style.transition = `transform ${randomDuration}ms ease-in-out`;
        buttonRef.current.style.transform = `scale(${randomScale})`;
        
        animationRef.current = setTimeout(() => {
          if (buttonRef.current) {
            buttonRef.current.style.transform = 'scale(1)';
            setTimeout(animate, randomDuration);
          }
        }, randomDuration);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300"
      aria-label="Open AI Chat"
    >
      {children}
    </button>
  );
};

// --- Main Chat Component ---
const PatientAIChat = () => {
  const [chatState, setChatState] = useState("closed");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm your AI health assistant. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Prevent background scroll when expanded
  useEffect(() => {
    if (chatState === "expanded") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [chatState]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();
      const formattedReply = data.success
        ? data.reply.replace(/\\n/g, "\n")
        : `AI Error: ${data.reply}`;
      setMessages([...newMessages, { sender: "ai", text: formattedReply }]);

    } catch (err) {
      console.error("AI Error:", err);
      setMessages([...newMessages, { sender: "ai", text: "AI Error: Could not connect to the service." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button with Random Pulse */}
      {chatState === 'closed' && (
        <div className="fixed bottom-6 right-6 z-50">
          <RandomPulseButton onClick={() => setChatState('mini')}>
            <ChatIcon />
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping-slow"></span>
          </RandomPulseButton>
        </div>
      )}

      {/* Mini Chat Window */}
      {chatState === 'mini' && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-in border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-5 py-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="flex items-center gap-2 relative z-10">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <SparklesIcon />
              </div>
              <div>
                <span className="font-semibold text-lg block">AI Health Assistant</span>
                <span className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => setChatState('expanded')} 
                className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="Expand Chat"
              >
                <ExpandIcon />
              </button>
              <button 
                onClick={() => setChatState('closed')} 
                className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="Close Chat"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" 
                        : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    }`}>
                      {msg.sender === "user" ? <UserIcon /> : <BotIcon />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`${
                      msg.sender === "user" 
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm" 
                        : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm"
                    } px-4 py-3 message-bubble`}>
                      <div className={`prose prose-sm max-w-none ${msg.sender === "user" ? "prose-invert" : ""}`}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      <BotIcon />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef}></div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 text-sm transition-all duration-200"
              />
              <button
                onClick={handleSend}
                disabled={loading || !inputMessage.trim()}
                className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                aria-label="Send Message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Chat Window */}
      {chatState === 'expanded' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="w-full h-full max-w-[90vw] max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-gray-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <SparklesIcon />
                </div>
                <div>
                  <h2 className="font-bold text-xl">AI Health Assistant</h2>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Ask me anything about your health
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={() => setChatState('mini')} 
                  className="hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
                  aria-label="Minimize Chat"
                >
                  <MinimizeIcon />
                </button>
                <button 
                  onClick={() => setChatState('closed')} 
                  className="hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
                  aria-label="Close Chat"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg" 
                          : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                      }`}>
                        {msg.sender === "user" ? <UserIcon /> : <BotIcon />}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`${
                        msg.sender === "user" 
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl rounded-tr-md shadow-lg" 
                          : "bg-white border border-gray-200 text-gray-800 rounded-3xl rounded-tl-md shadow-md"
                      } px-6 py-4 message-bubble`}>
                        <div className={`prose prose-base max-w-none ${msg.sender === "user" ? "prose-invert" : ""}`}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                        <BotIcon />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-3xl rounded-tl-md shadow-md px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef}></div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    rows={1}
                    className="flex-1 border border-gray-300 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-40 text-base transition-all duration-200"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !inputMessage.trim()}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl font-medium hover:scale-105 active:scale-95"
                    aria-label="Send Message"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        /* Shimmer Animation for Header */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        /* Ping Slow Animation */
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite;
        }

        /* Slide In Animation */
        @keyframes slide-in {
          from { 
            transform: translateY(20px) scale(0.95); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Scale In Animation */
        @keyframes scale-in {
          from { 
            transform: scale(0.9); 
            opacity: 0; 
          }
          to { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Fade In Animation */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Fade In Up Animation */
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Message Bubble Hover Effect */
        .message-bubble {
          transition: transform 0.2s ease;
        }
        .message-bubble:hover {
          transform: translateY(-2px);
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #4f46e5);
        }

        /* Prose Styles for Markdown */
        .prose p {
          margin: 0;
        }
        .prose ul, .prose ol {
          margin: 0.5em 0;
        }
        .prose code {
          background: rgba(0,0,0,0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
        .prose-invert code {
          background: rgba(255,255,255,0.2);
        }

        /* Smooth Transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </>
  );
};

export default PatientAIChat;