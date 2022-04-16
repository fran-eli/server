import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const setup = () => {
    mongoose.connect("mongodb://0.0.0.0:27017/usersdb");

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => console.log("Connected to MongoDB successfully."));
};
