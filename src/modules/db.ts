import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { User } from "./models";

export const setup = () => {
    mongoose.connect("mongodb://0.0.0.0:27017/usersdb");

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error:"));
    db.once("open", () => console.log("Connected to MongoDB successfully."));
};

let userIncrement = 0;

export const createUser = (
    name: string,
    password: string,
    email?: string | undefined,
) => {
    const user = new User({
        id: genId(),
        name,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    user.save();
};

function hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function genId() {
    return `${Date.now() - 1640995200}${userIncrement++}`;
}
