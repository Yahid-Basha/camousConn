import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contentType: {
        type: String,
        enum: ["text", "image", "video", "doc"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    assetUrl: String,
    timestamp: {
        type: Date,
        required: true,
    },
});

export const Message = mongoose.model("Message", messageSchema);
module.exports = Message;