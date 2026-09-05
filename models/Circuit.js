const mongoose = require('mongoose');

const CircuitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, default: 'GuestUser' },
  nodes: [{
    id: String,
    component_id: String,
    x: Number,
    y: Number,
    params: Map
  }],
  wires: [{
    from_node: String,
    from_pin: String,
    to_node: String,
    to_pin: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Circuit', CircuitSchema);