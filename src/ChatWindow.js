// src/ChatWindow.js
import React, { useState, useEffect } from 'react';
import './ChatWindow.css';
import Dropdown from './DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { post } from 'aws-amplify/api';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

console.log('API Config:', Amplify.getConfig().API);
 
const ChatWindow = () => {
  const options = ['Titan', 'Mistral', 'Cohere', 'Stability', 'Claude', 'LLaMA-3'];
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  

  useEffect(() =>{
    const fetchUserEmail = async () => {
        try {
          const user = await getCurrentUser();
  
          const attributes = await fetchUserAttributes();
  
          if (attributes.email) {
            setUserEmail(attributes.email);
          } else {
            console.log('Email not found in user attributes');
            setUserEmail('');
          }
        } catch (error) {
          console.error('Error fetching user email:', error);
          setUserEmail('');
        }
      };

      fetchUserEmail();
  }, []);

  function getRouterPath(selectedOption) {
    const routerMap = {
      'Titan': '/titan-router',
      'Mistral': '/mistral-router',
      'Cohere': '/cohere-router',
      'Stability': '/stability-router',
      'Claude': '/claude-router',
      'LLaMA-3': '/llama3-router'
    };
  
    return routerMap[selectedOption] || '/default-router';
  }

  const handleSend = async () => {
    if (input.trim()) {
        const newMessage = { text: input, user: 'me' };
        setMessages([...messages, newMessage]);
        setInput('');
        setIsLoading(true);
        try {
          const response = await post({
            apiName: 'mistralapi',
            path: getRouterPath(selectedOption),
            options: {
              body: { 
                "prompt": input,
                "x-user-email": userEmail,
               },
              headers: {
                'Content-Type': 'application/json',
              }
            }
          });

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

      // Manually strip out the {"body": " prefix and the "} suffix
        let cleanedResponse = botResponseText;

        // Ensure the text is correctly formatted
        if (cleanedResponse.startsWith('{"body": "') && cleanedResponse.endsWith('"}')) {
            cleanedResponse = cleanedResponse.substring(10, cleanedResponse.length - 2);
        }

        cleanedResponse = cleanedResponse.replace(/\\n/g, '<br>').replace(/\\'/g, "'").replace(/\\"/g, '"');
      console.log('Processed botResponse:', cleanedResponse);

      setMessages(prevMessages => [...prevMessages, { text: cleanedResponse, user: 'bot' }]);
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
                <div dangerouslySetInnerHTML={{ __html: msg.text }}></div>
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
