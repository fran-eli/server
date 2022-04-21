import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    id: string;
    name: string;
    discriminator: string;
    password: string;
    info?: object;
    avatarUrl?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

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

export const User = mongoose.model<IUser>("User", userSchema);
