import { Request, Response } from "express";

import { createUser, UserCreationError } from "../modules/db";
import { genToken } from "../modules/token";

export default async (req: Request, res: Response) => {
    if (!req.body.name || !req.body.password)
        return res.status(400).send({
            error: "Missing name or password",
        });

    const output = await createUser(
        req.body.name,
        req.body.password,
        req.body.discrim,
        req.body.email,
    );

    if (Object.values(UserCreationError).includes(output as UserCreationError))
        return res.status(400).send({ error: output });

    //if (output === "") res.status(204).send();
    res.status(200).send({ token: genToken(output, "1") });
};
