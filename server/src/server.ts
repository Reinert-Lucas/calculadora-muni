import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import users from "./routes/users.ts";
import values from "./routes/values.ts";

const PORT = process.env.PORT || 5050;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const app = express();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", users);
app.use("/values", values);
// start the Express server
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
