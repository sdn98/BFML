const express = require('express');
const app = express();
const connectDB = require('./db');
const cors = require('cors');

connectDB();
app.use(express.urlencoded({extended: true})); 
app.use(express.json({inflate: true}));
app.use(cors());
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Origin: *'
  );
  res.send('Api running');
});

    // Connecting Routes

    app.use("/api/settings", require("./routes/settings"));

    const PORT = 5000;

    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
    
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Logged Error: ${err.message}`);
      server.close(() => process.exit(1));
    });