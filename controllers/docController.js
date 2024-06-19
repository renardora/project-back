import DocModel from "../models/documents.js";
import { validationResult } from "express-validator";

export const addDoc = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json(errors.array());
    }

    const doc = new DocModel({
      nameFile: req.body.nameFile,
      fileURL: req.body.fileURL,
      section: req.body.section,
      subSection: req.body.subSection,
    });

    const docs = await doc.save();

    res.json({
      docs,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить документ",
    });
  }
};

export const getDoc = async (req, res) => {
  try {
    const doc = await DocModel.findById(req.body.docId);
    if (!doc) {
      return res.status(404).json({
        message: "Документ не найден",
      });
    }
    res.json({ doc });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
};

export const getAllDocs = async (req, res) => {
  try {
    const section = req.body.section;
    // console.log(section);
    const subSection = req.body.subSection;
    // console.log(subSection);
    const docs = await DocModel.find({
      section: section,
      subSection: subSection,
    });
    
    if (!docs) {
      return res.status(404).json({
        message: "Документы не найдены",
      });
    }
    res.json({ docs });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
};

export const updateDoc = async (req, res) => {
  try {
    const { _id, ...docData } = req.body;
    const doc = await DocModel.findById(_id);
    if (!doc) {
      return res.status(404).json({
        message: "Документ не найден",
      });
    }

    await DocModel.findByIdAndUpdate(_id, docData);

    res.json({ message: "Данные документа успешно обновлены" });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
};

export const deleteDoc = async (req, res) => {
  try {
    const doc = await DocModel.findById(req.body.docId);
    if (!doc) {
      return res.status(404).json({
        message: "Документ не найден",
      });
    }

    await DocModel.findByIdAndDelete(doc);

    res.json({ message: "Документ успешно удален" });
  } catch (err) {
    res.status(500).json({
      message: "Ошибка сервера",
    });
  }
};

export const uploadFile = async (req, res) => {
    try {
      const doc = await DocModel.findById(req.body.docId);
      if (!user) {
        return res.status(404).json({
          message: "Документ не найден",
        });
      }
      doc.fileURL = `http://localhost:4444/docs/${req.file.originalname}`;
      await doc.save();
      res.json({ url: doc.fileURL });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



