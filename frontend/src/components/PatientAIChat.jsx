import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const PatientAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState("20%"); // Initial small size
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setSize(size === "20%" ? "90%" : "20%");
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    setMessages(newMessages);

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();

      if (data.success) {
        // Replace \n with actual line breaks
        const formattedReply = data.reply.replace(/\\n/g, "\n");
        setMessages([...newMessages, { sender: "ai", text: formattedReply }]);
      } else {
        setMessages([...newMessages, { sender: "ai", text: "AI Error: " + data.reply }]);
      }
    } catch (err) {
      console.error("AI Error:", err);
      setMessages([...newMessages, { sender: "ai", text: "AI Error: Something went wrong." }]);
    }
    setInputMessage("");
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
      {/* Floating Bouncing Button */}
      <div
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer shadow-lg"
        style={{
          width: "60px",
          height: "60px",
          animation: "bounce 2s infinite",
        }}
      >
        AI
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
          style={{
            width: size,
            height: "60vh",
            transition: "width 0.5s ease",
          }}
        >
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-2 flex justify-between items-center">
            <span>AI Assistant</span>
            <button onClick={toggleChat} className="font-bold">
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] break-words ${
                  msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">AI is typing...</div>}
            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <div className="p-2 flex gap-2 border-t border-gray-200">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 border rounded-lg px-2 py-1 outline-none resize-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bounce keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        `}
      </style>
    </>
  );
};

export default PatientAIChat;
