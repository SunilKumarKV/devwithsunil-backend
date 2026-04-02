# DevWithSunil Backend - Production Deployment Guide

Deploy your backend to **Render** with **Neon PostgreSQL** database.

---

## Prerequisites

1. GitHub account (for deployment)
2. Render account (https://render.com)
3. Neon account (https://neon.tech)
4. Node.js 18+ installed locally
5. PostgreSQL client tools (optional, for testing connections)

---

## Step 1: Set up PostgreSQL database on Neon

### 1.1 Create Neon Project

1. Go to https://neon.tech and sign in/create account
2. Click **New Project**
3. Choose a name: `devwithsunil`
4. Select region closest to your users
5. Click **Create**

### 1.2 Create Database and User

Once your project is created:

1. In Neon Dashboard, copy your **Connection String** (PostgreSQL URL)
   - Format: `postgresql://user:password@host/dbname`
2. Open **SQL Editor** in Neon
3. Run the init script:

```sql
-- Run /sql/init.sql content here or paste directly
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  date DATE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  read_time INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Step 2: Prepare Backend Code

### 2.1 Update .env for Production

Copy `.env.example` to `.env` and fill in production values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=production
APP_NAME=DevWithSunil

# From Neon Connection String:
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USER=neondb_owner
DB_PASSWORD=your-neon-password

# Generate strong secrets
JWT_SECRET=your-very-long-random-secret-minimum-32-characters
JWT_EXPIRATION=4h

# Set to your frontend domain
CORS_ORIGIN=https://your-frontend.com

# Email credentials
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=admin@example.com
```

### 2.2 Commit to GitHub

```bash
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/your-username/devwithsunil-backend.git
git push -u origin main
```

---

## Step 3: Deploy to Render

### 3.1 Create Web Service on Render

1. Go to https://render.com and sign in
2. Click **New +** → **Web Service**
3. Select **Build and deploy from a Git repository**
4. Connect your GitHub account and select `devwithsunil-backend` repo
5. Fill in settings:
   - **Name**: `devwithsunil-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3.2 Add Environment Variables

In Render Service Settings, go to **Environment**:

Add these variables (copy from your `.env`):

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret
DB_HOST=your-neon-host
DB_PORT=5432
DB_DATABASE=neondb
DB_USER=neondb_owner
DB_PASSWORD=your-password
CORS_ORIGIN=https://your-frontend.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
EMAIL_TO=admin@example.com
APP_NAME=DevWithSunil
JWT_EXPIRATION=4h
```

### 3.3 Deploy

1. Click **Create Web Service**
2. Wait for build to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://devwithsunil-api.onrender.com`

### 3.4 Verify Deployment

Test your API:

```bash
curl https://devwithsunil-api.onrender.com/api
# Should return: { "status": "success", "message": "DevWithSunil API is running" }
```

Swagger docs:

```
https://devwithsunil-api.onrender.com/api-docs
```

---

## Step 4: Configure Frontend CORS

Update your frontend to use the Render backend URL:

```javascript
// .env or config
REACT_APP_API_URL=https://devwithsunil-api.onrender.com
```

Update the Render backend CORS:

1. Go to Render Service → Settings → Environment
2. Update `CORS_ORIGIN` to your **frontend URL**
3. Click **Save** (auto-deploys)

---

## Step 5: Test Production Endpoints

### Subscribe to Newsletter

```bash
curl -X POST https://devwithsunil-api.onrender.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Submit Contact Form

```bash
curl -X POST https://devwithsunil-api.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","message":"Hello!"}'
```

### Get Blog Posts

```bash
curl https://devwithsunil-api.onrender.com/api/blog/posts
```

---

## Step 6: Database Backups (Neon)

Neon has built-in backups. To manually backup:

1. In Neon Dashboard → Branches
2. Snapshots are created automatically
3. You can restore from previous snapshots anytime

---

## Step 7: Monitor & Maintain

### Logs

View backend logs in Render:

1. Go to Service → **Logs**
2. Filter by date/error level

### Metrics

Render shows:

- CPU usage
- Memory usage
- Number of requests

### Update Environment Variables

To update secrets without redeployment:

1. Render → Service Settings → Environment
2. Edit variable
3. Click **Save** (triggers redeploy)

### Deploy Updates

Push changes to GitHub:

```bash
git add .
git commit -m "Update API feature"
git push origin main
```

Render auto-redeploys on `main` branch push.

---

## Troubleshooting

### Database Connection Fails

Check:

1. Neon Connection String is correct
2. All `DB_*` env vars are set in Render
3. Neon IP allowlist includes Render IPs (usually auto-allowed)

### CORS Error on Frontend

Solution:

1. Update `CORS_ORIGIN` in Render env to match your frontend URL
2. Wait for redeploy to complete
3. Clear browser cache

### Email Not Sending

Check:

1. Gmail app password is correct (not regular password)
2. `EMAIL_TO` is set
3. Check logs for nodemailer errors

### Port Already in Use

If local testing conflicts:

```bash
# Run on different port
PORT=5001 npm run dev
```

---

## Production Checklist

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] CORS_ORIGIN matches frontend domain
- [ ] DB credentials are correct
- [ ] Email credentials are valid
- [ ] NODE_ENV=production
- [ ] Rate limiters are active
- [ ] Error handling hides stack traces
- [ ] Helmet security headers enabled
- [ ] HTTPS only (Render provides free SSL)
- [ ] Database backups enabled (Neon default)
- [ ] Monitoring/logging in place

---

## Useful Commands

### Test locally before deploying

```bash
npm install
npm run dev
```

### Run production build locally

```bash
NODE_ENV=production npm start
```

### Run tests

```bash
npm test
```

### View swagger docs

```
http://localhost:5000/api-docs
```

---

## Support & Next Steps

- **Documentation**: Swagger UI at `/api-docs`
- **Neon Docs**: https://neon.tech/docs
- **Render Docs**: https://render.com/docs
- **Issues**: Check logs in Render or Neon dashboards

Happy deploying! 🚀
