// src/ChatWindow.js
import React, { useState } from 'react';
import './ChatWindow.css';
import Dropdown from './DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { post } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';

console.log('API Config:', Amplify.getConfig().API);
 
const ChatWindow = () => {
  const options = ['Titan', 'mistral', 'Cohere', 'Stability', 'Claude', 'LLaMA-3'];
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleSend = async () => {
    if (input.trim()) {
        const newMessage = { text: input, user: 'me' };
        setMessages([...messages, newMessage]);
        setInput('');
        setIsLoading(true);
    
        try {
          const response = await post({
            apiName: 'mistralapi',
            path: '/mistral-router',
            options: {
              body: { "prompt": input }
            }
          });


        console.log('Raw response:', response);

        const res = await response.response;

        console.log('Resolved response:', res);

        let botResponseText = '';

      if (res.body && typeof res.body.text === 'function') {
        try {
          // Read the response body as text
          botResponseText = await res.body.text();
        } catch (e) {
          console.error('Error reading response body:', e);
        }
      }

      console.log('Processed botResponse:', botResponseText["body"]);

      setMessages(prevMessages => [...prevMessages, { text: botResponseText, user: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setMessages(prevMessages => [...prevMessages, { text: "Sorry, there was an error processing your request.", user: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
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
    <>
    <div className="select-model">
        <Dropdown options={options} onSelect={handleSelect} />
    </div>
    <div className="chat-window">
      <div className="messages-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user}`}>
              {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
              <button onClick={() => copyToClipboard(msg.text, index)} className="copy-button">
                {clickedIndex === index ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faCopy} />}
              </button>
            </div>
          ))}
        </div>
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
    </>
  );
};

export default ChatWindow;
