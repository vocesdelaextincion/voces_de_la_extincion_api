const express = require("express");
require("dotenv").config(); // Cargar variables de entorno
const connectDB = require("./db/conn");

const recordingRoutes = require("./routes/recordingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to the database");

    // Middlewares
    app.use(express.json());

    // Rutas
    app.use("/", recordingRoutes);
    app.use("/auth", authRoutes);

    // Middleware de errores
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Internal Server Error" });
    });

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Salir con un código de error
  }
};

startServer();

module.exports = app; // Solo si planeas usar tests
