import mongoose from "mongoose";
import bcrypt from "bcrypt";
import RandExp from "randexp";

import { User, IUser } from "./models";
import { isPasswordValid } from "./token";

export const setup = () => {
    mongoose.connect("mongodb://0.0.0.0:27017/franeli");

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error:"));
    db.once("open", () => console.log("Connected to MongoDB successfully."));
};

// ---

export enum UserCreationError {
    None = "",
    DiscriminatorTaken = "Username and discriminator combination taken",
    DiscriminatorInvalid = "Discriminator input invalid",
    EmailTaken = "Email taken",
    PasswordInvalid = "Password invalid (length < 3)",
}

let userIncrement = 0;

export const createUser = async (
    name: string,
    password: string,
    discrim?: string | undefined,
    email?: string | undefined,
): Promise<[400 | 409, UserCreationError] | string> => {
    if (discrim === undefined) {
        while (true) {
            discrim = new RandExp(/([A-Z0-9]){4}/).gen();
            if (!(await isDiscrimTaken(name, discrim))) break;
        }
    } else {
        if (discrim.length !== 4 || discrim.match(/([^A-Z0-9])/g))
            return [400, UserCreationError.DiscriminatorInvalid];

        if (await isDiscrimTaken(name, discrim))
            return [409, UserCreationError.DiscriminatorTaken];
    }

    if (email)
        if (await isEmailTaken(email))
            return [409, UserCreationError.EmailTaken];
    
    if (!isPasswordValid(password)) return [400, UserCreationError.PasswordInvalid];

    const id = genId();

    const user = new User({
        id: id,
        name,
        discriminator: discrim,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordUpdatedAt: new Date(),
    });

    user.save();
    return id;
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

async function isEmailTaken(email: string): Promise<boolean> {
    return await new Promise((resolve) => {
        User.findOne({ email: email }).exec((err, user) => {
            if (user === null) resolve(false);
            else resolve(true);
        });
    });
}

// ---

export enum UserAuthError {
    None = "",
    MissingCredentials = "Missing username and discriminator pair, or email",
    IncorrectPassword = "Incorrect password",
    NotFound = "User not found",
}

export const authUser = async (
    password: string,
    name?: string,
    discrim?: string,
    email?: string,
): Promise<[200 | 400 | 401, UserAuthError | string]> => {
    return await new Promise(async (resolve) => {
        let user;

        if (name && discrim) {
            user = await User.findOne({ name, discriminator: discrim });
        } else if (email) {
            user = await User.findOne({ email });
        } else {
            return resolve([400, UserAuthError.MissingCredentials]);
        }

        if (user === null) return resolve([200, UserAuthError.NotFound]);

        if (bcrypt.compareSync(password, user.password))
            return resolve([200, user.id]);
        else return resolve([401, UserAuthError.IncorrectPassword]);
    });
};

// ---

export const userTokenInvalid = async (
    id: string,
    iat: number,
): Promise<boolean | undefined> => {
    return await new Promise((resolve) => {
        User.findOne({ id }).exec((err, user) => {
            if (user === null) return resolve(undefined);

            if (user.passwordUpdatedAt < new Date(iat)) return resolve(true);
            else return resolve(false);
        });
    });
};
