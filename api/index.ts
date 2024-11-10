import { getCampusInfo } from "./controllers/campusInfoController";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport"); // passport is a middleware for authentication
const localStrategy = require("passport-local").Strategy;
import User from "./models/user"; // Ensure the correct import
import Room from "./models/room"; // Ensure the correct import
import Message from "./models/message";
const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); // handle URL-encoded data
app.use(bodyParser.json()); // handle JSON-encoded data
app.use(passport.initialize());
const jwt = require("jsonwebtoken");
const mongoose_url =
  "mongodb+srv://userconnexx:4XbIWfAojr4Rv0dz@cluster0.uuw5l.mongodb.net/";
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

app.post("/register", async (req: any, res: any) => {
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
      console.log(err);
    });
});

// end point to access all users except the user who ia currently logged in
app.get("/rooms/:userId", async (req: any, res: any) => {
  const loggedInUserId = req.params.userId;
  console.log("Logged in user id: ", loggedInUserId);
  User.findOne({ clerkId: loggedInUserId })
    .populate("partOfRooms")
    .then((room: any) => {
      if (room) {
        console.log("Rooms retrieved successfully", room.partOfRooms.length);
        res.status(200).json(room.partOfRooms);
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err: any) => {
      res.status(500).json(err);
      console.log("Error retrieving rooms " + err);
    });
});

// end point to create rooms
app.post("/rooms", async (req: any, res: any) => {
  const { roomName, roomCreator, roomDescription, imageLink } = req.body;
  console.log("Creating room serer", req.body);
  const roomAdmin = await User.findOne({ clerkId: roomCreator });
  const newRoom = new Room({
    roomName,
    roomCreator,
    roomAdmins: [roomAdmin],
    roomDescription,
    imageLink,
  });
  newRoom
    .save()
    .then((room: any) => {
      if (roomAdmin) {
        roomAdmin.partOfRooms.push(newRoom._id);
        roomAdmin
          .save()
          .then((user: any) => {
            console.log("User updated with room", user);
          })
          .catch((err: any) => {
            console.log("Error updating user with room", err);
          });
        res.status(200).json("Room created Successfully: " + room);
      } else {
        res.status(404).json("Room creator not found");
      }
    })
    .catch((err: any) => {
      res.status(500).json(err + "Error creating room");
      console.log(err);
    });
});

app.get("/campus-info", getCampusInfo);

const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req: any, file: any, cb: any) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/sendMessage", upload.none(), async (req: any, res: any) => {
  try {
    // console.log("Received message data:", req.body);

    const { message, senderId, messageType, roomId, imageUrl } = req.body;
    console.log("Received message data:", req.body);
    const sender = await User.findOne({ clerkId: senderId });
    const room = await Room.findById(roomId);
    const newMessage = new Message({
      message,
      senderId: sender,
      messageType,
      roomId: room,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? imageUrl : "",
    });
    await newMessage.save();
    if (room) {
      room.lastMessage = newMessage.message;
      room.lastMessageTime = newMessage.timestamp;
      await room.save();
    } else {
      res.status(404).json("Room not found");
      return;
    }
    res.status(200).json("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json("Failed to send message");
  }
});

app.get("/room/:roomId", async (req: any, res: any) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    // console.log("Room retrieved successfully", room);
    res.status(200).json(room);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json("Failed to get user");
  }
});

// end point to fetch all messages in a room
app.get("/messages/:userId/:roomId", async (req: any, res: any) => {
  try {
    const { userId, roomId } = req.params;
    const user = await User.findOne({ clerkId: userId });
    const room = await Room.findById(roomId);
    if (room?._id && user?.partOfRooms?.includes(room._id)) {
      const messages = await Message.find({ roomId }).populate("senderId");
      res.status(200).json(messages);
    } else {
      res.status(403).json("You are not a member of this room");
    }
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json("Failed to get messages");
  }
});

// fetch current user data based on user Id
app.get("/user/:userId", async (req: any, res: any) => {
  try {
    // console.log("User ID", req.params);
    const { userId } = req.params;
    const user = await User.findOne({ clerkId: userId });
    // console.log("User retrieved successfully", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json("Failed to get user");
  }
});

// handle permission updates
