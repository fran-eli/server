import { config } from "dotenv";
config();

if (process.env.JWT_SECRET === undefined)
    new Error("JWT_SECRET environment variable is undefined");

console.log(
    process.env.PASSWORD
        ? `Running with password "${process.env.PASSWORD}"...`
        : "Running without password...",
);

export default {
    port: process.env.PORT || 3000,
    version: process.env.npm_package_version,
    api: {
        password: process.env.PASSWORD || undefined,
        jwt_secret: process.env.JWT_SECRET as string,
    },
};
