# Diya Modular - Full Stack Setup Guide

## 🚀 Project Overview

This is a MERN stack application for Diya Modular with:
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Authentication**: JWT-based admin authentication

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- npm or yarn

---

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/diya-modular
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/diya-modular

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Admin Credentials (for initial admin creation)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ROLE=admin

# Server Port
PORT=5000
```

### 3. Create Initial Admin User

```bash
npm run create-admin
```

This will create an admin user with the credentials specified in your `.env` file.

**⚠️ Important**: Change the default password after first login!

### 4. Start Backend Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000` (or the next available port)

### 4. Build for Production

```bash
npm run build
```

---

## 🔐 Admin Authentication

### Login

1. Navigate to `/admin-login`
2. Enter your admin email and password
3. Upon successful login, you'll be redirected to `/admin`

### Protected Routes

The following routes require authentication:
- `/admin` - Admin Dashboard
- `/admin/gallery-upload` - Gallery Upload Page

### Token Storage

- Tokens are stored in `localStorage`
- Token expires after 7 days
- Automatic logout on token expiration

---

## 📸 Image Upload & Gallery

### Admin Image Upload

1. Login to admin dashboard
2. Click "Upload Image" or navigate to `/admin/gallery-upload`
3. Fill in:
   - **Image File**: Select image (jpg, jpeg, png, webp)
   - **Title**: Optional image title
   - **Category**: Required (kitchen, living, wardrobe, tv, ceiling, study)
   - **Description**: Optional description
4. Click "Upload Image"
5. Progress indicator will show upload progress

### Image Optimization

- Images are automatically optimized by Cloudinary
- Format: Auto (WebP when supported)
- Quality: Auto (good compression)
- Max dimensions: 1920x1080 (maintained aspect ratio)

### Gallery Display

- Public gallery: `/gallery/:category`
- Images are lazy-loaded for better performance
- Infinite scroll for pagination
- Optimized URLs are used automatically

---

## 🛠️ API Endpoints

### Public Endpoints

#### Gallery
- `GET /api/gallery` - Get all images (with pagination)
  - Query params: `page`, `limit`, `category`
- `GET /api/gallery/:category` - Get images by category

#### Contact
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Admin Only)

#### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin info

#### Gallery
- `POST /api/gallery/upload` - Upload image
  - Requires: `file`, `category`
  - Optional: `title`, `description`
- `DELETE /api/gallery/:id` - Delete image

#### Contact
- `GET /api/contact` - Get all contact queries

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── db.js              # Database connection
├── controllers/
│   ├── adminController.js # Admin authentication
│   ├── contactController.js
│   └── galleryController.js
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── cloudinaryUpload.js # Multer + Cloudinary upload
├── models/
│   ├── Admin.js           # Admin model with bcrypt
│   ├── Contact.js
│   └── Gallery.js         # Gallery model
├── routes/
│   ├── adminRoutes.js
│   ├── contactRoutes.js
│   └── galleryRoutes.js
├── scripts/
│   └── createAdmin.js     # Script to create admin user
├── utils/
│   └── cloudinaryUtils.js # Cloudinary URL utilities
└── server.js

frontend/
├── src/
│   ├── Admin/
│   │   ├── Admin.jsx           # Admin dashboard
│   │   ├── AdminGallery.jsx    # Gallery management
│   │   ├── AdminLogin.jsx      # Login page
│   │   ├── GalleryUpload.jsx   # Upload form
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── services/
│   │   └── api.js              # API service layer
│   └── Pages/
│       └── GalleryUnit.jsx     # Public gallery view
└── ...
```

---

## 🔒 Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Protected Routes**: Middleware protection on admin routes
4. **Input Validation**: Server-side validation
5. **File Upload Limits**: 5MB max file size
6. **File Type Validation**: Only image files allowed
7. **Environment Variables**: Sensitive data in .env

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env`
- Check network/firewall settings

**Cloudinary Upload Fails**
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB)
- Ensure file format is supported

**Admin Login Fails**
- Run `npm run create-admin` to create admin user
- Check email/password in `.env`
- Verify JWT_SECRET is set

### Frontend Issues

**API Calls Fail**
- Check if backend server is running
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors

**Images Not Loading**
- Verify Cloudinary configuration
- Check image URLs in network tab
- Ensure images are uploaded successfully

---

## 📝 Additional Notes

- **Image Categories**: kitchen, living, wardrobe, tv, ceiling, study
- **Token Expiry**: 7 days (configurable in `adminController.js`)
- **Pagination**: Default 20 images per page
- **File Size Limit**: 5MB per image
- **Supported Formats**: jpg, jpeg, png, webp

---

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Run `npm start` or use PM2

### Frontend Deployment

1. Build: `npm run build`
2. Deploy `dist` folder to hosting (Netlify, Vercel, etc.)
3. Set `VITE_API_URL` to production API URL

---

## 📞 Support

For issues or questions, check the code comments or create an issue in the repository.

---

**Last Updated**: 2024



