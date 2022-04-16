import { Express } from "express";

import register from "./routes/register";

export default (app: Express) => {
    app.post("/register/", (req, res) => register(req, res));
};
