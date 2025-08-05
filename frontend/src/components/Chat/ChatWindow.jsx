import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import ConversationHistory from '../Sidebar/ConversationHistory';
import { useChat } from '../../context/ChatContext';
import { ShoppingBag } from 'lucide-react';

const ChatWindow = () => {
  const { state } = useChat();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-blue-600 text-white">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-6 h-6" />
            <h1 className="text-lg font-semibold">ThinkThreads.</h1>
          </div>
        </div>
        <ConversationHistory />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Customer Support</h2>
              <p className="text-sm text-gray-600">
                {state.isLoading ? 'Typing...' : 'Online • Ready to help'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <MessageList />

        {/* Input */}
        <UserInput />
      </div>
    </div>
  );
};

export default ChatWindow;