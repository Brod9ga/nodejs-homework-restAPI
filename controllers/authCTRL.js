import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js"
import { HttpError } from "../helpers/index.js";
import bcrypt from "bcryptjs"
import { token } from "morgan";
import jwt from "jsonwebtoken"
import gravatar from "gravatar"
import path from "path"
import Jimp from "jimp";
import fs from "fs/promises";

const {JWT_SECRET} = process.env
const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {  
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarUrl = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({...req.body, password: hashPassword, avatarURL: avatarUrl});

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL
    });
  
}
 
const signin = async (req, res) => { 
 
  const { email, password} = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw HttpError(401, "Invalid credentials");
  }
const{_id:id}=user
  const payload = {
    id: user.id
  }
const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"})
await User.findByIdAndUpdate(id, {token})

  res.status(200).json({
    token,
    "user": {
    "email": user.email,
    "subscription": user.subscription
  }
    
  });
}

const getCurrent = (req, res) => { 
  const { name, email } = req.user
  
  res.json({
    name,
    email
  })
}
const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: null })
  res.json({
message: 'Logged out'
  })
}
 
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarPath, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatar = await Jimp.read(resultUpload);
  await avatar.resize(250, 250).write(resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    status: "Success",
    code: 200,
    data: {
      result: { avatarURL },
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
 updateAvatar: ctrlWrapper(updateAvatar)
}