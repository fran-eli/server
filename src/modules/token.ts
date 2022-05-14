import jwt from "jsonwebtoken";
import config from "./config";

export const genToken = (userId: string) => {
    return jwt.sign({ sub: userId }, config.api.jwt_secret, {
        expiresIn: "20d",
    });
};
