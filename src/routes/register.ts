import { Request, Response } from "express";

import { createUser, UserCreationError } from "../modules/db";
import { genToken } from "../modules/token";
import config from "../modules/config";

export default async (req: Request, res: Response) => {
    if (!req.body.name || !req.body.password)
        return res.status(400).send({
            error: "Missing name or password",
        });

    if (req.body.serverPassword !== config.api.password)
        return res.status(401).send({ error: "Invalid server password" });

    const output = await createUser(
        req.body.name,
        req.body.password,
        req.body.discrim,
        req.body.email,
    );

    if (
        Object.values(UserCreationError).includes(
            output[1] as UserCreationError,
        )
    )
        return res.status(output[0] as number).send({ error: output[1] });

    res.status(200).send({ token: genToken(output[1]) });
};
