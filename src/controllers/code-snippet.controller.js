import { CodeSnippet } from "../models/code-snippet.model.js";
import CustomError from "../utils/CustomError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createSnippet = async (req, res) => {
  try {
    const author = req.user?._id;

    const { title, language, code } = req.body;

    if (!title || !title.trim()) {
      throw new CustomError(400, "Enter Title of snippet");
    }

    if (!language || !language.trim()) {
      throw new CustomError(400, "Enter programming language of snippet");
    }

    if (!code || !code.trim()) {
      throw new CustomError(400, "Enter code of snippet");
    }

    const savedCodeSnippet = await CodeSnippet.create({
      title,
      author,
      code,
      language,
    });

    if (!savedCodeSnippet) {
      throw new CustomError(500, "Code snippet is not saved");
    }

    const populatedSnippet = await CodeSnippet.findById(
      savedCodeSnippet._id
    ).populate("author", "fullname -_id");

    res
      .status(201)
      .json(new ApiResponse(201, "Code snippet is saved", populatedSnippet));
  } catch (error) {
    return res.status(error.statusCode, error.message, null, false);
  }
};

const getAllSnippet = async (req, res) => {
  try {
    const authorID = req.user._id;
    const codeSnippets = await CodeSnippet.find({author:authorID}).populate(
      "author",
      "fullname -_id"
    );
    if (codeSnippets.length === 0) {
      throw new CustomError(404, "Code Snippets not found");
    }

    res
      .status(201)
      .json(new ApiResponse(201, "Code snippets is below", codeSnippets));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const getSnippet = async (req, res) => {
  const snippetId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
      throw new CustomError(400, "Invalid snippet id", null, false);
    }

    const codeSnippet = await CodeSnippet.findById(snippetId).populate(
      "author",
      "fullname -_id"
    );

    if (!codeSnippet) throw new CustomError(404, "Code Snippet is not found");

    return res
      .status(201)
      .json(new ApiResponse(201, "Code snippet by id", codeSnippet));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const updateSnippet = async (req, res) => {
  const snippetId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
      throw new CustomError(400, "Invalid snippet id", null, false);
    }

    const codeSnippet = await CodeSnippet.findById(snippetId);
    if (!codeSnippet) {
      throw new CustomError(400, "Code Snippet not found");
    }

    const updatedCodeSnippet = await CodeSnippet.findByIdAndUpdate(
      snippetId,
      { title: req.body.title, code: req.body.code },
      { new: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Code Snippet updated successfully",
          updatedCodeSnippet
        )
      );
  } catch (err) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const deleteSnippet = async (req, res) => {
  const snippetId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
      throw new CustomError(400, "Invalid snippet id", null, false);
    }

    const codeSnippet = await CodeSnippet.findById(snippetId);
    if (!codeSnippet) {
      throw new CustomError(400, "Code Snippet not found");
    }

    await CodeSnippet.findByIdAndDelete(snippetId);

    res
      .status(200)
      .json(
        new ApiResponse(200, "Code Snippet deleted successfully", null, false)
      );
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

export {
  createSnippet,
  getAllSnippet,
  getSnippet,
  updateSnippet,
  deleteSnippet,
};
