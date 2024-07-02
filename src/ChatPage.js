// src/App.js
import React from 'react';
import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';
import './ChatPage.css';

function ChatPage() {
  return (
    <div className="App">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default ChatPage;