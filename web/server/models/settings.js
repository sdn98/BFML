const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  library: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
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
  dataset: {
    type: String,
    required: true,
  },
  dataset_url: {
    type: String,
    required: true,
  },
  dataset_format: { 
    type: String,
    required: true,
 },
 dataset_size: { 
  type: Number,
  required: true,
},
datapoints_number: { 
  type: Number,
  required: true,
},
GPU: { 
  type: Boolean,
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
},
script: {
  type: String,
  required: true,
},
});

const library = mongoose.model("library", librarySchema);

module.exports = library;