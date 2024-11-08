const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport"); // passport is a middleware for authentication
const localStrategy = require("passport-local").Strategy;

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); // handle URL-encoded data
app.use(bodyParser.json()); // handle JSON-encoded data
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

const mongoose_url =
  process.env.MONGOOSE_URL || "mongodb://localhost:27017/mean";
mongoose
  .connect(mongoose_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
