const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true, unique: true },
  user_id: { type: Number, ref: 'User' },
  title: { type: String, default: 'New Conversation' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

conversationSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);