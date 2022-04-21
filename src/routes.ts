import { Express } from "express";

import register from "./routes/register";
import login from "./routes/login";

export default (app: Express) => {
    app.post("/register/", (req, res) => register(req, res));
    app.post("/login/", (req, res) => login(req, res));
};
