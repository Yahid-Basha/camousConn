import { getCampusInfo } from "./controllers/campusInfoController";
import { getUserData } from "./controllers/userController";
import { updateUserInfo } from "./controllers/updateUserInfo";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport"); // passport is a middleware for authentication
const localStrategy = require("passport-local").Strategy;
import User from "./models/user"; // Ensure the correct import

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); // handle URL-encoded data
app.use(bodyParser.json()); // handle JSON-encoded data
app.use(passport.initialize());
const jwt = require("jsonwebtoken");
console.log(process.env.MONGODB_URI);
const mongoose_url = "mongodb+srv://userconnexx:4XbIWfAojr4Rv0dz@cluster0.uuw5l.mongodb.net/";
mongoose
  .connect(mongoose_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// app.post("/register", async (req: any, res: any) => {
//   const { name, email, username } = req.body;
//     // create a new user
//     console.log("Creating user", req.body);
//   const newUser = new User({
//       email,
//     name,
//     username,
//   });

//   newUser.save().then((user: any) => {
//     res.status(200).json("User created Successfully: " + user);
//   }).catch((err: any) => {
//       res.status(500).json(err + "Error creating user");
//       console.log(err);
//   });
// });

app.post("/register", async (req: any, res:any) => {
  const { name, email, username, clerkId } = req.body;
  console.log("Received user data:", req.body);
  // create a new user
    const newUser = new User({
        clerkId,
        username,
        name,
        email,
  });
  console.log(newUser);
  newUser
    .save()
    .then((user) => {
      res.status(200).json("User created Successfully: " + user);
    })
    .catch((err) => {
        res.status(500).json("Error creating user: " + err);
        console.log(err)
    });
});

app.get("/campus-info", getCampusInfo);
app.get('/user', getUserData);
app.put("/user/update-info", updateUserInfo);

