import { Application } from "express-ws";

import register from "./routes/register";
import login from "./routes/login";

export default (app: Application) => {
    app.post("/users/register/", (req, res) => register(req, res));
    app.post("/users/login/", (req, res) => login(req, res));

    app.ws("/ws/", (ws, req) => {
        ws.on("message", (msg) => {
            ws.send("ping! " + msg);
            console.log(msg);
        });
    });
};
