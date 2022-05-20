import { Application } from "express-ws";

import bodyParser from "body-parser";

import logger from "./middleware/logger";
import auth from "./middleware/auth";

export default (app: Application) => {
    app.use(bodyParser.json());

    app.use(logger);
    app.use(auth);
};
