import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { User, IUser } from "./models";
import RandExp from "randexp";

export const setup = () => {
    mongoose.connect("mongodb://0.0.0.0:27017/usersdb");

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error:"));
    db.once("open", () => console.log("Connected to MongoDB successfully."));
};

// ---

enum UserCreationError {
    None = "",
    DiscriminatorTaken = "Username and discriminator combination are taken.",
    DiscriminatorInvalid = "Discriminator input invalid.",
}

let userIncrement = 0;

export const createUser = async (
    name: string,
    password: string,
    discrim?: string | undefined,
    email?: string | undefined,
): Promise<UserCreationError> => {
    if (discrim === undefined) {
        while (true) {
            discrim = new RandExp(/([A-Z0-9]){4}/).gen();
            if (!(await isDiscrimTaken(name, discrim))) break;
        }
    } else {
        if (discrim.length !== 4 || discrim.match(/([^A-Z0-9])/g))
            return UserCreationError.DiscriminatorInvalid;

        if (await isDiscrimTaken(name, discrim))
            return UserCreationError.DiscriminatorTaken;
    }

    const user = new User({
        id: genId(),
        name,
        discriminator: discrim,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    user.save();
    return UserCreationError.None;
};

function hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function genId() {
    return `${Date.now() - 1640995200}${userIncrement++}`;
}

async function isDiscrimTaken(name: string, discrim: string): Promise<boolean> {
    return await new Promise((resolve) => {
        User.findOne({ name: name, discriminator: discrim }).exec(
            (err, user) => {
                if (user === null) resolve(false);
                else resolve(true);
            },
        );
    });
}

// ---

export enum UserAuthError {
    None = "",
    MissingCredentials = "Missing username and discriminator pair, or email.",
    IncorrectPassword = "Incorrect password.",
    NotFound = "User not found.",
}

export const authUser = async (
    password: string,
    name?: string,
    discrim?: string,
    email?: string,
): Promise<UserAuthError | string> => {
    return await new Promise(async (resolve) => {
        let user;

        if (name && discrim) {
            user = await User.findOne({ name, discriminator: discrim });
        } else if (email) {
            user = await User.findOne({ email });
        } else {
            return resolve(UserAuthError.MissingCredentials);
        }

        if (user === null) return resolve(UserAuthError.NotFound);

        if (bcrypt.compareSync(password, user.password))
            return resolve(user.id);
        else return resolve(UserAuthError.NotFound);
    });
};
