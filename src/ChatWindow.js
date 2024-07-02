// src/ChatWindow.js
import React, { useState } from 'react';
import './ChatWindow.css';
import Dropdown from './DropDown';

const ChatWindow = () => {
  const options = ['Titan', 'Mistral', 'Cohere', 'Stability', 'Jurassic', 'LLaMA-3'];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, user: 'me' }]);
      setInput('');
      // Here you can add the code to send the input to the backend and get the response
      // For now, we'll just echo the input as a bot response
      setTimeout(() => {
        setMessages([...messages, { text: input, user: 'me' }, { text: `Echo: ${input}`, user: 'bot' }]);
      }, 500);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="chat-window">
      <div className = "select-model">
        <Dropdown options={options} onSelect={handleSelect} />
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input 
          className="input" 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;