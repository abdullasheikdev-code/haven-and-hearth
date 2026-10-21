# Haven & Hearth — Security & Data Protection Guide

---

## 1. Authentication & Cookie Protection
- Passwords are salted and hashed with **bcryptjs** (10 salt rounds) prior to saving to MongoDB.
- Tokens are signed with HMAC SHA-256 JWTs with a 7-day expiration.
- Sessions are stored in secure, **HTTP-only cookies** with `SameSite=Lax` to prevent XSS credential theft.

---

## 2. Server-Enforced RBAC & Tenant Isolation
- Permissions are strictly enforced on Express route handlers using `requireRole(...)` and `requireBranchAccess`.
- Front-end route protection is treated purely as a navigational aid; the server never trusts client-supplied roles, discounts, prices, or tenant IDs.
- Authoritative financial pricing: when an order is created, menu item prices are read directly from MongoDB rather than accepting client-provided amounts.

---

## 3. Rate Limiting & HTTP Headers
- Authentication endpoints (`/api/v1/auth/login`) are rate-limited to 50 requests per 15-minute window via `express-rate-limit`.
- Helmet middleware sets HTTP security headers:
  - `Content-Security-Policy`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - Strict-Transport-Security in production.

---

## 4. Input Validation & Concurrency Controls
- All API request bodies and query parameters are parsed and validated through **Zod** schemas.
- Concurrency control in hotel room bookings: Overlapping reservation queries verify total room capacity before issuing confirmation to prevent double-booking.
