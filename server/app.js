const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const { connectDB } = require("./src/config/database");

const projectRouter = require("./src/modules/projects/project.routes");

const app = express();
app.use(express.json());

app.use("/", projectRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: `ERROR: ${err.message}` });
});

connectDB()
  .then(() => {
    console.log("DB connected to App!");
    app.listen(8888, () => {
      console.log("Server is Listening on port 8888");
    });
  })
  .catch((err) => {
    console.log("DB connection Error: ", err);
  });
