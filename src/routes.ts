import { Express } from "express";

import register from "./routes/register";
import login from "./routes/login";

export default (app: Express) => {
    app.post("/users/register/", (req, res) => register(req, res));
    app.post("/users/login/", (req, res) => login(req, res));
};
