import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // unique & required is false by default
    id: { type: String, index: { unique: true }, required: true },
    name: { type: String, required: true },
    discriminator: { type: String, required: true },
    password: { type: String, required: true },
    info: {
        pronouns: String,
        bio: String,
    },
    avatarURL: String,
    email: { type: String, index: { unique: true } },
    createdAt: Date,
    updatedAt: Date,
});

export const User = mongoose.model("User", userSchema);
