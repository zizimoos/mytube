import "@babel/polyfill";
import dotenv from "dotenv";
import app from "./app";
import "./db";
import "./models/Video";
import "./models/Comment";
import "./models/User";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Listening on : http://localhost:${PORT}`));
