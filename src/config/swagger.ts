import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";

const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cua Tien Phuot API Documentation",
      version: "1.0.0",
      description: "API documentation for Cua Tien Phuot",
    },
    servers: [
      { url: "https://zma-cuatienphuot-be.vercel.app" },
      {
        url: "http://localhost:3000",
        name: "localhost",
      },
      { url: "https://zma-cuatienphuot-be-psi.vercel.app" },
    ],
    tags: [
      {
        name: "Auth",
        description: "Các API liên quan đến người dùng",
      },
      {
        name: "Trip",
        description: "Các API liên quan đến chuyến đi",
      },
      {
        name: "Transaction",
        description: "Các API liêng quan đến giao dịch",
      },
    ],
  },
  apis: ["./src/controllers/*.{ts,js}"], // Đường dẫn đến các tệp chứa các chú thích API
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerDocs, swaggerUi };
