import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import UserModel from "../models/user.js";

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return req.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      avatarUrl: req.body.avatarUrl,
      fullName: req.body.fullName,
      role: req.body.role,
      birthDay: req.body.birthDay,
      phone: req.body.phone,
      email: req.body.email,
      division: req.body.division,
      passwordHash: hash,
    });

    const user = await doc.save();

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json({ userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users) {
      return res.status(404).json({
        message: "Пользователи не найдены",
      });
    }

    const usersData = users.map((user) => {
      const { passwordHash, ...userData } = user._doc;
      return userData;
    });
    res.json({ usersData });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const findUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    await UserModel.findByIdAndDelete(userId);

    res.json({
      message: "Пользователь успешно удален",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id, ...userData } = req.body;

    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    await UserModel.findByIdAndUpdate(_id, userData);

    res.json({
      message: "Данные пользователя успешно обновлены",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    user.avatarUrl = `http://localhost:4444/uploads/users/${req.file.originalname}`;
    await user.save();
    res.json({ url: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
