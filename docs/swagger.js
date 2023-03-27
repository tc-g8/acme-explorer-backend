import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.HOST_PORT || 8080;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ACME-Explorer API REST",
      version: "1.0.0",
      description: "API REST for travel agency",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./**/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerDocs = (app) => {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default swaggerDocs;
