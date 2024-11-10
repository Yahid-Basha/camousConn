import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  roomCreator: {
    type: String,
    required: true,
  },
  roomDescription: {
    type: String,
  },
  lastMessage: {
    type: String,
  },
  lastMessageTime: {
    type: Date,
  },
  imageLink: {
    type: String,
  },
  roomAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  roomMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  roomEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
