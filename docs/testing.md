# Haven & Hearth — Quality Assurance & Testing Suite

---

## 1. Automated Test Frameworks

- **Backend API Tests**: Vitest + Supertest in `apps/api/tests/api.test.ts`
- **Frontend Component & Integration Tests**: Vitest + React Testing Library + JSDOM in `apps/web/tests/web.test.tsx`

---

## 2. Running Test Commands

### Run all tests across workspaces:
```bash
npm test
```

### Run only backend API tests:
```bash
npm run test --workspace=@haven/api
```

### Run only web frontend tests:
```bash
npm run test --workspace=@haven/web
```

---

## 3. Verified End-to-End Test Matrix

| Test Suite | Scenario | Result |
|---|---|---|
| Health Check | `GET /api/v1/health` returns healthy engine and active database | PASS |
| Auth Verification | `POST /api/v1/auth/login` verifies valid password, sets token | PASS |
| Auth Rejection | `POST /api/v1/auth/login` rejects invalid password with 401 | PASS |
| RBAC Route Guard | `GET /api/v1/pos/context` rejects unauthenticated requests with 401 | PASS |
| Restaurant Catalog | `GET /api/v1/restaurants` returns active luxury dining entities | PASS |
| Restaurant Detail | `GET /api/v1/restaurants/:slug` returns menu items and table list | PASS |
| Table Availability | `GET /api/v1/reservations/availability` queries valid slots | PASS |
| Hotel Stays | `GET /api/v1/hotels` returns 5-star boutique residences | PASS |
| UI Header Rendering | `Header` renders brand glyph, title, and navigation links | PASS |
| UI Badge Variants | `Badge` renders correct color tokens and classes | PASS |
