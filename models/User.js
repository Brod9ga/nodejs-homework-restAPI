import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timeseries: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", runValidateAtUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const User = model("user", userSchema);

export default User;
