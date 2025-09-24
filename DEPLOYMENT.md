# Deployment Guide

This guide explains how to deploy the Live Polling System to production.

## Prerequisites

- Node.js 16+ installed
- Git repository
- Accounts on Vercel (for frontend) and Railway/Heroku (for backend)

## Backend Deployment (Railway/Heroku)

### Option 1: Railway (Recommended)

1. **Create Railway Account**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**

   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Connect to Railway**

   - Create new project in Railway
   - Connect your GitHub repository
   - Select the `server` directory as the root
   - Railway will automatically detect Node.js and deploy

4. **Environment Variables**
   Set these in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

### Option 2: Heroku

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   cd server
   heroku create your-polling-app-backend
   ```

3. **Configure Environment**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial backend commit"
   heroku git:remote -a your-polling-app-backend
   git push heroku main
   ```

## Frontend Deployment (Vercel)

1. **Create Vercel Account**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Prepare Frontend**

   ```bash
   cd client
   # Create production environment file
   echo "REACT_APP_SERVER_URL=https://your-backend-domain.railway.app" > .env.production
   ```

3. **Deploy to Vercel**
   - Import your GitHub repository to Vercel
   - Set the root directory to `client`
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Add environment variable:
     ```
     REACT_APP_SERVER_URL=https://your-backend-domain.railway.app
     ```

## Alternative: Single Platform Deployment

### Render (Full-Stack)

1. **Backend Service**

   - Create new Web Service
   - Connect repository, select `server` directory
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Frontend Service**
   - Create new Static Site
   - Connect repository, select `client` directory
   - Build Command: `npm run build`
   - Publish Directory: `build`

## Environment Variables

### Backend (.env)

```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)

```
REACT_APP_SERVER_URL=https://your-backend-domain.com
```

## Post-Deployment Checklist

1. **Test Backend Health**

   ```bash
   curl https://your-backend-domain.com/health
   ```

2. **Test WebSocket Connection**

   - Open frontend in browser
   - Check browser console for connection status
   - Verify real-time features work

3. **Test Core Features**
   - Teacher login and poll creation
   - Student login and voting
   - Real-time results update
   - Chat functionality

## Monitoring & Maintenance

1. **Health Checks**

   - Backend: `GET /health`
   - Check response time and uptime

2. **Logs**

   - Railway: View in dashboard
   - Heroku: `heroku logs --tail`
   - Vercel: Check function logs

3. **Scaling**
   - Monitor concurrent users
   - Upgrade plans if needed
   - Consider Redis for session management at scale

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Verify CORS_ORIGIN environment variable
   - Check domain spelling and protocol (https/http)

2. **WebSocket Connection Failed**

   - Ensure backend supports WebSocket
   - Check firewall/proxy settings
   - Verify Socket.io client version matches server

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Clear cache and rebuild

### Performance Optimization

1. **Frontend**

   - Enable gzip compression
   - Use CDN for static assets
   - Implement code splitting

2. **Backend**
   - Add connection pooling
   - Implement rate limiting
   - Use Redis for caching

## Security Considerations

1. **HTTPS Only**

   - Force HTTPS in production
   - Update CORS settings

2. **Rate Limiting**

   - Already implemented in backend
   - Monitor for abuse

3. **Input Validation**

   - Server-side validation in place
   - Sanitization implemented

4. **Error Handling**
   - Don't expose stack traces in production
   - Log errors securely

## Support

For deployment issues:

1. Check the logs first
2. Verify environment variables
3. Test API endpoints individually
4. Check network connectivity
