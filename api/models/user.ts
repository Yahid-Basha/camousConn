import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    required: true,
    // sparse: true, // Allows null values but ensures uniqueness for non-null values
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  interests: [String],
  department: {
    type: String,
    default: "no department set", // Default value for department
  },
  regulation: {
    type: String,
    default: "no regulation set", // Default value for regulation
  },
  rollno: {
    type: String,
    default: "no rollno set", // Default value for rollno
  },
  connectRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentConnectRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  eventsParticipated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  eventsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  eventsWon: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  partOfRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  RoomsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],

  attendance: Number,
  upcomingAssignments: [{ title: String, dueDate: Date }],
  upcomingExams: [{ subject: String, examDate: Date }],
  achievements: [{ title: String, description: String, date: Date }],
  certificates: [String], // URLs or filenames
  extracurricularActivities: [String],
  grades: { type: Map, of: String },
});

export const User = mongoose.model("User", userSchema);
export default User;
