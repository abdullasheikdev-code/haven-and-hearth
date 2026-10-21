# Haven & Hearth — Deployment Guide

This guide describes how to deploy the Haven & Hearth hospitality platform to production environments.

---

## 1. Hosting Architecture Recommended

- **Frontend (`apps/web`)**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
  - Build Command: `npm run build:web`
  - Output Directory: `apps/web/dist`
  - Environment Variables:
    - `VITE_API_URL`: Your hosted API URL (e.g., `https://api.havenandhearth.com`)
- **Backend (`apps/api`)**: [Render](https://render.com), [Railway](https://railway.app), or AWS Elastic Beanstalk
  - Build Command: `npm run build:shared && npm run build:api`
  - Start Command: `npm run start --workspace=@haven/api`
  - Environment Variables:
    - `PORT`: `5000` (or injected by host)
    - `NODE_ENV`: `production`
    - `MONGO_URI`: MongoDB Atlas connection string
    - `JWT_SECRET`: 64+ char random hex string
    - `CLIENT_URL`: Hosted frontend URL
    - `CORS_ORIGIN`: Hosted frontend URL
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
  - Dedicated or shared M0/M10 cluster with automated backups.

---

## 2. Environment Variables Configuration

Create a production `.env` file in `apps/api`:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/haven_and_hearth?retryWrites=true&w=majority
JWT_SECRET=production_ultra_secret_64_character_hex_key_here
CLIENT_URL=https://haven-and-hearth.vercel.app
CORS_ORIGIN=https://haven-and-hearth.vercel.app
```

---

## 3. Database Seeding in Staging / Demo
To seed demonstration records:
```bash
npm run seed --workspace=@haven/api
```

---

## 4. Production Health Verification
Once deployed, perform health verification:
```bash
curl -f https://<your-api-domain>/api/v1/health
```
Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "platform": "Haven & Hearth Hospitality Engine",
    "database": {
      "status": "connected"
    }
  }
}
```
