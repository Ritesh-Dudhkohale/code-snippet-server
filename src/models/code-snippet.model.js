import { Schema, model } from "mongoose";

const codeSnippetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["JAVA", "PYTHON", "HTML", "CSS", "JAVASCRIPT"],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CodeSnippet = model("CodeSnippet", codeSnippetSchema);
