import jwt from "jsonwebtoken";
import config from "./config";

export const genToken = (userId: string, guildId: string) => {
    return jwt.sign({ sub: userId, aud: guildId }, config.api.jwt_secret, {
        expiresIn: "20d",
    });
};
