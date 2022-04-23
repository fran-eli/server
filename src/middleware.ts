import { Express } from "express";

import bodyParser from "body-parser";

import logger from "./middleware/logger";
import auth from "./middleware/auth";

export default (app: Express) => {
    app.use(bodyParser.json());

    app.use(logger);
    app.use(auth);
};
