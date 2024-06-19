import TopWorkerModel from "../models/TopWorker.js";

export const adding = async (req, res) => {
  try {
    const doc = new TopWorkerModel({
      userId: req.body.userId,
      currentUserId: req.body.currentUserId,
      count: req.body.count,
    });

    const topWorker = await doc.save();
    res.status(201).send("Голос отправлен");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const currentDate = new Date();
    let startDate = new Date();
    let endDate = new Date();
    if (currentDate.getDate() > 25) {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        26
      );
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 25);
    } else {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 2,
        26
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        25
      );
    }
    const records = await TopWorkerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: "$count" },
        },
      },
      {
        $lookup: {
          from: "users", // замените "users" на имя вашей коллекции пользователей
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // разделяет массив user на отдельные документы
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
    if (!records) return res.status(404).json({ message: "Записей нет" });
    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRating = async (req, res) => {
  try {
    const { month, year } = req.params;
    // const currentDate = new Date();
    // const currentDay = new Date().getDate();

    let startDate = new Date(year, month - 1, 26);
    let endDate = new Date(year, month % 12, 25);

    //if (currentDay < 26 && currentDate.getFullYear() == year && currentDate.getMonth() == month) {
    //  return
    //  res.json({ records: {} });
    //}
    const records = await TopWorkerModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: "$count" },
        },
      },
      {
        $lookup: {
          from: "users", // замените "users" на имя вашей коллекции пользователей
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // разделяет массив user на отдельные документы
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
    
    if (!records.length)
      return res.json({ records: [] });

    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
