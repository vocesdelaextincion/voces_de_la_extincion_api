const express = require("express");
const app = express();

const recordingRoutes = require("./routes/recordingRoutes");
const connectDB = require("./db/conn");

const port = 3000;

connectDB();

app.use(express.json());

app.use("/", recordingRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
