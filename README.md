# Thriftr

## Introduction

**Thriftr** is a modern reselling platform designed to make buying and selling products simple, secure, and enjoyable. Whether you’re decluttering your space, hunting for unique finds, or running a small business, Thriftr provides a seamless marketplace where anyone can list items, discover great deals, and connect with potential buyers.

Built with a focus on **speed, usability, and trust**, Thriftr combines the reliability of the MERN stack with a clean, customizable interface powered by Shadcn UI. With secure authentication, smooth product management, and advanced filtering, the platform ensures a personalized shopping experience tailored to every user’s needs.

By integrating features like **likes, reviews, carts, and checkout**, Thriftr not only helps sellers manage their listings but also empowers buyers to shop with confidence. Future versions will expand this ecosystem with **real-time chat** for direct buyer–seller communication, making Thriftr a one-stop destination for online reselling.

---

## Live Demo

🚀 Check out the deployed app here: [https://thriftr.onrender.com](https://thriftr.onrender.com)

---

## Tech Stack

- **MERN** (MongoDB, Express.js, React.js, Node.js)  
- **Shadcn UI** for frontend components  
- **Cloudinary** for image uploads  
- **JWT (JSON Web Token)** for authentication  

---

## Features

- **Authentication:** Secure registration and login with JWT.  
- **Custom Color Theming:** Personalized UI with seed-based theming.  
- **Like Products:** Save and like your favorite products.  
- **Filtering & Sorting:** Browse products by likes, price, and recency.  
- **Cart & Checkout:** Add items to cart and complete purchases.  
- **Ratings & Reviews:** Share feedback and read others’ experiences.  
- **Seller Tools:** Create, edit, and delete product listings easily.  

---

## Environment Variables

### Backend (`.env`)

The backend requires the following environment variables:  

```env
MONGODB_URI=your-mongodb-uri
ASSIGNMENT_SEED=your-assignment-seed
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=your-admin-email
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Frontend (`.env.local`)

The frontend requires the following environment variable:  

```env
VITE_ASSIGNMENT_SEED=your-assignment-seed
```

---

## Setup Instructions

### Backend

1. Navigate to the backend directory:  
   ```bash
   cd backend
   ```  

2. Install dependencies:  
   ```bash
   npm install
   ```  

3. Create a `.env` file and add the required environment variables.  

4. Start the backend server:  
   ```bash
   npm start
   ```  

### Frontend

1. Navigate to the frontend directory:  
   ```bash
   cd frontend
   ```  

2. Install dependencies:  
   ```bash
   npm install
   ```  

3. Create a `.env.local` file and add the required environment variable.  

4. Start the frontend development server:  
   ```bash
   npm run dev
   ```  

---

## API Endpoints

The backend exposes the following endpoint prefixes:  

- `/api/auth` – Authentication  
- `/api/users` – User management  
- `/api/products` – Product CRUD  
- `/api/cart` – Cart operations  
- `/api/reviews` – Product reviews  
- `/api/orders` – Orders and checkout  
- `/api` – Utility endpoints (e.g., checklogs)  

---

## Future Enhancements

Planned features for **Thriftr v2**:  

- **Real-time Chat:** Direct messaging between buyers and sellers via Socket.IO.    
- **Wishlist:** Save items to purchase later.  
- **Seller Analytics:** Insights into product performance and sales.  

---

✨ With **Thriftr**, reselling becomes more than just a transaction — it’s a smooth, social, and enjoyable experience.
