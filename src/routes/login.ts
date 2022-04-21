import { Request, Response } from "express";

import { IUser } from "../modules/models";

import { authUser, UserAuthError } from "../modules/db";
import { genToken } from "../modules/token";

export default async (req: Request, res: Response) => {
    if (!(req.body.guildIds instanceof Array))
        return res.status(400).send({ error: "No target guild id provided" });

    const output = await authUser(
        req.body.password,
        req.body.name,
        req.body.discrim,
        req.body.email,
    );

    if (output in UserAuthError) return res.status(401).send({ error: output });

    let payload: { [key: string]: string } = {};

    req.body.guildIds.forEach((x: string) => {
        payload[x] = genToken(output, req.body.guildId);
    });

    return res.send({ tokens: payload });
};
