
import dotenv from "dotenv";
import path from "path";

// Load local .env
dotenv.config();

// Load root .env (parent directory)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

console.log('Environment variables loaded. GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
