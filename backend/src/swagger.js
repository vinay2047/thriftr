import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";


const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "thriftr API Documentation",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      { url: "http://localhost:3000/api" } // your backend base URL
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/controllers/*.js"], // path to your controllers with swagger comments
};


export const swaggerSpec = swaggerJsdoc(options);


