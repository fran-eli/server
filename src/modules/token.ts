import jwt from "jsonwebtoken";
import config from "./config";

export const genToken = (userId: string, serverId: string) => {
    return jwt.sign({ sub: userId, aud: serverId }, config.api.jwt_secret, {
        algorithm: "RS256",
        expiresIn: "20d",
    });
};
