import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../modules/config";
import { userTokenInvalid } from "../modules/db";

export default async (req: Request, res: Response, next: NextFunction) => {
    if (
        req.url.startsWith("/users/register") ||
        req.url.startsWith("/users/login")
    )
        return next();

    const tokenHeader = req.header("Authorization");
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
        return res.status(401).send({ error: "No token provided" });
    }

    const token = tokenHeader.split("Bearer ")[1];
    if (!token) return res.status(401).send({ error: "No token provided" });

    let tokenPayload: JwtPayload;

    try {
        tokenPayload = jwt.verify(token, config.api.jwt_public) as JwtPayload;
    } catch (e: any) {
        switch (e.message) {
            case "invalid signature" ||
                "jwt malformed" ||
                "jwt signature is required":
                return res.status(401).send({ error: "Invalid token" });
            case "jwt expired":
                return res.status(401).send({ error: "Token expired" });
            default:
                throw e;
        }
    }

    if (!tokenPayload.sub || !tokenPayload.iat)
        return res.status(401).send({ error: "Invalid token" });

    if (await userTokenInvalid(tokenPayload.sub, tokenPayload.iat))
        return res
            .status(401)
            .send({ error: "Password has been changed since token creation" }); // CONTINUE

    next();
};
