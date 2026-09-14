/**
 * OpenAPI 3.1 document for MockData.
 * When you add a resource: extend `components.schemas` + `paths` here
 * (and keep Zod validations in sync).
 */

export type OpenApiDocument = {
  openapi: string;
  info: Record<string, unknown>;
  servers: { url: string; description?: string }[];
  tags: { name: string; description?: string }[];
  paths: Record<string, unknown>;
  components: Record<string, unknown>;
};

const paginationSchema = {
  type: "object",
  required: ["page", "limit", "total", "totalPages"],
  properties: {
    page: { type: "integer", minimum: 1, example: 1 },
    limit: { type: "integer", minimum: 1, maximum: 50, example: 12 },
    total: { type: "integer", minimum: 0, example: 24 },
    totalPages: { type: "integer", minimum: 1, example: 2 },
  },
} as const;

const errorSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message"],
      properties: {
        code: {
          type: "string",
          example: "VALIDATION_ERROR",
          enum: [
            "VALIDATION_ERROR",
            "NOT_FOUND",
            "UNAUTHORIZED",
            "RATE_LIMITED",
            "NOT_CONFIGURED",
            "INTERNAL_ERROR",
          ],
        },
        message: { type: "string", example: "Invalid request" },
        details: {},
      },
    },
  },
} as const;

const userSchema = {
  type: "object",
  required: [
    "id",
    "name",
    "username",
    "email",
    "avatarUrl",
    "role",
    "city",
    "country",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", example: "Ava Chen" },
    username: { type: "string", example: "avachen" },
    email: { type: "string", format: "email", example: "ava.chen@example.com" },
    avatarUrl: { type: "string", format: "uri" },
    phone: { type: ["string", "null"] },
    company: { type: ["string", "null"] },
    role: { type: "string", enum: ["admin", "member", "guest"] },
    city: { type: "string", example: "San Francisco" },
    country: { type: "string", example: "United States" },
    bio: { type: ["string", "null"] },
    website: { type: ["string", "null"], format: "uri" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const userCreateSchema = {
  type: "object",
  required: ["name", "username", "email", "avatarUrl", "city", "country"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
    username: {
      type: "string",
      minLength: 2,
      maxLength: 50,
      pattern: "^[a-zA-Z0-9._-]+$",
    },
    email: { type: "string", format: "email", maxLength: 255 },
    avatarUrl: { type: "string", format: "uri", maxLength: 2000 },
    phone: { type: ["string", "null"], maxLength: 40 },
    company: { type: ["string", "null"], maxLength: 120 },
    role: {
      type: "string",
      enum: ["admin", "member", "guest"],
      default: "member",
    },
    city: { type: "string", minLength: 1, maxLength: 100 },
    country: { type: "string", minLength: 1, maxLength: 100 },
    bio: { type: ["string", "null"], maxLength: 1000 },
    website: { type: ["string", "null"], format: "uri", maxLength: 500 },
  },
} as const;

const postSchema = {
  type: "object",
  required: [
    "id",
    "userId",
    "title",
    "body",
    "tags",
    "published",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    userId: { type: "string", format: "uuid" },
    title: { type: "string", example: "Why fake APIs speed up frontend work" },
    body: { type: "string" },
    tags: { type: "array", items: { type: "string" }, example: ["dx", "mock"] },
    published: { type: "boolean", example: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const postCreateSchema = {
  type: "object",
  required: ["userId", "title", "body"],
  properties: {
    userId: { type: "string", format: "uuid" },
    title: { type: "string", minLength: 1, maxLength: 200 },
    body: { type: "string", minLength: 1, maxLength: 10000 },
    tags: {
      type: "array",
      maxItems: 20,
      items: { type: "string", minLength: 1, maxLength: 40 },
      default: [],
    },
    published: { type: "boolean", default: true },
  },
} as const;

const commentSchema = {
  type: "object",
  required: ["id", "postId", "name", "email", "body", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string", format: "uuid" },
    postId: { type: "string", format: "uuid" },
    name: { type: "string", example: "Alex Rivera" },
    email: { type: "string", format: "email" },
    body: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const commentCreateSchema = {
  type: "object",
  required: ["postId", "name", "email", "body"],
  properties: {
    postId: { type: "string", format: "uuid" },
    name: { type: "string", minLength: 1, maxLength: 120 },
    email: { type: "string", format: "email", maxLength: 255 },
    body: { type: "string", minLength: 1, maxLength: 2000 },
  },
} as const;

const albumSchema = {
  type: "object",
  required: ["id", "userId", "title", "createdAt", "updatedAt"],
  properties: {
    id: { type: "integer", example: 1 },
    userId: { type: "string", format: "uuid" },
    title: { type: "string", example: "Desk & tools" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const albumCreateSchema = {
  type: "object",
  required: ["userId", "title"],
  properties: {
    id: { type: "integer", minimum: 1, maximum: 10000 },
    userId: { type: "string", format: "uuid" },
    title: { type: "string", minLength: 1, maxLength: 200 },
  },
} as const;

const photoSchema = {
  type: "object",
  required: [
    "id",
    "albumId",
    "title",
    "url",
    "thumbnailUrl",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    albumId: { type: "integer", example: 1 },
    title: { type: "string", example: "Morning desk setup" },
    url: { type: "string", format: "uri" },
    thumbnailUrl: { type: "string", format: "uri" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const photoCreateSchema = {
  type: "object",
  required: ["albumId", "title", "url", "thumbnailUrl"],
  properties: {
    albumId: { type: "integer", minimum: 1, maximum: 100 },
    title: { type: "string", minLength: 1, maxLength: 200 },
    url: { type: "string", format: "uri", maxLength: 2000 },
    thumbnailUrl: { type: "string", format: "uri", maxLength: 2000 },
  },
} as const;

const todoSchema = {
  type: "object",
  required: ["id", "userId", "title", "completed", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string", format: "uuid" },
    userId: { type: "string", format: "uuid" },
    title: { type: "string", example: "Ship Posts docs page" },
    completed: { type: "boolean", example: false },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const todoCreateSchema = {
  type: "object",
  required: ["userId", "title"],
  properties: {
    userId: { type: "string", format: "uuid" },
    title: { type: "string", minLength: 1, maxLength: 200 },
    completed: { type: "boolean", default: false },
  },
} as const;

const productSchema = {
  type: "object",
  required: [
    "id",
    "name",
    "description",
    "price",
    "stock",
    "category",
    "imageUrl",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", example: "Nordic Desk Lamp" },
    description: { type: "string" },
    price: { type: "number", example: 49.99 },
    stock: { type: "integer", example: 120 },
    category: { type: "string", example: "home" },
    imageUrl: { type: "string", format: "uri" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const productCreateSchema = {
  type: "object",
  required: ["name", "description", "price", "category", "imageUrl"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", minLength: 1, maxLength: 2000 },
    price: { type: "number", minimum: 0 },
    stock: { type: "integer", minimum: 0, default: 0 },
    category: { type: "string", minLength: 1, maxLength: 100 },
    imageUrl: { type: "string", format: "uri", maxLength: 2000 },
  },
} as const;

const notificationSchema = {
  type: "object",
  required: [
    "id",
    "userId",
    "title",
    "message",
    "type",
    "read",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    userId: { type: "string", format: "uuid" },
    title: { type: "string", example: "Welcome to MockData" },
    message: { type: "string" },
    type: {
      type: "string",
      enum: ["info", "success", "warning", "error"],
      example: "info",
    },
    read: { type: "boolean", example: false },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const notificationCreateSchema = {
  type: "object",
  required: ["userId", "title", "message"],
  properties: {
    userId: { type: "string", format: "uuid" },
    title: { type: "string", minLength: 1, maxLength: 200 },
    message: { type: "string", minLength: 1, maxLength: 2000 },
    type: {
      type: "string",
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    read: { type: "boolean", default: false },
  },
} as const;

const countrySchema = {
  type: "object",
  required: [
    "id",
    "name",
    "code",
    "capital",
    "region",
    "population",
    "currency",
    "flagUrl",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", example: "Iran" },
    code: { type: "string", example: "IR" },
    capital: { type: "string", example: "Tehran" },
    region: { type: "string", example: "Asia" },
    population: { type: "integer", example: 83992949 },
    currency: { type: "string", example: "IRR" },
    flagUrl: { type: "string", format: "uri" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const countryCreateSchema = {
  type: "object",
  required: [
    "name",
    "code",
    "capital",
    "region",
    "population",
    "currency",
    "flagUrl",
  ],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 120 },
    code: { type: "string", minLength: 2, maxLength: 2, example: "PT" },
    capital: { type: "string", minLength: 1, maxLength: 120 },
    region: { type: "string", minLength: 1, maxLength: 80 },
    population: { type: "integer", minimum: 0 },
    currency: { type: "string", minLength: 1, maxLength: 10 },
    flagUrl: { type: "string", format: "uri", maxLength: 2000 },
  },
} as const;

const delayParam = {
  name: "delay",
  in: "query",
  required: false,
  description: "Artificial response delay in milliseconds (0–5000).",
  schema: { type: "integer", minimum: 0, maximum: 5000 },
} as const;

const langParam = {
  name: "lang",
  in: "query",
  required: false,
  description:
    "Pass fa for Persian (Iranian) text in the response. Omit for English (default).",
  schema: { type: "string", enum: ["fa"], example: "fa" },
} as const;

const statusParam = {
  name: "status",
  in: "query",
  required: false,
  description:
    "Force an error response with this HTTP status (400–599). Useful for UI error states.",
  schema: { type: "integer", minimum: 400, maximum: 599, example: 500 },
} as const;

const idPathParam = (resource: string) => ({
  name: "id",
  in: "path",
  required: true,
  description: `${resource} UUID`,
  schema: { type: "string", format: "uuid" },
});

const albumIdPathParam = {
  name: "id",
  in: "path",
  required: true,
  description: "Album integer id",
  schema: { type: "integer", minimum: 1 },
} as const;

const pageLimitParams = [
  {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
  },
  {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 50, default: 12 },
  },
] as const;

const orderParam = {
  name: "order",
  in: "query",
  schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
} as const;

function dataWrap(ref: string) {
  return {
    type: "object",
    required: ["data"],
    properties: {
      data: { $ref: ref },
    },
  };
}

function listWrap(ref: string) {
  return {
    type: "object",
    required: ["data", "pagination"],
    properties: {
      data: {
        type: "array",
        items: { $ref: ref },
      },
      pagination: { $ref: "#/components/schemas/Pagination" },
    },
  };
}

function deletedIdResponse(idSchema: Record<string, unknown> = {
  type: "string",
  format: "uuid",
}) {
  return {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "object",
        required: ["id"],
        properties: {
          id: idSchema,
        },
      },
    },
  };
}

const errorResponses = {
  "400": {
    description: "Validation error",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  "401": {
    description: "Unauthorized",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  "404": {
    description: "Not found",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  "429": {
    description: "Rate limited (per IP)",
    headers: {
      "Retry-After": {
        schema: { type: "integer" },
        description: "Seconds until the window resets",
      },
      "X-RateLimit-Limit": { schema: { type: "integer" } },
      "X-RateLimit-Remaining": { schema: { type: "integer" } },
      "X-RateLimit-Reset": {
        schema: { type: "integer" },
        description: "Unix timestamp (seconds)",
      },
    },
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
  "500": {
    description: "Internal error",
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  },
} as const;

export function buildOpenApiDocument(serverUrl = "http://localhost:3000"): OpenApiDocument {
  return {
    openapi: "3.1.0",
    info: {
      title: "MockData",
      version: "1.0.0",
      description:
        "Fake REST APIs with live JSON. Public resources need no keys. Auth demo: any seeded username + password `password`. Persian text: pass query `lang=fa` (English is default).",
      contact: { name: "MockData" },
    },
    servers: [
      { url: serverUrl, description: "Current deployment" },
      { url: "http://localhost:3000", description: "Local development" },
    ],
    tags: [
      { name: "Auth", description: "Mock login and current user" },
      { name: "Users", description: "CRUD users with search and filters" },
      { name: "Posts", description: "CRUD blog posts linked to users" },
      { name: "Comments", description: "CRUD comments on posts" },
      { name: "Albums", description: "CRUD photo albums linked to users" },
      { name: "Photos", description: "CRUD photos grouped by albumId" },
      { name: "Todos", description: "CRUD todos linked to users" },
      { name: "Products", description: "CRUD catalog products" },
      { name: "Notifications", description: "CRUD user notifications" },
      { name: "Countries", description: "CRUD country records" },
      { name: "Admin", description: "Protected ops (ADMIN_SECRET)" },
    ],
    paths: {
      "/api/admin/reset": {
        post: {
          tags: ["Admin"],
          summary: "Reset seed data",
          description:
            "Wipes seed tables and reloads default data. Requires ADMIN_SECRET via x-admin-key or Bearer.",
          operationId: "resetSeed",
          security: [{ adminKey: [] }],
          parameters: [langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Seed reloaded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: {
                        type: "object",
                        required: [
                          "reset",
                          "users",
                          "posts",
                          "comments",
                          "albums",
                          "photos",
                          "todos",
                          "products",
                          "notifications",
                          "countries",
                        ],
                        properties: {
                          reset: { type: "boolean", example: true },
                          users: { type: "integer", example: 24 },
                          posts: { type: "integer", example: 24 },
                          comments: { type: "integer", example: 24 },
                          albums: { type: "integer", example: 8 },
                          photos: { type: "integer", example: 24 },
                          todos: { type: "integer", example: 24 },
                          products: { type: "integer", example: 24 },
                          notifications: { type: "integer", example: 24 },
                          countries: { type: "integer", example: 24 },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": errorResponses["401"],
            "429": errorResponses["429"],
            "500": errorResponses["500"],
            "503": {
              description: "ADMIN_SECRET not configured",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          description:
            "Returns a Bearer token when username exists and password is `password`.",
          operationId: "login",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
                example: { username: "avachen", password: "password" },
              },
            },
          },
          responses: {
            "200": {
              description: "Authenticated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "401": errorResponses["401"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Current user",
          operationId: "getMe",
          parameters: [langParam, delayParam, statusParam],
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Current user",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "401": errorResponses["401"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "List users",
          operationId: "listUsers",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 50, default: 12 },
            },
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "role",
              in: "query",
              schema: { type: "string", enum: ["admin", "member", "guest"] },
            },
            { name: "country", in: "query", schema: { type: "string" } },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "name", "username"],
                default: "createdAt",
              },
            },
            {
              name: "order",
              in: "query",
              schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            },
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated users",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Users"],
          summary: "Create user",
          operationId: "createUser",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user",
          operationId: "getUser",
          parameters: [idPathParam("User"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "User",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Users"],
          summary: "Update user",
          operationId: "updateUser",
          parameters: [idPathParam("User"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated user",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user",
          operationId: "deleteUser",
          parameters: [idPathParam("User"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: {
                        type: "object",
                        required: ["id"],
                        properties: {
                          id: { type: "string", format: "uuid" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/posts": {
        get: {
          tags: ["Posts"],
          summary: "List posts",
          operationId: "listPosts",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 50, default: 12 },
            },
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "userId",
              in: "query",
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "published",
              in: "query",
              schema: { type: "string", enum: ["true", "false"] },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "title"],
                default: "createdAt",
              },
            },
            {
              name: "order",
              in: "query",
              schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            },
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated posts",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PostListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Posts"],
          summary: "Create post",
          operationId: "createPost",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/Post" },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/posts/{id}": {
        get: {
          tags: ["Posts"],
          summary: "Get post",
          operationId: "getPost",
          parameters: [idPathParam("Post"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Post",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/Post" },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Posts"],
          summary: "Update post",
          operationId: "updatePost",
          parameters: [idPathParam("Post"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated post",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: { $ref: "#/components/schemas/Post" },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Posts"],
          summary: "Delete post",
          operationId: "deletePost",
          parameters: [idPathParam("Post"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                      data: {
                        type: "object",
                        required: ["id"],
                        properties: {
                          id: { type: "string", format: "uuid" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/comments": {
        get: {
          tags: ["Comments"],
          summary: "List comments",
          operationId: "listComments",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "postId",
              in: "query",
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "name"],
                default: "createdAt",
              },
            },
            orderParam,
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated comments",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CommentListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Comments"],
          summary: "Create comment",
          operationId: "createComment",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Comment"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/comments/{id}": {
        get: {
          tags: ["Comments"],
          summary: "Get comment",
          operationId: "getComment",
          parameters: [idPathParam("Comment"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Comment",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Comment"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Comments"],
          summary: "Update comment",
          operationId: "updateComment",
          parameters: [idPathParam("Comment"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated comment",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Comment"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Comments"],
          summary: "Delete comment",
          operationId: "deleteComment",
          parameters: [idPathParam("Comment"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse(),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/albums": {
        get: {
          tags: ["Albums"],
          summary: "List albums",
          operationId: "listAlbums",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "userId",
              in: "query",
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "title", "id"],
                default: "id",
              },
            },
            {
              name: "order",
              in: "query",
              schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
            },
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated albums",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AlbumListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Albums"],
          summary: "Create album",
          operationId: "createAlbum",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AlbumCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Album"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/albums/{id}": {
        get: {
          tags: ["Albums"],
          summary: "Get album",
          operationId: "getAlbum",
          parameters: [albumIdPathParam, langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Album",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Album"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Albums"],
          summary: "Update album",
          operationId: "updateAlbum",
          parameters: [albumIdPathParam, langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AlbumUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated album",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Album"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Albums"],
          summary: "Delete album",
          operationId: "deleteAlbum",
          parameters: [albumIdPathParam, langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse({
                    type: "integer",
                    example: 1,
                  }),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/photos": {
        get: {
          tags: ["Photos"],
          summary: "List photos",
          operationId: "listPhotos",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "albumId",
              in: "query",
              schema: { type: "integer", minimum: 1 },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "title", "albumId"],
                default: "createdAt",
              },
            },
            orderParam,
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated photos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PhotoListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Photos"],
          summary: "Create photo",
          operationId: "createPhoto",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhotoCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Photo"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/photos/{id}": {
        get: {
          tags: ["Photos"],
          summary: "Get photo",
          operationId: "getPhoto",
          parameters: [idPathParam("Photo"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Photo",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Photo"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Photos"],
          summary: "Update photo",
          operationId: "updatePhoto",
          parameters: [idPathParam("Photo"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhotoUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated photo",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Photo"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Photos"],
          summary: "Delete photo",
          operationId: "deletePhoto",
          parameters: [idPathParam("Photo"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse(),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/todos": {
        get: {
          tags: ["Todos"],
          summary: "List todos",
          operationId: "listTodos",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "userId",
              in: "query",
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "completed",
              in: "query",
              schema: { type: "string", enum: ["true", "false"] },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "title"],
                default: "createdAt",
              },
            },
            orderParam,
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated todos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TodoListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Todos"],
          summary: "Create todo",
          operationId: "createTodo",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Todo"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/todos/{id}": {
        get: {
          tags: ["Todos"],
          summary: "Get todo",
          operationId: "getTodo",
          parameters: [idPathParam("Todo"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Todo",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Todo"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Todos"],
          summary: "Update todo",
          operationId: "updateTodo",
          parameters: [idPathParam("Todo"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TodoUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated todo",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Todo"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Todos"],
          summary: "Delete todo",
          operationId: "deleteTodo",
          parameters: [idPathParam("Todo"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse(),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "List products",
          operationId: "listProducts",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "name", "price", "stock"],
                default: "createdAt",
              },
            },
            orderParam,
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated products",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProductListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Products"],
          summary: "Create product",
          operationId: "createProduct",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Product"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Get product",
          operationId: "getProduct",
          parameters: [idPathParam("Product"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Product",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Product"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Products"],
          summary: "Update product",
          operationId: "updateProduct",
          parameters: [idPathParam("Product"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated product",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Product"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Delete product",
          operationId: "deleteProduct",
          parameters: [idPathParam("Product"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse(),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/notifications": {
        get: {
          tags: ["Notifications"],
          summary: "List notifications",
          operationId: "listNotifications",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "userId",
              in: "query",
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "type",
              in: "query",
              schema: {
                type: "string",
                enum: ["info", "success", "warning", "error"],
              },
            },
            {
              name: "read",
              in: "query",
              schema: { type: "string", enum: ["true", "false"] },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "title"],
                default: "createdAt",
              },
            },
            orderParam,
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated notifications",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/NotificationListResponse",
                  },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Notifications"],
          summary: "Create notification",
          operationId: "createNotification",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NotificationCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Notification"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/notifications/{id}": {
        get: {
          tags: ["Notifications"],
          summary: "Get notification",
          operationId: "getNotification",
          parameters: [idPathParam("Notification"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Notification",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Notification"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Notifications"],
          summary: "Update notification",
          operationId: "updateNotification",
          parameters: [idPathParam("Notification"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NotificationUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated notification",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Notification"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Notifications"],
          summary: "Delete notification",
          operationId: "deleteNotification",
          parameters: [idPathParam("Notification"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse(),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/countries": {
        get: {
          tags: ["Countries"],
          summary: "List countries",
          operationId: "listCountries",
          parameters: [
            ...pageLimitParams,
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "region", in: "query", schema: { type: "string" } },
            {
              name: "code",
              in: "query",
              schema: { type: "string", minLength: 2, maxLength: 2 },
            },
            {
              name: "sort",
              in: "query",
              schema: {
                type: "string",
                enum: ["createdAt", "name", "population"],
                default: "name",
              },
            },
            orderParam,
            langParam, delayParam,
            statusParam,
          ],
          responses: {
            "200": {
              description: "Paginated countries",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CountryListResponse" },
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
        post: {
          tags: ["Countries"],
          summary: "Create country",
          operationId: "createCountry",
          parameters: [langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CountryCreate" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Country"),
                },
              },
            },
            "400": errorResponses["400"],
            "500": errorResponses["500"],
          },
        },
      },
      "/api/countries/{id}": {
        get: {
          tags: ["Countries"],
          summary: "Get country",
          operationId: "getCountry",
          parameters: [idPathParam("Country"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Country",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Country"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        patch: {
          tags: ["Countries"],
          summary: "Update country",
          operationId: "updateCountry",
          parameters: [idPathParam("Country"), langParam, delayParam, statusParam],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CountryUpdate" },
              },
            },
          },
          responses: {
            "200": {
              description: "Updated country",
              content: {
                "application/json": {
                  schema: dataWrap("#/components/schemas/Country"),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
        delete: {
          tags: ["Countries"],
          summary: "Delete country",
          operationId: "deleteCountry",
          parameters: [idPathParam("Country"), langParam, delayParam, statusParam],
          responses: {
            "200": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: deletedIdResponse(),
                },
              },
            },
            "400": errorResponses["400"],
            "404": errorResponses["404"],
            "500": errorResponses["500"],
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "mock.<userId>",
          description: "Token from POST /api/auth/login (`mock.<uuid>`).",
        },
        adminKey: {
          type: "apiKey",
          in: "header",
          name: "x-admin-key",
          description: "Same value as ADMIN_SECRET (or use Bearer).",
        },
      },
      schemas: {
        Error: errorSchema,
        Pagination: paginationSchema,
        User: userSchema,
        UserCreate: userCreateSchema,
        UserUpdate: {
          type: "object",
          minProperties: 1,
          properties: userCreateSchema.properties,
          description: "Partial user fields; at least one required.",
        },
        UserListResponse: {
          type: "object",
          required: ["data", "pagination"],
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        Post: postSchema,
        PostCreate: postCreateSchema,
        PostUpdate: {
          type: "object",
          minProperties: 1,
          properties: postCreateSchema.properties,
          description: "Partial post fields; at least one required.",
        },
        PostListResponse: {
          type: "object",
          required: ["data", "pagination"],
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Post" },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        Comment: commentSchema,
        CommentCreate: commentCreateSchema,
        CommentUpdate: {
          type: "object",
          minProperties: 1,
          properties: commentCreateSchema.properties,
          description: "Partial comment fields; at least one required.",
        },
        CommentListResponse: listWrap("#/components/schemas/Comment"),
        Album: albumSchema,
        AlbumCreate: albumCreateSchema,
        AlbumUpdate: {
          type: "object",
          minProperties: 1,
          properties: {
            userId: albumCreateSchema.properties.userId,
            title: albumCreateSchema.properties.title,
          },
          description: "Partial album fields; at least one required.",
        },
        AlbumListResponse: listWrap("#/components/schemas/Album"),
        Photo: photoSchema,
        PhotoCreate: photoCreateSchema,
        PhotoUpdate: {
          type: "object",
          minProperties: 1,
          properties: photoCreateSchema.properties,
          description: "Partial photo fields; at least one required.",
        },
        PhotoListResponse: listWrap("#/components/schemas/Photo"),
        Todo: todoSchema,
        TodoCreate: todoCreateSchema,
        TodoUpdate: {
          type: "object",
          minProperties: 1,
          properties: todoCreateSchema.properties,
          description: "Partial todo fields; at least one required.",
        },
        TodoListResponse: listWrap("#/components/schemas/Todo"),
        Product: productSchema,
        ProductCreate: productCreateSchema,
        ProductUpdate: {
          type: "object",
          minProperties: 1,
          properties: productCreateSchema.properties,
          description: "Partial product fields; at least one required.",
        },
        ProductListResponse: listWrap("#/components/schemas/Product"),
        Notification: notificationSchema,
        NotificationCreate: notificationCreateSchema,
        NotificationUpdate: {
          type: "object",
          minProperties: 1,
          properties: notificationCreateSchema.properties,
          description: "Partial notification fields; at least one required.",
        },
        NotificationListResponse: listWrap("#/components/schemas/Notification"),
        Country: countrySchema,
        CountryCreate: countryCreateSchema,
        CountryUpdate: {
          type: "object",
          minProperties: 1,
          properties: countryCreateSchema.properties,
          description: "Partial country fields; at least one required.",
        },
        CountryListResponse: listWrap("#/components/schemas/Country"),
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 1, maxLength: 50 },
            password: { type: "string", minLength: 1, maxLength: 200 },
          },
        },
        LoginResponse: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              required: ["token", "tokenType", "expiresIn", "user"],
              properties: {
                token: { type: "string", example: "mock.550e8400-e29b-41d4-a716-446655440000" },
                tokenType: { type: "string", example: "Bearer" },
                expiresIn: { type: "integer", example: 3600 },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
      },
    },
  };
}

/** Stable path used by UI download links. */
export const OPENAPI_PATH = "/openapi.json";
