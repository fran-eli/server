import express from "express";
import config from "./modules/config";

import { setup } from "./modules/db";
setup();

const app = express();

import routes from "./routes";
import middleware from "./middleware";

middleware(app);
routes(app);

app.all("*", (req, res) => {
    res.send({ status: 404, message: "Not Found" });
});

app.listen(config.port, () =>
    console.log(`\nListening at port ${config.port}!\n`),
);
