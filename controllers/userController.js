const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");
const { paginatedArray } = require("../helper/pagination");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, admin } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("please enter all the fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      admin,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        active:user.active,
      });
    } else {
      res.status(400);
      throw new Error("Failed to create the user");
    }
  } catch (error) {
    res.json(error.message);
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user?.active === false) {
    res.status(401).json("user is not active ,ask admin to active the user or register yourself")
  } else if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      active:user.active,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const editUser = asyncHandler(async (req, res) => {
  try {
    const { email, name, admin, oldPassword, newPassword ,active} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const dataUpdate = {
      email: email,
      name: name,
      admin: admin,
      password: hashedPassword,
      active:active
    };
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json("user not found");
    } else if (user && !(await user.matchPassword(oldPassword))) {
      res
        .status(400)
        .json("your oldpassword does not match the actual pasword of user");
    } else {
      const editUser = await User.findOneAndUpdate(
        { email: email },
        dataUpdate,
        { new: true }
      ).select("-password");
      res.status(201).json(editUser);
    }
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  // const {email,password} = req.body
  const { email } = req.query;

  const user = await User.findOne({ email });
  if (user.admin) {
    res.status(400).json("You can not delete the admin user");
  } else {
    try {
      // await User.deleteOne(
      //   { email: email },
      // );
      res.status(201).json("user deleted");
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
  // if(!user){
  //   res.status(400).json("user not found");
  // }
  // else if(user && !(await user.matchPassword(password))){
  //   res.status(400).json("your password does not match the pasword of user");
  // }else{

  // }
});

const countUser = asyncHandler(async (req, res) => {
  try {
    const data = await User.find();
    // console.log(data.length);
    res.status(200).json({
      totalUser: data.length,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Count is not possible");
  }
});

const lastCount = asyncHandler(async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await User.find({ createdAt: { $gte: twentyFourHoursAgo } });
    // console.log(data.length);
    res.status(200).json({
      totalUser: data.length,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Count is not possible");
  }
});

const searchUser = asyncHandler(async (req, res) => {
  try {
    const { size, page } = req.query;
    const keyword = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
      : {};
    const users = await User.find(keyword).select("-password");
    res.send(paginatedArray(users, size, page));
  } catch (error) {
    res.status(400).json(error.message);
  }
});
module.exports = {
  registerUser,
  authUser,
  editUser,
  deleteUser,
  countUser,
  lastCount,
  searchUser,
};
