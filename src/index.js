require("dotenv").config();
const express = require("express");
const connectDB = require("./db/conn");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./documentation/swagger_output.json");

const recordingRoutes = require("./routes/recordingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to the database");

    app.use(express.json());

    app.use("/", recordingRoutes);
    app.use("/auth", authRoutes);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Internal Server Error" });
    });

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
