import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Proyecto",
    version: "1.0.0",
    description: "API de gestión",
  },
  servers: [
    {
      url: "http://localhost:3001",
    },
  ],
};

const outputFile = "./swagger.json";

const endpointFiles = ["./routes/usuarioRoutes.js", "./routes/torneoRoutes.js"];

swaggerAutogen()(outputFile, endpointFiles, doc).then(() => {
  import("./server.js");
});
