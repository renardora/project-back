import ScheduleModel from "../models/schedule.js";
import ScheduleAupModel from "../models/scheduleAup.js";
import TopWorkerModel from "../models/TopWorker.js";

export const chbr = async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const user = req.userId;
      // console.log(user); // Получаем ID текущего пользователя из токена
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      );
      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      );

      // Поиск записей расписания пользователя за текущую неделю
      const submissions = await ScheduleModel.find({
        userId: user,
        date: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      });
      res.status(200).json({ isSubmitted: submissions.length > 0 });

      next();
    } catch (error) {
      console.error("Ошибка при проверке статуса отправки:", error);
      res.status(500).json({ error: "Ошибка при проверке статуса отправки" });
    }
  }
};

export const aup = async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const user = req.userId;
      // console.log(user); // Получаем ID текущего пользователя из токена
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      );
      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      );

      // Поиск записей расписания пользователя за текущую неделю
      const submissions = await ScheduleAupModel.find({
        userId: user,
        date: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      });
      res.status(200).json({ isSubmitted: submissions.length > 0 });
      next();
    } catch (error) {
      console.error("Ошибка при проверке статуса отправки:", error);
      res.status(500).json({ error: "Ошибка при проверке статуса отправки" });
    }
  }
};

export const topWorker = async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const user = req.userId;
      
      const currentDate = new Date();
      let startDate = new Date();
      let endDate = new Date();
      if (currentDate.getDate() > 25) {
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          26
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth()+1,
          25
        );
      } else {
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          26
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          25
        );
      }
      
      const submissions = await TopWorkerModel.find({
        currentUserId: user,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
      
      res.status(200).json({ isSubmitted: submissions.length > 0 });

      next();
    } catch (error) {
      console.error("Ошибка при проверке статуса отправки:", error);
      res.status(500).json({ error: "Ошибка при проверке статуса отправки" });
    }
  }
};
