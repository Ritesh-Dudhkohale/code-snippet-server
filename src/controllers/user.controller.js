import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { CodeSnippet } from "../models/code-snippet.model.js";
import CustomError from "../utils/CustomError.js";

const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if ([fullname, email, password].some((field) => field?.trim() === ""))
      throw new CustomError(400, "All fields are required!!!");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new CustomError(409, "Email already exists!!!");

    //Saving new user
    const user = await User.create({
      fullname,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser)
      throw new CustomError(
        500,
        "Something went wrong while registering user!!!"
      );

    res
      .status(201)
      .json(new ApiResponse(201, "User is registered", createdUser));
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      throw new CustomError(400, "Email is required.");
    }

    if (!password || !password.trim()) {
      throw new CustomError(400, "Password is required.");
    }

    const userExists = await User.findOne({ email: email }).orFail(() => {
      throw new CustomError(400, "User not found!!!");
    });

    const isPasswordValid = await userExists.isPasswordCorrect(password);

    if (!isPasswordValid)
      throw new CustomError(401, "Invalid User password!!!");

    const accessToken = userExists.generateAccessToken();

    const loggedInUser = await User.findOne(userExists?._id).select(
      "-password "
    );

    const cookiesOptions = {
      httpOnly: true, //This will make cookie unmodifiable in client
      secure: true, //These cookies can be modify only on server side
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookiesOptions)
      .json(
        new ApiResponse(200, "user logged in successfully...", { accessToken })
      );
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const currentUser = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId)
      .select("-_id -password")
      .orFail(() => {
        throw new CustomError(401, "Invalid Access Token");
      });

    return res.status(200).json(new ApiResponse(200, "Current User", user));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !oldPassword.trim()) {
      throw new CustomError(400, "old password is required!!!");
    }

    if (!newPassword || !newPassword.trim()) {
      throw new CustomError(400, "new password is required!!!");
    }

    const existingUser = await User.findById(req.user?._id);

    const isPasswordCorrect = await existingUser.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect)
      throw new CustomError(400, "Invalid old password!!!");

    existingUser.password = newPassword;

    const updatedUser = await existingUser.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Password changed successfully...",
          updatedUser.email
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.user._id;
    // Find the user and delete all associated code snippets
    await CodeSnippet.deleteMany({ author: id });

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, error.message, null, false));
  }
};

export { registerUser, loginUser, updatePassword, deleteUser, currentUser };
