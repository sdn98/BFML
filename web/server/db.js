const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;