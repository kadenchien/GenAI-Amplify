// src/ChatWindow.js
import React, { useState } from 'react';
import './ChatWindow.css';
import Dropdown from './DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ChatWindow = () => {
  const options = ['Titan', 'Mistral', 'Cohere', 'Stability', 'Jurassic', 'LLaMA-3'];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, user: 'me' };
      setMessages([...messages, newMessage]);
      setInput('');
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: `Echo: ${input}`, user: 'bot' }]);
      }, 500);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setClickedIndex(index);
      setTimeout(() => {
        setClickedIndex(null);
      }, 500);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="chat-window">
      <div className="select-model">
        <Dropdown options={options} onSelect={handleSelect} />
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user}`}>
            {msg.text}
            <button onClick={() => copyToClipboard(msg.text, index)} className="copy-button">
              {clickedIndex === index ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faCopy} />}
            </button>
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
