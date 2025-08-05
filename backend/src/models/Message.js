const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true },
  message_type: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  metadata: {
    query_type: String,
    products_mentioned: [String],
    order_mentioned: String,
    intent: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);