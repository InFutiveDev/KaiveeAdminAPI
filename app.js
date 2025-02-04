const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const routes = require("./routes/index");
const cors = require('cors');
const AutoCron = require('./helpers/testCron');
// =======================
// configuration =========
// =======================
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 0,
  keepAlive: true,
}); // connect to DATABASE_URL
console.log("MongoDb Connection: ", DATABASE_URL);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open to " + DATABASE_URL);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
});

// Body-parser
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/v1", routes);
app.get("/", (req, res) => {
  res.send("Wel-Come to City Imaging Admin");
});

app.listen(PORT, () => {
  AutoCron
  console.log(`Example app listening on port ${PORT}`);
});
