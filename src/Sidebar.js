// src/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false); // State to manage sidebar collapse
  
    const toggleSidebar = () => {
      setCollapsed(!collapsed); // Toggle the collapsed state
    };
  
    return (
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronLeft} />}
        </button>
        {!collapsed && ( // Only render content when not collapsed
          <div className="chat-history">
            <h2>APL LLM Gateway</h2>
            <ul>
              <li>Chat with Cohere</li>
              <li>Chat with Claude</li>
              <li>Chat with Mistral</li>
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default Sidebar;