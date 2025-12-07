const express = require("express");

const { generateApiKey } = require("../../utils/apiKeyGenerator");
const { projectModel } = require("./project.model");

const projectRouter = express.Router();

projectRouter.post("/projects", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: "Name is Required!" });
    }

    let savedProject;
    let attempts = 0;
    const maxAttempts = 5;

    while (!savedProject && attempts < maxAttempts) {
      const apiKey = generateApiKey();

      try {
        const project = new projectModel({
          name,
          apiKey,
        });
        savedProject = await project.save();
      } catch (err) {
        if (err.code === 11000 || err.keyPattern?.apiKey) {
          attempts++;
        } else {
          throw err;
        }
      }
    }

    if (!savedProject) {
      return res
        .status(500)
        .json({ error: "Failed to generate unique API key" });
    }

    return res.status(201).json({
      data: savedProject,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = projectRouter;
