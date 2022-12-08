const mongoose = require("mongoose");

// schema for a model

const modelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    library_name: {
        type: String,
        required: true,
    },
    version: {
        type: String,
        required: true,
    },
    environment: {
        type: String,
        required: true,
    },
    script: {
        type: String,
        required: true,
    },
});

const model = mongoose.model("model", modelSchema);

module.exports = model;