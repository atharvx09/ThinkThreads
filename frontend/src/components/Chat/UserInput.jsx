import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { chatAPI } from '../../services/api';

const UserInput = () => {
  const [inputValue, setInputValue] = useState('');
  const { state, dispatch } = useChat();

  const quickActions = [
    'Track my order',
    'Size guide',
    'Return policy',
    'Shipping info'
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || state.isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });

    const messageToSend = inputValue;
    setInputValue('');

    try {
      const response = await chatAPI.sendMessage(
        messageToSend,
        state.currentConversationId,
        state.userId
      );

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        timestamp: new Date()
      };

      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
      
      if (!state.currentConversationId) {
        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: response.conversation_id });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    }

    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about orders, products, shipping, returns..."
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="1"
            style={{ maxHeight: '120px' }}
            disabled={state.isLoading}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || state.isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => setInputValue(action)}
            disabled={state.isLoading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm rounded-full transition-colors"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserInput;