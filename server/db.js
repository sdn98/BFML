const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;