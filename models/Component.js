const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
  pin_id: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ANALOG_IN', 'ANALOG_OUT', 'DIGITAL_IO', 'POWER_VCC', 'POWER_GND', 'PASSIVE'],
    default: 'PASSIVE'
  },
  x_rel: { type: Number, required: true },
  y_rel: { type: Number, required: true }
});

const ComponentSchema = new mongoose.Schema({
  component_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  domain: [String],
  pins: [PinSchema],
  simulation: {
    model_type: { 
      type: String, 
      enum: ['SPICE_MODEL', 'SPICE_SUBCKT', 'BEHAVIORAL_JS', 'WASM_MCU'],
      default: 'SPICE_MODEL'
    },
    spice_template: { type: String },
    default_params: { type: Map, of: String }
  },
  visuals: {
    width: { type: Number, default: 80 },
    height: { type: Number, default: 40 },
    color: { type: String, default: '#333333' }
  }
});

module.exports = mongoose.model('Component', ComponentSchema);