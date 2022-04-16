import { Request, Response } from "express";

import { createUser } from "../modules/db";

export default (req: Request, res: Response) => {
    if (!req.body.name || !req.body.password)
        return res.status(400).send({ error: "Missing name or password" });

    createUser(req.body.name, req.body.password, req.body.email);

    res.status(204).send();
};
