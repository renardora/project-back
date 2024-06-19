import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

export default async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;

      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      req.user = user;

      next();
    } catch (err) {
      console.error(
        "Ошибка при проверке токена или извлечении пользователя:",
        err
      );
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
