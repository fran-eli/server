import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    password: String,
    info: {
        pronouns: String,
        bio: String,
    },
    avatarURL: String,
    email: String,
    createdAt: Date,
    updatedAt: Date,
});

export const User = mongoose.model("User", userSchema);
