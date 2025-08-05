const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const queryService = {
  async searchProducts(query) {
    try {
      const searchTerms = query.toLowerCase().split(' ');
      const products = await Product.find({
        $or: [
          { name: { $regex: searchTerms.join('|'), $options: 'i' } },
          { category: { $regex: searchTerms.join('|'), $options: 'i' } },
          { brand: { $regex: searchTerms.join('|'), $options: 'i' } },
          { department: { $regex: searchTerms.join('|'), $options: 'i' } }
        ]
      }).limit(10);

      return { products };
    } catch (error) {
      console.error('Product search error:', error);
      return { products: [] };
    }
  },

  async getOrderInfo(query) {
    try {
      // Extract order number from query (simple regex)
      const orderMatch = query.match(/#?(\d+)/);
      if (!orderMatch) return {};

      const orderId = parseInt(orderMatch[1]);
      const order = await Order.findOne({ order_id: orderId });
      
      if (!order) return { error: 'Order not found' };

      return { order };
    } catch (error) {
      console.error('Order query error:', error);
      return { error: 'Failed to fetch order information' };
    }
  },

  async getUserOrders(userId) {
    try {
      const orders = await Order.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(10);
      return { orders };
    } catch (error) {
      console.error('User orders query error:', error);
      return { orders: [] };
    }
  }
};

module.exports = queryService;