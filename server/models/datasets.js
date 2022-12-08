const mongoose = require("mongoose");

// schema for a dataset
const datasetSchema = new mongoose.Schema({
dataset_name: {
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
});

const dataset = mongoose.model("dataset", datasetSchema);

module.exports = dataset;