const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevWithSunil API",
      version: "1.0.0",
      description: "DevWithSunil backend API docs",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local development server" },
    ],
    paths: {
      "/api/newsletter/subscribe": {
        post: {
          tags: ["Newsletter"],
          summary: "Subscribe to the newsletter",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                  },
                  required: ["email"],
                },
              },
            },
          },
          responses: {
            201: { description: "Subscriber created" },
            400: { description: "Validation error" },
            409: { description: "Already subscribed" },
          },
        },
      },
      "/api/contact": {
        post: {
          tags: ["Contact"],
          summary: "Submit contact message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    message: { type: "string" },
                  },
                  required: ["name", "email", "message"],
                },
              },
            },
          },
          responses: {
            201: { description: "Message stored" },
            400: { description: "Validation error" },
          },
        },
      },
      "/api/blog/posts": {
        get: {
          tags: ["Blog"],
          summary: "List all blog posts",
          responses: {
            200: { description: "Blog posts list" },
          },
        },
        post: {
          tags: ["Blog"],
          summary: "Create blog post",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    slug: { type: "string" },
                    title: { type: "string" },
                    tag: { type: "string" },
                    date: { type: "string", format: "date" },
                    excerpt: { type: "string" },
                    content: { type: "string" },
                    read_time: { type: "integer" },
                  },
                  required: [
                    "slug",
                    "title",
                    "tag",
                    "date",
                    "excerpt",
                    "content",
                    "read_time",
                  ],
                },
              },
            },
          },
          responses: {
            201: { description: "Blog post created" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJSDoc(options);
