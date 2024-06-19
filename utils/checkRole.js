export default function checkRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      console.error("Пользователь не найден в запросе");
      return res.status(403).send("Нет доступа");
    }

    if (!roles.includes(req.user.role)) {
      console.error(
        `Роль пользователя ${req.user.role} не соответствует требованиям доступа`
      );
      return res.status(403).send("Access denied");
    }

    next();
  };
}
