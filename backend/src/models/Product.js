const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  cost: Number,
  category: String,
  name: String,
  brand: String,
  retail_price: Number,
  department: String,
  sku: String,
  distribution_center_id: Number
}, { _id: false });

module.exports = mongoose.model('Product', productSchema);