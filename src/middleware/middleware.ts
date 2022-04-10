import { Express } from "express";

import logger from "./logger";

export default (app: Express) => {
    app.use(logger);
};
