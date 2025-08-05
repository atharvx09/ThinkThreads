import React, { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { chatAPI } from '../../services/api';
import ConversationItem from './ConversationItem';

const ConversationHistory = () => {
  const { state, dispatch } = useChat();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const conversations = await chatAPI.getConversations(state.userId);
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleNewConversation = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: null });
  };

  const handleLoadConversation = async (conversationId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const messages = await chatAPI.getConversationMessages(conversationId);
      
      const formattedMessages = messages.map(msg => ({
        id: msg._id,
        type: msg.message_type,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      dispatch({ type: 'SET_MESSAGES', payload: formattedMessages });
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationId });
    } catch (error) {
      console.error('Error loading conversation:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load conversation' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <button 
        onClick={handleNewConversation}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors mb-4"
      >
        + New Conversation
      </button>
      
      <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Conversations</h3>
      
      <div className="space-y-2">
        {state.conversations.map((conversation) => (
          <ConversationItem
            key={conversation.conversation_id}
            conversation={conversation}
            isActive={state.currentConversationId === conversation.conversation_id}
            onClick={() => handleLoadConversation(conversation.conversation_id)}
          />
        ))}
        
        {state.conversations.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No conversations yet.<br />
            Start chatting to see your history here.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;


// This component displays the conversation history sidebar in the chat application.