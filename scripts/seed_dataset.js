const mongoose = require('mongoose');
const Component = require('../models/Component');

mongoose.connect('mongodb://127.0.0.1:27017/love_connections');

const dataset = [
  {
    component_id: "DC_VOLTAGE",
    name: "DC Voltage Source",
    category: "Power Sources",
    domain: ["Basic Electronics", "Circuits and Networks"],
    pins: [
      { pin_id: "POS", label: "+", type: "POWER_VCC", x_rel: 0, y_rel: -25 },
      { pin_id: "NEG", label: "-", type: "POWER_GND", x_rel: 0, y_rel: 25 }
    ],
    simulation: {
      model_type: "SPICE_MODEL",
      spice_template: "V{id} {node_pos} {node_neg} DC {value}",
      default_params: { value: "9V" }
    },
    visuals: { width: 40, height: 50, color: "#e67e22" }
  },
  {
    component_id: "RES_GENERIC",
    name: "Resistor",
    category: "Passives",
    domain: ["Basic Electronics", "Circuits"],
    pins: [
      { pin_id: "P1", label: "1", type: "PASSIVE", x_rel: -35, y_rel: 0 },
      { pin_id: "P2", label: "2", type: "PASSIVE", x_rel: 35, y_rel: 0 }
    ],
    simulation: {
      model_type: "SPICE_MODEL",
      spice_template: "R{id} {node1} {node2} {resistance}",
      default_params: { resistance: "1k" }
    },
    visuals: { width: 70, height: 20, color: "#d2b48c" }
  },
  {
    component_id: "LED_RED",
    name: "Red LED",
    category: "Optoelectronics",
    domain: ["Basic Electronics", "Digital Electronics"],
    pins: [
      { pin_id: "ANODE", label: "A", type: "PASSIVE", x_rel: -25, y_rel: 0 },
      { pin_id: "CATHODE", label: "K", type: "PASSIVE", x_rel: 25, y_rel: 0 }
    ],
    simulation: {
      model_type: "SPICE_MODEL",
      spice_template: "D{id} {node_a} {node_k} DLED\n.MODEL DLED D(Is=1e-14 Rs=10)",
      default_params: {}
    },
    visuals: { width: 50, height: 30, color: "#e74c3c" }
  },
  {
    component_id: "OPAMP_LM741",
    name: "LM741 Operational Amplifier",
    category: "Op-Amps",
    domain: ["Microelectronics", "Linear ICs"],
    pins: [
      { pin_id: "IN_NEG", label: "-", type: "ANALOG_IN", x_rel: -40, y_rel: -15 },
      { pin_id: "IN_POS", label: "+", type: "ANALOG_IN", x_rel: -40, y_rel: 15 },
      { pin_id: "OUT", label: "OUT", type: "ANALOG_OUT", x_rel: 40, y_rel: 0 },
      { pin_id: "V_PLUS", label: "V+", type: "POWER_VCC", x_rel: 0, y_rel: -30 },
      { pin_id: "V_MINUS", label: "V-", type: "POWER_GND", x_rel: 0, y_rel: 30 }
    ],
    simulation: {
      model_type: "SPICE_SUBCKT",
      spice_template: "X{id} {node_pos} {node_neg} {node_vplus} {node_vminus} {node_out} LM741",
      default_params: {}
    },
    visuals: { width: 80, height: 60, color: "#2c3e50" }
  }
];

async function seed() {
  await Component.deleteMany({});
  await Component.insertMany(dataset);
  console.log("Database seeded successfully with components.");
  mongoose.connection.close();
}

seed();