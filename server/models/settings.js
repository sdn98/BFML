const mongoose = require("mongoose");

// schema for an experiment setting

const settingSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
  },
  fedAlgo: {
    type: String,
    required: true,
  },
  clients_number: {
    type: Number,
    required: true,
  },
  communication_rounds: {
    type: Number,
    required: true,
  },
  dataset: {
    type: String,
    required: true,
  },
GPU: { 
  type: String,
  required: true,
},
 mode: { 
  type: String,
  required: true,
},
epochs: { 
  type: Number,
  required: true,
},
batch_size: { 
  type: Number,
  required: true,
},
learning_rate: { 
  type: String,
  required: true,
},
loss_function: { 
  type: String,
  required: true,
},
optimizer: { 
  type: String,
  required: true,
}
});

const setting = mongoose.model("setting", settingSchema);

module.exports = setting;