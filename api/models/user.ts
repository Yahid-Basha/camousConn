const userSchema = new mongoose.Schema({
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
    connectRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    sentConnectRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
})

const User = mongoose.model("User", userSchema);
module.exports = User;
