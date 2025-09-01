# 🚀 Deployment Guide for Task Manager

This guide will help you deploy your Task Manager application to Render (Backend) and Vercel (Frontend).

## 📋 Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (for database)
- Render account
- Vercel account

## 🔧 Backend Deployment (Render)

### 1. Prepare Your Backend

1. **Environment Variables**: Create a `.env` file in your backend folder:
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```

2. **Database Setup**: 
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Replace `username`, `password`, `cluster`, and `database` in MONGO_URI

### 2. Deploy to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `task-manager-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Environment Variables**:
   - Add all variables from your `.env` file
   - Set `NODE_ENV` to `production`

4. **Deploy**: Click "Create Web Service"

### 3. Get Your Backend URL

After deployment, you'll get a URL like:
```
https://your-app-name.onrender.com
```

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Your Frontend

1. **Environment Variables**: Create a `.env.local` file in your frontend folder:
   ```bash
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

2. **Update CORS**: Make sure your backend CORS includes your Vercel domain

### 2. Deploy to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - Add `VITE_API_URL` with your Render backend URL

4. **Deploy**: Click "Deploy"

### 3. Get Your Frontend URL

After deployment, you'll get a URL like:
```
https://your-project-name.vercel.app
```

## 🔄 Update Backend CORS

After getting your Vercel domain, update your backend CORS configuration:

1. Go to Render Dashboard
2. Add environment variable: `FRONTEND_URL=https://your-vercel-domain.vercel.app`
3. Redeploy your backend

## 🧪 Testing Deployment

1. **Backend Health Check**: Visit `/health` endpoint
2. **Frontend**: Test login/signup functionality
3. **API Calls**: Verify frontend can communicate with backend

## 🚨 Common Issues & Solutions

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that your Vercel domain is in the allowed origins

### Database Connection Issues
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure IP whitelist includes Render's IPs

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Restart service after adding variables

## 📱 Environment-Specific Configs

### Development
```bash
# Backend
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=dev-secret
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000
```

### Production
```bash
# Backend
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-domain.vercel.app

# Frontend
VITE_API_URL=https://your-backend.onrender.com
```

## 🔒 Security Notes

- Use strong, unique JWT secrets
- Never commit `.env` files to Git
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Regularly update dependencies

## 📞 Support

If you encounter issues:
1. Check Render/Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors
5. Verify database connectivity

---

**Happy Deploying! 🎉**
