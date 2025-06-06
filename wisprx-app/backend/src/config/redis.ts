import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
export const REDIS_URI_CONNECTION = process.env.REDIS_URI || "";
export const REDIS_OPT_LIMITER_MAX = process.env.REDIS_OPT_LIMITER_MAX || 1;
export const REDIS_OPT_LIMITER_DURATION = process.env.REDIS_OPT_LIMITER_DURATION || 3000;
export const REDIS_DB = process.env.REDIS_DB || 0;
export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
export const REDIS_URI = process.env.REDIS_URI || "";
