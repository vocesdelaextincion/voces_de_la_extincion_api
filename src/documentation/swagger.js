const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "API - Voces de la extinción",
    description:
      "Documentación de la API de las grabaciones del proyecto Voces de la Extinción",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
