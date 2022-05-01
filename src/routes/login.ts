import { Request, Response } from "express";

import { IUser } from "../modules/models";

import { authUser, UserAuthError } from "../modules/db";
import { genToken } from "../modules/token";

export default async (req: Request, res: Response) => {
    if (!(req.body.serverIds instanceof Array))
        return res
            .status(400)
            .send({ error: "No target guild id(s) provided" });

    const output = await authUser(
        req.body.password,
        req.body.name,
        req.body.discrim,
        req.body.email,
    );

    if (Object.values(UserAuthError).includes(output[1] as UserAuthError))
        return res.status(output[0] as number).send({ error: output[1] });

    let payload: { [key: string]: string } = {};

    req.body.serverIds.forEach((x: string) => {
        payload[x] = genToken(output[1], x);
    });

    return res.send({ tokens: payload });
};
