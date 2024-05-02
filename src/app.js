import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

//routes imports
import userRouter from "./routes/user.routes.js";
import codeSnippetRouter from "./routes/code-snippet.routes.js";


//routes declaration
app.use("/api/users", userRouter);
app.use("/api/code-snippets", codeSnippetRouter);

export default app;
