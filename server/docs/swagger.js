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
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [],
      servers: [
        { url: `http://localhost:${port}` }
      ]
    },
    tags: [
      { name: "Root", description: "Root endpoints" },
      { name: "Account", description: "Account endpoints" },
      { name: "Profile", description: "Profile endpoints" },
      { name: "Pokedex", description: "Pokedex endpoints" }
    ],
    apis: ["./routes/*.js"],
  };

  const specs = swaggerJSdoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};