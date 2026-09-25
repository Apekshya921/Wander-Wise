import express from "express";
import connectDB from "./config/database.js";

import HANDLERS from "./handlers/index.js";
import errorMiddleware from "./middlewares/error.js";
import { authMiddleware } from "./middlewares/auth.js";
import cors from "cors";

const app = express();

const port = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(authMiddleware);

app.use("/", HANDLERS);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});