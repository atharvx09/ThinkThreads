const { v4: uuidv4 } = require('uuid');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const llmService = require('../services/llmService');
const queryService = require('../services/queryService');

const chatController = {
  async sendMessage(req, res) {
    try {
      const { message, conversation_id, user_id } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      let conversationId = conversation_id;

      // Create new conversation if none provided
      if (!conversationId) {
        conversationId = uuidv4();
        const newConversation = new Conversation({
          conversation_id: conversationId,
          user_id: user_id || null,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        });
        await newConversation.save();
      }

      // Save user message
      const userMessage = new Message({
        conversation_id: conversationId,
        message_type: 'user',
        content: message,
        metadata: {
          intent: await llmService.classifyIntent(message)
        }
      });
      await userMessage.save();

      // Generate bot response
      const conversationHistory = await Message.find({ conversation_id: conversationId })
        .sort({ timestamp: 1 })
        .limit(10);

      const response = await llmService.generateResponse(message, conversationHistory);
      
      // Save bot response
      const botMessage = new Message({
        conversation_id: conversationId,
        message_type: 'bot',
        content: response.content,
        metadata: response.metadata
      });
      await botMessage.save();

      res.json({
        conversation_id: conversationId,
        response: response.content,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
};

module.exports = chatController;