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

export const updating = async (req, res) => {
  try {
    const { _id, count } = req.body;

    const topWorker = await TopWorkerModel.findOneAndUpdate(
      { _id: _id },
      { $inc: { count: count } },
      { new: true }
    );
    if (!topWorker) {
      return res.status(404).json({ message: "Сотрудник не найден" });
    }
    res.json({ message: "Голоса обновлены успешно", topWorker: topWorker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLast = async (req, res) => {
  try {
    const { userId } = req.body;
    const latestRecord = await TopWorkerModel.findOne({ userId: userId }).sort({
      createdAt: -1,
    });

    if (!latestRecord) {
      return res.status(404).json({
        message: "Запись не найдена",
      });
    }
    res.json({
      latestRecord: latestRecord,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const records = await TopWorkerModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ count: -1 })
      .populate("userId");
    if (!records) return res.status(404).json({ message: "Записей нет" });
    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRating = async (req, res) => {
  try {
    // Извлекаем месяц и год из параметров запроса
    const { month, year } = req.params;
    const currentDate = new Date();
    const currentDay = new Date().getDate();

    // Рассчитываем начальную и конечную даты на основе предоставленного месяца и года
    let startDate = new Date(year, month - 1, 26);
    let endDate = new Date(year, month % 12, 25);

    if (currentDay < 26 && currentDate.getFullYear() == year && currentDate.getMonth() == month) {
      return res.json({ records: {} });
    }

    // Ищем записи в диапазоне между начальной и конечной датами
    const records = await TopWorkerModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ count: -1 })
      .populate("userId");

    if (!records) return res.status(404).json({ message: "Записей нет" });

    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
