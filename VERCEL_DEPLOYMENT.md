# Vercel Deployment Guide

This guide will help you deploy your Netflix clone to Vercel.

## Prerequisites

- GitHub repository connected (already done ✅)
- Vercel account (sign up at https://vercel.com if needed)

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** or **"Import Project"**
3. Import your GitHub repository: `sahana0708/Netflix-App`
4. Vercel will detect it's a monorepo

### 2. Configure Project Settings

**Root Directory:** Leave as root (`/`)

**Framework Preset:** Other (or Vite if available)

**Build Settings:**
- **Build Command:** `cd frontend && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `cd backend && npm install && cd ../frontend && npm install`

### 3. Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
TMDB_API_KEY=your_tmdb_api_key
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
NODE_TLS_REJECT_UNAUTHORIZED=0
FRONTEND_URL=https://your-app-name.vercel.app
```

**Note:** Replace the placeholder values with your actual credentials:
- `DATABASE_URL`: Your Aiven PostgreSQL connection string
- `TMDB_API_KEY`: Your TMDB API key
- `TMDB_READ_ACCESS_TOKEN`: Your TMDB read access token
- `FRONTEND_URL`: Will be your Vercel deployment URL (update after first deploy)

**Important:** Replace `your-app-name.vercel.app` with your actual Vercel deployment URL after first deploy.

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

### 5. Update FRONTEND_URL

After the first deployment:
1. Copy your Vercel deployment URL (e.g., `https://netflix-app-xyz.vercel.app`)
2. Go to **Settings → Environment Variables**
3. Update `FRONTEND_URL` to your actual Vercel URL
4. **Redeploy** (or it will auto-redeploy on next push)

## Project Structure for Vercel

- **Frontend:** Built to `frontend/dist` and served as static files
- **Backend:** Express app in `api/index.js` runs as serverless function
- **API Routes:** All `/api/*` requests are routed to the serverless function

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### API Routes Not Working
- Ensure `api/index.js` exists and exports the Express app
- Check Vercel function logs in the dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Ensure `NODE_TLS_REJECT_UNAUTHORIZED=0` is set for Aiven

### CORS Errors
- Update `FRONTEND_URL` to your Vercel domain
- Check that CORS is configured in `backend/src/app.js`

## Testing

After deployment:
1. Visit your Vercel URL
2. Test signup/login flow
3. Verify movie data loads on the landing page

## Continuous Deployment

Vercel automatically deploys on every push to your main branch. Just push to GitHub and Vercel will rebuild!
