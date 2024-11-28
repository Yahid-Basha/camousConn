import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      required: true,
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
      default: "no department set",
    },
    regulation: {
      type: String,
      default: "no regulation set",
    },
    rollno: {
      type: String,
      default: "no rollno set",
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

    // Overwritten during updates
    attendance: {
      type: Number,
      default: null,
    },
    gpa: {
      type: Number,
      default: null,
    },

    // Appended during updates
    upcomingAssignments: [
      {
        title: String,
        dueDate: Date,
      },
    ],
    upcomingExams: [
      {
        subject: String,
        examDate: Date,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        date: Date,
      },
    ],
    certificates: [
      {
        title: String,
        description: String,
        issuedBy: String,
        link: String,
        imageLink: String,
      },
    ], // URLs or filenames
    extracurricularActivities: [String],
    grades: {
      type: Map,
      of: String, // Overwritten during updates
    },

    // Timestamps
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export default User;
