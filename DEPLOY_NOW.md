# Deploy to Vercel — Done

Your app is live.

---

## Live URLs

- **Production:** https://netflix-app-nu-indol.vercel.app  
- **Inspect / logs:** https://vercel.com/sahanamasimath-6483s-projects/netflix-app  

---

## Add environment variables (required for login + movies)

The site will load, but **sign up, login, and movie data need these env vars** in Vercel:

1. Open: https://vercel.com/sahanamasimath-6483s-projects/netflix-app/settings/environment-variables  
2. Add these (use the same values as in your `backend/.env`):

| Name | Value (from backend/.env) |
|------|---------------------------|
| `DATABASE_URL` | Your Aiven PostgreSQL URL |
| `TMDB_API_KEY` | Your TMDB API key |
| `TMDB_READ_ACCESS_TOKEN` | Your TMDB read access token |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` |
| `FRONTEND_URL` | `https://netflix-app-nu-indol.vercel.app` |

3. Save, then **redeploy**:  
   - Deployments → … on latest → Redeploy  
   - Or run: `npx vercel --prod`

After that, sign up, login, and the landing page with movies will work.

---

## Deploy again from your machine

```bash
npx vercel --prod
```

Or from the repo root: `npm run deploy`

---

## Auto-deploy

The project is connected to GitHub. Pushes to `main` will trigger a new deployment automatically.
