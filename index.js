import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import * as Validation from "./validation.js";
import { default as checkAuth } from "./utils/checkAuth.js";
import { default as checkRole } from "./utils/checkRole.js";
import * as checkSubmission from "./utils/checkSubmission.js";
import * as UserController from "./controllers/UserController.js";
import * as scheduleController from "./controllers/scheduleController.js";
import * as docController from "./controllers/docController.js";

import * as topWorkerController from "./controllers/topWorkerController.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storageChbr = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/chbr");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadChbr = multer({ storage: storageChbr });

const storageManagers = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/managers");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadManagers = multer({ storage: storageManagers });

const storageUsers = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/users");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadUsers = multer({ storage: storageUsers });
const storageFiles = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "docs");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadFile = multer({ storage: storageFiles });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/docs", express.static("docs"));

app.post("/auth/login", UserController.login);
app.post(
  "/auth/register",
  Validation.registerValidation,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.put("/users/find", UserController.findUser);
app.get("/auth/all", UserController.getAll);
app.delete("/users/delete", UserController.deleteUser);
app.put("/users/update", UserController.updateUser);

app.post("/uploadimage/chbr", uploadChbr.single("image"), (req, res) => {
  res.json({
    url: `/uploads/chbr/${req.file.originalname}`,
  });
});
app.post(
  "/uploadimage/managers",
  uploadManagers.single("image"),
  (req, res) => {
    res.json({
      url: `/uploads/managers/${req.file.originalname}`,
    });
  }
);

app.post(
  "/uploadimage/users",
  checkAuth,
  uploadUsers.single("image"),
  UserController.uploadAvatar
);

app.post(
  "/updatefile",
  checkAuth,
  uploadUsers.single("filedata"),
  docController.uploadFile
);

app.post("/uploadfile", uploadFile.single("filedata"), (req, res) => {
  res.json({ url: `/docs/${req.file.originalname}` });
});
app.post("/schedule/chbr", scheduleController.shift);
app.get("/schedule/chbr/getAll", scheduleController.getOnNextWeek);
app.get("/schedule/chbr/export", scheduleController.exportSchedule);
app.get("/schedule/chbr/checkSubmission", checkAuth, checkSubmission.chbr);
app.post("/schedule/aup", scheduleController.aupShift);
app.get("/schedule/aup/getAll", scheduleController.getOnNextWeekAup);
app.get("/schedule/aup/export", scheduleController.exportScheduleToAup);
app.get("/schedule/aup/checkSubmission", checkAuth, checkSubmission.aup);

app.post("/topworker/adding", topWorkerController.adding);
app.get("/topworker/getAll", topWorkerController.getAll);
app.get(
  `/topworker/getAllRating/:year/:month`,
  topWorkerController.getAllRating
);
app.get("/topworker/checkSubmission", checkAuth, checkSubmission.topWorker);

app.post("/kingdom/add", docController.addDoc);
app.get("/kingdom/get", docController.getDoc);
app.put("/kingdom/getAll", docController.getAllDocs);
app.put("/kingdom/getDocs", docController.getDocs);
app.put("/kingdom/update", docController.updateDoc);
app.delete("/kingdom/delete", docController.deleteDoc);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
