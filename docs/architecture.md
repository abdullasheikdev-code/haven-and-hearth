# Haven & Hearth — Architecture Overview

Haven & Hearth is a multi-tenant, full-spectrum hospitality platform engineered with the complete MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

---

## High-Level Topology

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  - React 18 SPA (Vite + TypeScript)                                             |
|  - Tailwind CSS Luxury Design Tokens (Ivory, Forest Green, Terracotta, Mango)   |
|  - Socket.IO Real-Time Client                                                   |
|  - TanStack Query & React Context State                                         |
+---------------------------------------------------------------------------------+
                                       |
                                       v  HTTP / HTTPS REST & WebSocket WSS
+---------------------------------------------------------------------------------+
|                                 SERVER TIER                                     |
|  - Node.js & Express.js REST API (/api/v1)                                      |
|  - HTTP-Only JWT Cookie & Role-Based Access Control (RBAC)                      |
|  - Zod Request Schema Validation & Output Encoding                              |
|  - Socket.IO Real-Time Gateway (Kitchen, Branch, Reception Rooms)               |
|  - Centralized Error Handling & Rate Limiting                                   |
+---------------------------------------------------------------------------------+
                                       |
                                       v  Mongoose ODM (Atomic Updates & Sessions)
+---------------------------------------------------------------------------------+
|                               DATABASE TIER                                     |
|  - MongoDB Atlas / Local MongoDB 7.0                                            |
|  - Indexes on unique slugs, order numbers, booking dates, branch IDs            |
|  - Cross-tenant data isolation                                                  |
+---------------------------------------------------------------------------------+
```

---

## Monorepo Layout

```
haven-and-hearth/
├── apps/
│   ├── api/                     # Node.js + Express REST API Server
│   │   ├── src/
│   │   │   ├── config/          # Database & environment variables
│   │   │   ├── controllers/     # Business logic & responses
│   │   │   ├── middleware/      # Auth, RBAC, Zod validation, error handler
│   │   │   ├── models/          # 18 Mongoose domain models
│   │   │   ├── routes/          # Express route declarations
│   │   │   ├── seeds/           # Master database seed script
│   │   │   ├── sockets/         # Real-time event gateway
│   │   │   └── server.ts        # Server entry point
│   │   └── tests/               # Vitest + Supertest integration tests
│   └── web/                     # React 18 + Vite SPA Frontend
│       ├── src/
│       │   ├── components/      # Common UI, Header, Footer, Illustrations
│       │   ├── context/         # AuthContext & CartContext
│       │   ├── features/        # Discovery, Dining, Stays, Cart, POS, KDS, etc.
│       │   ├── lib/             # API client & Socket.IO helpers
│       │   └── styles/          # Tailwind design tokens & font configs
│       └── tests/               # React Testing Library unit tests
├── packages/
│   └── shared/                  # Shared TypeScript types, enums, & Zod schemas
└── docs/                        # Engineering guides & specifications
```
