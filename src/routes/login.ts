import { Request, Response } from "express";

import { IUser } from "../modules/models";

import { authUser, UserAuthError } from "../modules/db";
import { genToken } from "../modules/token";

export default async (req: Request, res: Response) => {
    const output = await authUser(
        req.body.password,
        req.body.name,
        req.body.discrim,
        req.body.email,
    );

    if (Object.values(UserAuthError).includes(output[1] as UserAuthError))
        return res.status(output[0] as number).send({ error: output[1] });

    return res.send({ token: genToken(output[1]) });
};
