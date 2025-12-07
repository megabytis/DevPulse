const express = require("express");
const { validateMongoID } = require("../../utils/validate");
const { eventModel } = require("./event.model");
const { projectModel } = require("../projects/project.model");

const eventRouter = express.Router();

eventRouter.post("/events", async (req, res, next) => {
  try {
    const { projectId, name, message, service, route, type, metadata } =
      req.body;
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
      service,
      route,
      type,
      metadata,
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
    let { projectId, type, page, limit, sortBy, from, to } = req.query;

    const searchEventQuery = {};

    // ProjectId-filter
    if (projectId) {
      validateMongoID(projectId);
      searchEventQuery.projectId = projectId;
    }

    // type-filter
    if (type) {
      const allowedType = ["ERROR", "INFO", "WARN"];
      if (!allowedType.includes(type)) {
        return res.status(400).json({ message: "Invalid type filter" });
      }
      searchEventQuery.type = type;
    }

    // Pagination
    page = parseInt(page) || 1;

    const MAX_LIMIT = 10;
    limit = parseInt(limit) || MAX_LIMIT;
    limit = limit > MAX_LIMIT ? MAX_LIMIT : limit;

    const skip = (page - 1) * limit;

    const totalEvents = await eventModel.countDocuments(searchEventQuery);
    const totalPages = Math.ceil(totalEvents / limit);

    // Sorting Logic
    const sortOptions = {};
    if (sortBy === "createdAt") {
      sortOptions.createdAt = -1;
    } else if (sortBy === "name") {
      sortOptions.name = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    // from-to-filter
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      if (fromDate <= toDate && !isNaN(fromDate) && !isNaN(toDate)) {
        searchEventQuery.createdAt = {
          $gte: fromDate,
          $lte: toDate,
        };
      }
    } else if (from) {
      searchEventQuery.createdAt = {
        $gte: new Date(from),
      };
    } else if (to) {
      let toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      searchEventQuery.createdAt = {
        $lte: new Date(to),
      };
    }

    const events = await eventModel
      .find(searchEventQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.json({
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = eventRouter;
