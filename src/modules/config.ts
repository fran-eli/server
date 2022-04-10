import { config } from "dotenv";
config();

export default {
    port: process.env.PORT || 3000,
    version: process.env.npm_package_version,
};
