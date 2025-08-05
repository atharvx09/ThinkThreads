import React, { useEffect, useRef } from 'react';
import Message from './Message';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useChat } from '../../context/ChatContext';

const MessageList = () => {
  const { state } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {state.messages.length === 0 && !state.isLoading && (
        <div className="text-center text-gray-500 mt-10">
          <h3 className="text-lg font-medium mb-2">Welcome to Style Support!</h3>
          <p>Ask me about orders, products, shipping, returns, or anything else.</p>
        </div>
      )}
      
      {state.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {state.isLoading && <LoadingSpinner />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;