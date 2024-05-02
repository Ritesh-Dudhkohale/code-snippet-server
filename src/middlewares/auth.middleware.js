import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import CustomError from "../utils/CustomError.js";
import ApiResponse from "../utils/ApiResponse.js";

const validateJWT = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) throw new CustomError(401, "Unauthoriseed request");

    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id)
      .select("-password")
      .orFail(() => {
        throw new CustomError(401, "Invalid Access Token");
      });

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

export default validateJWT;
