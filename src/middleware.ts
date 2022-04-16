import { Express } from "express";

import logger from "./middleware/logger";

export default (app: Express) => {
    app.use(logger);
};
