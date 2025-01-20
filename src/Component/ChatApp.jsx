import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef(null);
 
  // Server URL
  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(`http://localhost:3000/chat`, { message: input });
      
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", text: "Error: Unable to fetch response" }]);
    }
    setInput("");
  };

  const handleSearch = () => {
    const index = messages.findIndex(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()));
    if (index !== -1) {
      const messageElement = document.getElementById(`message-${index}`);
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add("highlight");
      setTimeout(() => {
        messageElement.classList.remove("highlight");
      }, 2000);
    } else {
      alert("Message not found.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto border border-gray-300 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Chatbot</h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full p-2 border rounded mb-2"
        />
        <button onClick={handleSearch} className="w-full py-2 bg-blue-500 text-white rounded">Search</button>
      </div>

      <div className="chat-box h-64 overflow-y-auto mb-4 border p-2 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            id={`message-${index}`}
            className={`p-2 mb-2 rounded ${
              msg.sender === "user" ? "bg-green-400 text-white text-right ml-auto" : "bg-gray-200 text-black"
            }`}
            style={{ maxWidth: "75%" }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded mr-2"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-green-500 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
