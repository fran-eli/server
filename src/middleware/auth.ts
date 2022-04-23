import { Request, Response, NextFunction } from "express";
import config from "../modules/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith("/register") || req.url.startsWith("/login"))
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
                throw e; // WILL throw error if anything that i havent come up with comes up
        }
    }

    if (tokenPayload["aud"] !== "1")
        return res.status(401).send({
            error: "Invalid token (token not intended for central server)",
        });
    if (!tokenPayload["sub"])
        return res.status(401).send({ error: "Invalid token" });

    req.userId = tokenPayload.sub;

    next();
};
