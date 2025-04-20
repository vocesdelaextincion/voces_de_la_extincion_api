const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "API - Voces de la extinción",
    description:
      "Documentación de la API de las grabaciones del proyecto Voces de la Extinción",
  },
  host: "localhost:3000",
  basePath: "/", 
  schemes: ["http"],
  consumes: ['application/json', 'multipart/form-data'], 
  produces: ['application/json'], 
  securityDefinitions: { 
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter JWT Bearer token in the format \'Bearer <token>\''
    }
  },
  definitions: { 
    User: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          example: "user@example.com"
        },
        password: {
          type: "string",
          example: "password123"
        }
      }
    },
    LoginResponse: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        },
        message: { 
          type: "string",
          example: "Login successful"
        }
      }
    },
    Recording: {
      type: "object",
      properties: {
        _id: { 
          type: "string",
          example: "60d0fe4f5311236168a109ca"
        },
        email: {
          type: "string",
          example: "user@example.com"
        },
        name: {
          type: "string",
          example: "My First Recording"
        },
        duration: { 
          type: "number", 
          format: "float",
          example: 123.45
        },
        location: {
          type: "string",
          example: "Park"
        },
        date: {
          type: "string",
          format: "date",
          example: "2024-01-15"
        },
        time: {
          type: "string",
          example: "14:30"
        },
        tags: {
          type: "array",
          items: { 
            type: "string" 
          },
          example: ["birdsong", "nature"]
        },
        audioUrl: {
          type: "string",
          example: "/uploads/audio/60d0fe4f5311236168a109ca.mp3"
        },
         createdAt: {
          type: "string",
          format: "date-time"
        },
        updatedAt: {
          type: "string",
          format: "date-time"
        }
      }
    },
     RecordingUpdate: { 
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Updated Recording Name"
        },
        location: {
          type: "string",
          example: "Updated Location"
        },
        date: {
          type: "string",
          format: "date",
          example: "2024-01-16"
        },
        time: {
          type: "string",
          example: "15:00"
        },
        tags: {
          type: "array",
          items: { 
            type: "string" 
          },
          example: ["urban", "updated"]
        }
      }
    },
    ErrorResponse: {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      }
    }
  }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../index.js"]; 

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../index.js'); 
});
