# Quick Deployment Instructions

## Backend Deployment (Railway)

1. **Create Railway Account**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Deploy Backend**:

   - Create new project in Railway
   - Connect your GitHub repository
   - Set root directory to `server`
   - Railway will auto-detect Node.js and deploy

3. **Environment Variables** (Set in Railway dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

## Frontend Deployment (Vercel)

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Deploy Frontend**:

   - Import your GitHub repository to Vercel
   - Set root directory to `client`
   - Set build command: `npm run build`
   - Set output directory: `build`

3. **Environment Variables** (Set in Vercel dashboard):
   ```
   REACT_APP_SERVER_URL=https://your-backend-domain.railway.app
   ```

## Alternative: Deploy to GitHub and use hosting platforms

### Quick GitHub Setup:

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - Live Polling System"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/live-polling-system.git
git branch -M main
git push -u origin main
```

### Then deploy:

- **Backend**: Railway, Heroku, or Render
- **Frontend**: Vercel, Netlify, or GitHub Pages

## URLs to Share:

- Frontend URL: `https://your-app.vercel.app`
- Backend URL: `https://your-api.railway.app`

## Testing Deployment:

1. Open frontend URL
2. Test teacher and student flows
3. Verify real-time features work
4. Test chat functionality
