import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "video", "doc"],
    required: true,
  },
  message: {
    type: String,
  },
  imageUrl: String,
  timestamp: {
    type: Date,
    required: true,
  },
});

export const Message = mongoose.model("Message", messageSchema);
export default Message;
