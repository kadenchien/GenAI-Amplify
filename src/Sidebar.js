// src/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="chat-history">
        <h2>APL LLM Gateway</h2>
        <ul>
          {/* Example chat history items */}
          <li>Chat with Cohere</li>
          <li>Chat with Claude</li>
          <li>Chat with Mistral</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;