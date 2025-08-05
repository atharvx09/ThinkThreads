import React from 'react';
import { Clock } from 'lucide-react';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-50 border border-blue-200' 
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <div className="font-medium text-sm text-gray-900 truncate">
        {conversation.title}
      </div>
      <div className="text-xs text-gray-500 mt-1 truncate">
        {conversation.status}
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
        <Clock className="w-3 h-3" />
        {new Date(conversation.updated_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ConversationItem;