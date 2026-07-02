import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API PlayMatch",
      version: "1.0.0",
      description: "Documentación oficial de la API PlayMatch",
    },

    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor Local",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Ingrese únicamente el token JWT obtenido al iniciar sesión. Swagger agregará automáticamente el prefijo Bearer.",
        },
      },

      schemas: {
        Usuario: {
          type: "object",
          required: [
            "id_rol",
            "nombre_usuario",
            "apellido_usuario",
            "fecha_nacimiento",
            "telefono",
            "email",
            "password",
          ],
          properties: {
            id_rol: {
              type: "integer",
              example: 3,
              description: "Rol del usuario",
            },
            nombre_usuario: {
              type: "string",
              example: "Kevin",
            },
            apellido_usuario: {
              type: "string",
              example: "Cerpa Granados",
            },
            fecha_nacimiento: {
              type: "string",
              format: "date",
              example: "2003-07-18",
            },
            telefono: {
              type: "string",
              example: "3001234567",
            },
            email: {
              type: "string",
              format: "email",
              example: "kevin@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "123456",
            },
          },
        },

        UsuarioRegistro: {
          type: "object",
          required: [
            "nombre_usuario",
            "apellido_usuario",
            "fecha_nacimiento",
            "telefono",
            "email",
            "password",
          ],
          properties: {
            nombre_usuario: {
              type: "string",
              example: "Kevin",
            },
            apellido_usuario: {
              type: "string",
              example: "Cerpa Granados",
            },
            fecha_nacimiento: {
              type: "string",
              format: "date",
              example: "2003-07-18",
            },
            telefono: {
              type: "string",
              example: "3001234567",
            },
            email: {
              type: "string",
              format: "email",
              example: "kevin@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "123456",
            },
          },
        },

        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "kevin@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "123456",
            },
          },
        },

        CodigoRegistro: {
          type: "object",
          required: ["email", "codigo"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "kevin@gmail.com",
            },
            codigo: {
              type: "string",
              example: "123456",
            },
          },
        },

        ReenviarCodigo: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "kevin@gmail.com",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
