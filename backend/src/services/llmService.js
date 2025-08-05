const groq = require('../config/groq');
const queryService = require('./queryService');

const llmService = {
  async generateResponse(userMessage, conversationHistory) {
    try {
      const intent = await this.classifyIntent(userMessage);
      let systemPrompt = this.getSystemPrompt(intent);
      let contextData = {};

      // Get relevant data based on intent
      if (intent === 'order_inquiry') {
        contextData = await queryService.getOrderInfo(userMessage);
      } else if (intent === 'product_search') {
        contextData = await queryService.searchProducts(userMessage);
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.message_type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      if (Object.keys(contextData).length > 0) {
        messages.splice(1, 0, {
          role: 'system',
          content: `Context data: ${JSON.stringify(contextData)}`
        });
      }

      const completion = await groq.chat.completions.create({
        messages,
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 500
      });

      return {
        content: completion.choices[0].message.content,
        metadata: {
          intent,
          context_used: Object.keys(contextData).length > 0
        }
      };

    } catch (error) {
      console.error('LLM Service error:', error);
      return {
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team directly.",
        metadata: { error: true }
      };
    }
  },

  async classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
      return 'order_inquiry';
    }
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'return_request';
    }
    if (lowerMessage.includes('product') || lowerMessage.includes('search') || lowerMessage.includes('find')) {
      return 'product_search';
    }
    if (lowerMessage.includes('size') || lowerMessage.includes('sizing')) {
      return 'sizing_help';
    }
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'shipping_inquiry';
    }
    
    return 'general_inquiry';
  },

  getSystemPrompt(intent) {
    const basePrompt = `You are a helpful customer service assistant for an ecommerce clothing website. 
    Be friendly, professional, and concise. Always try to be helpful and ask clarifying questions when needed.`;

    const intentPrompts = {
      order_inquiry: `${basePrompt} The user is asking about their order. Help them track orders, check status, or resolve order issues.`,
      product_search: `${basePrompt} The user is looking for products. Help them find items, compare options, and provide product information.`,
      return_request: `${basePrompt} The user wants to return something. Guide them through the return process and policy.`,
      sizing_help: `${basePrompt} The user needs sizing help. Provide size charts and fitting advice.`,
      shipping_inquiry: `${basePrompt} The user is asking about shipping. Provide shipping options, costs, and timeframes.`,
      general_inquiry: basePrompt
    };

    return intentPrompts[intent] || basePrompt;
  }
};

module.exports = llmService;