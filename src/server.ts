import express from "express";
import { Request, Response, NextFunction } from "express";
import config from "./modules/config";

import { setup } from "./modules/db";
setup();

/* Allows Request to have a userId property */
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const app = express();

import routes from "./routes";
import middleware from "./middleware";

middleware(app);
routes(app);

app.all("*", (req, res) => {
    res.status(404).send({ error: "Not Found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: "" });
});

app.listen(config.port, () =>
    console.log(`\nListening at port ${config.port}!\n`),
);
