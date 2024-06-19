import ScheduleModel from "../models/schedule.js";
import ScheduleAupModel from "../models/scheduleAup.js";
import ExcelJS from "exceljs";

export const shift = async (req, res) => {
  try {
    const doc = new ScheduleModel({
      userId: req.body.userId,
      fullName: req.body.fullName,
      day: req.body.day,
      time: req.body.time,
      date: req.body.date,
    });
    const schedule = await doc.save();
    res.status(201).send("Расписание сохранено");
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка сервера");
  }
};

export const aupShift = async (req, res) => {
  try {
    const doc = new ScheduleAupModel({
      userId: req.body.userId,
      fullName: req.body.fullName,
      day: req.body.day,
      time: req.body.time,
      date: req.body.date,
    });
    const schedule = await doc.save();
    res.status(201).send("Расписание сохранено");
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка сервера");
  }
};

export const getOnNextWeek = async (req, res) => {
  try {
    const schedule = await ScheduleModel.find();
    res.json(schedule);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка сервера");
  }
};

export const getOnNextWeekAup = async (req, res) => {
  try {
    const schedule = await ScheduleAupModel.find();
    res.json(schedule);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка сервера");
  }
};

export const findUnique = async (req, res) => {
  try {
    const schedule = await ScheduleModel.find();
    res.json(schedule);
  } catch (error) {
    console.log(error);
    res.status(500).send("Ошибка сервера");
  }
};

export const exportSchedule = async (req, res) => {
  try {
    const schedules = await ScheduleModel.find();

    const daysOfWeek = {
      понедельник: "monday",
      вторник: "tuesday",
      среда: "wednesday",
      четверг: "thursday",
      пятница: "friday",
      суббота: "saturday",
      воскресенье: "sunday",
    };

    const groupedSchedules = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.fullName]) {
        acc[schedule.fullName] = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        };
      }
      const dayKey = daysOfWeek[schedule.day];
      if (dayKey) {
        acc[schedule.fullName][dayKey].push(schedule.time);
      } else {
        console.error(`Invalid day: ${schedule.day}`);
      }
      return acc;
    }, {});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule");

    worksheet.columns = [
      { header: "ФИО", key: "fullName", width: 30 },
      { header: "Понедельник", key: "monday", width: 20 },
      { header: "Вторник", key: "tuesday", width: 20 },
      { header: "Среда", key: "wednesday", width: 20 },
      { header: "Четверг", key: "thursday", width: 20 },
      { header: "Пятница", key: "friday", width: 20 },
      { header: "Суббота", key: "saturday", width: 20 },
      { header: "Воскресенье", key: "sunday", width: 20 },
    ];

    Object.keys(groupedSchedules).forEach((fullName) => {
      const employeeSchedule = groupedSchedules[fullName];
      const row = {
        fullName,
        monday: formatDaySchedule(employeeSchedule.monday),
        tuesday: formatDaySchedule(employeeSchedule.tuesday),
        wednesday: formatDaySchedule(employeeSchedule.wednesday),
        thursday: formatDaySchedule(employeeSchedule.thursday),
        friday: formatDaySchedule(employeeSchedule.friday),
        saturday: formatDaySchedule(employeeSchedule.saturday),
        sunday: formatDaySchedule(employeeSchedule.sunday),
      };
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=schedule.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось экспортировать данные",
    });
  }
};

const formatDaySchedule = (times) => {
  if (times.length === 0) return "вых";
  const sortedTimes = times.sort((a, b) => {
    const [aHours, aMinutes] = a.split(":").map(Number);
    const [bHours, bMinutes] = b.split(":").map(Number);
    return aHours - bHours || aMinutes - bMinutes;
  });
  const startTime = sortedTimes[0];
  const endTime = sortedTimes[sortedTimes.length - 1];
  const [endHour, endMinutes] = endTime.split(":").map(Number);
  const formattedEndTime = `${String(endHour + 1).padStart(2, "0")}:${String(
    endMinutes
  ).padStart(2, "0")}`;
  return `${startTime} - ${formattedEndTime}`;
};

export const exportScheduleToAup = async (req, res) => {
  try {
    const schedules = await ScheduleAupModel.find();

    const daysOfWeek = {
      понедельник: "monday",
      вторник: "tuesday",
      среда: "wednesday",
      четверг: "thursday",
      пятница: "friday",
      суббота: "saturday",
      воскресенье: "sunday",
    };

    const groupedSchedules = schedules.reduce((acc, scheduleAup) => {
      if (!acc[scheduleAup.fullName]) {
        acc[scheduleAup.fullName] = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        };
      }
      const dayKey = daysOfWeek[scheduleAup.day];
      if (dayKey) {
        acc[scheduleAup.fullName][dayKey].push(scheduleAup.time);
      } else {
        console.error(`Invalid day: ${scheduleAup.day}`);
      }
      return acc;
    }, {});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule");

    worksheet.columns = [
      { header: "ФИО", key: "fullName", width: 30 },
      { header: "Понедельник", key: "monday", width: 20 },
      { header: "Вторник", key: "tuesday", width: 20 },
      { header: "Среда", key: "wednesday", width: 20 },
      { header: "Четверг", key: "thursday", width: 20 },
      { header: "Пятница", key: "friday", width: 20 },
      { header: "Суббота", key: "saturday", width: 20 },
      { header: "Воскресенье", key: "sunday", width: 20 },
    ];

    Object.keys(groupedSchedules).forEach((fullName) => {
      const employeeSchedule = groupedSchedules[fullName];
      const row = {
        fullName,
        monday: formatDayScheduleAup(employeeSchedule.monday),
        tuesday: formatDayScheduleAup(employeeSchedule.tuesday),
        wednesday: formatDayScheduleAup(employeeSchedule.wednesday),
        thursday: formatDayScheduleAup(employeeSchedule.thursday),
        friday: formatDayScheduleAup(employeeSchedule.friday),
        saturday: formatDayScheduleAup(employeeSchedule.saturday),
        sunday: formatDayScheduleAup(employeeSchedule.sunday),
      };
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=schedule.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось экспортировать данные",
    });
  }
};

const formatDayScheduleAup = (times) => {
  if (times.length === 0) return "вых";
  return `${times}`;
};