import { Router } from "express";
import validateJWT from "../middlewares/auth.middleware.js";
import {
  createSnippet,
  getAllSnippet,
  getSnippet,
  updateSnippet,
  deleteSnippet,
} from "../controllers/code-snippet.controller.js";

const router = Router();

router.use(validateJWT);

router.route("")
      .post(createSnippet)
      .get(getAllSnippet);

router.route("/:id")
      .get(getSnippet)
      .put(updateSnippet)
      .delete(deleteSnippet);

export default router;
