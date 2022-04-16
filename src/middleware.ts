import { Express } from "express";

import bodyParser from "body-parser";

import logger from "./middleware/logger";

export default (app: Express) => {
    app.use(bodyParser.json());

    app.use(logger);
};
