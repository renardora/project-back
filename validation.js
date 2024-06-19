import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть не менее 6 символов").isLength({
    min: 6,
  }),
];

export const registerValidation = [
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
  body("fullName", "Укажите имя").isLength({ min: 1 }),
  body("role", "Укажите должность").isLength({ min: 1 }),
  body("birthDay", "Укажите дату рождения").isDate(),
  body("phone", "Укажите телефон").isLength(11),
  body("email", "Неверный формат почты").isEmail(),
  body("division", "Укажите подразделение").isLength({ min: 1 }),
  body("password", "Пароль должен быть не менее 6 символов").isLength({
    min: 6,
  }),
];

