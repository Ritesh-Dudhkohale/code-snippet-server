import { Router } from "express";
import validateJWT from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  updatePassword,
  deleteUser,
  currentUser,
} from "../controllers/user.controller.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/change-pass").post(validateJWT, updatePassword);
router.route("/current-user").get(validateJWT, currentUser);
router.route("/").delete(validateJWT, deleteUser);

export default router;
