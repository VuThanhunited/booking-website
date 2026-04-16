# Booking Website - Deployment Guide

## Backend Deployment (Render.com)

### Prerequisites
- Render.com account
- MongoDB connection string (already have)
- GitHub repository connected

### Steps
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: booking-website-api
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid)

5. **Add Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://vuthanh:vuthanh@product.xgsynmy.mongodb.net/assignment2?retryWrites=true
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   NODE_ENV=production
   PORT=5000
   ```

6. Deploy and wait for build to complete
7. Copy the Render URL (e.g., `https://booking-website-api.onrender.com`)

### Update CORS
After Backend is deployed:
1. Get the Render URL
2. Get the Vercel URL for frontend
3. Update `server/server.js` - Add URLs to `allowedOrigins` array:
   ```javascript
   const allowedOrigins = [
     "http://localhost:3000",
     "http://localhost:3001",
     "https://your-vercel-app.vercel.app",
     "https://your-render-backend.onrender.com",
   ];
   ```

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (sign up with GitHub)
- GitHub repository

### Steps
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: React
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-render-backend.onrender.com
   ```

6. Deploy

## Admin Dashboard Deployment (Optional - Firebase or Vercel)

### Option 1: Firebase (current setup)
Already configured in `admin/firebase.json`
Deploy with: `firebase deploy --only hosting:admin`

### Option 2: Vercel
Create new Vercel project with:
- Root Directory: `./admin`
- Environment: `REACT_APP_API_URL=your_backend_url`

## After Deployment

1. Test API endpoints
2. Test authentication flow
3. Test booking features
4. Monitor logs in Render dashboard

## Troubleshooting

**502 Bad Gateway on Render**:
- Check server logs in Render dashboard
- Verify MongoDB connection string
- Ensure PORT is set to 5000 or use process.env.PORT

**CORS errors**:
- Update allowedOrigins in server.js
- Redeploy server
- Wait 2-3 minutes for changes to take effect

**Vercel build fails**:
- Check environment variables are set
- Ensure REACT_APP_API_URL is correct
- Check build logs in Vercel dashboard
