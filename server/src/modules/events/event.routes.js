const express = require("express");
const { validateMongoID } = require("../../utils/validate");
const { eventModel } = require("./event.model");
const { projectModel } = require("../projects/project.model");

const eventRouter = express.Router();

eventRouter.post("/events", async (req, res, next) => {
  try {
    const { projectId, name, message } = req.body;
    if (!projectId || !name || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    validateMongoID(projectId);

    const projectExists = await projectModel.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({
        message: "Project not found!",
      });
    }

    const event = new eventModel({
      projectId,
      name,
      message,
    });

    const savedEvent = await event.save();

    return res.json({
      data: savedEvent,
    });
  } catch (err) {
    next(err);
  }
});

eventRouter.get("/events", async (req, res, next) => {
  try {
    const { projectId } = req.query;

    if (projectId) {
      validateMongoID(projectId);
      return res.json({
        data: await eventModel.find({ projectId: projectId }),
      });
    }

    const events = await eventModel.find();
    return res.json({
      data: events,
    });
  } catch (err) {
    next(err);
  }
});
