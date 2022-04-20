import { Request, Response } from "express";

import { createUser } from "../modules/db";

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

    if (output === "") res.status(204).send();
    else res.status(400).send({ error: output });
};
