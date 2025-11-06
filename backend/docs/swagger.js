import swaggerUI from "swagger-ui-express";
import swaggerJSdoc from "swagger-jsdoc";

export const swaggerDocs = (app, port) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Pocket Monsters API",
        version: "1.0.0",
        description: "API documentation for Pocket Monsters project"
      },
      servers: [
        { url: `http://localhost:${port}` }
      ]
    },
    tags: [
      { name: "Account", description: "Account management routes" },
      { name: "Profile", description: "Profile info routes" }
    ],
    apis: ["./routes/*.js"],
  };

  const specs = swaggerJSdoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};