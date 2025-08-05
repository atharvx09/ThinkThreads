const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get all conversations
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id ? { user_id: parseInt(user_id) } : {};
    
    const conversations = await Conversation.find(query)
      .sort({ updated_at: -1 })
      .limit(20);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get conversation messages
router.get('/:conversation_id/messages', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const messages = await Message.find({ conversation_id })
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;