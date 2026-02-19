# Troubleshooting Network Error on Sign Up

## Changes Made

1. **Fixed CORS** - Changed to allow all origins (`origin: true`)
2. **Added better error handling** - Frontend now shows detailed error messages
3. **Added catch-all route** - Express app returns 404 with path info for debugging
4. **Added ESM support** - Created `api/package.json` with `"type": "module"`

## How to Debug

### 1. Check Browser Console
Open your browser's Developer Tools (F12) → Console tab, and try signing up again. You should see:
- The actual error message
- Network request details
- Response status code

### 2. Check Vercel Function Logs
1. Go to: https://vercel.com/sahanamasimath-6483s-projects/netflix-app
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on `/api` function
5. Check **Logs** tab for errors

### 3. Test API Directly
Try calling the API directly:
```bash
curl -X POST https://netflix-app-nu-indol.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

## Common Issues & Fixes

### Issue: "Network error" or CORS error
**Fix:** CORS is now set to allow all origins. If still failing, check Vercel function logs.

### Issue: 404 Not Found
**Fix:** The rewrite rule might not be working. Check `vercel.json` rewrites.

### Issue: 500 Internal Server Error
**Fix:** Check:
- Environment variables are set in Vercel
- Database connection (DATABASE_URL)
- Function logs in Vercel dashboard

### Issue: Function timeout
**Fix:** Database connection might be slow. Check Aiven connection string.

## Next Steps

1. **Wait for auto-deploy** - Vercel should auto-deploy after the git push (takes ~1-2 minutes)
2. **Test again** - Try signing up after deployment completes
3. **Check logs** - If still failing, check Vercel function logs for specific errors
4. **Report back** - Share the error message from browser console or Vercel logs

## Current Status

- ✅ CORS fixed (allows all origins)
- ✅ Error handling improved
- ✅ ESM support added
- ✅ Changes pushed to GitHub
- ⏳ Waiting for Vercel auto-deploy
