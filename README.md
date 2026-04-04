# 🚀 AgriConnect – Farmer to Buyer Marketplace

A full-stack MERN web application that connects farmers directly with buyers, eliminating middlemen and enabling transparent, efficient agricultural trade.

## 🌐 Live Demo

* **Frontend (Vercel):**
  👉 [https://agriconnect-ohet.vercel.app/listings](https://agriconnect-ohet.vercel.app/listings)

* **Backend (Render):**
  ⚠️ *Note: Backend may take ~30–60 seconds to wake up (free tier)*
  👉 [https://agriconnect-19xj.onrender.com](https://agriconnect-19xj.onrender.com)
  
## 💡 Problem Statement

Farmers often receive low prices due to intermediaries, while buyers lack direct access to fresh and reliable produce.

## 🛠️ Solution

**AgriConnect** bridges this gap by providing a platform where:

* Farmers can list their crops with pricing and details
* Buyers can browse and connect directly with farmers

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Bcrypt (Password hashing)

### Deployment

* Frontend: Vercel
* Backend: Render

## ✨ Features

* 🔐 Authentication & Authorization (JWT-based)
* 👨‍🌾 Role-based system (Farmer / Buyer)
* 📦 Crop Listings (CRUD operations)
* 🔍 Browse & view listings
* 📱 Fully responsive UI
* ⚡ RESTful API architecture
* 🛡️ Secure backend with middleware & error handling

## 📁 Project Structure

```
AgriConnect/
│
├── frontend/        # React + Vite frontend
├── backend/         # Express backend
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── index.js
```

## 🔑 Environment Variables

### Backend (.env)

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
### Frontend (.env)

VITE_API_URL=https://agriconnect-19xj.onrender.com
## 🚀 Getting Started (Local Setup)

### 1. Clone Repository

```bash
git clone https://github.com/Sarthaktanpure/Agriconnect.git
cd Agriconnect
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 API Endpoints

### Auth

* `POST /signup` → Register user
* `POST /login` → Login user

### Listings

* `GET /listings` → Get all listings
* `POST /newListing` → Add new listing (Protected)
* `GET /listings/:id` → Get single listing
* `DELETE /listings/:id` → Delete listing (Owner only)

---

## 📈 What I Learned

* Building scalable full-stack applications
* Implementing secure authentication (JWT)
* Handling deployment (Vercel + Render)
* Debugging real-world issues (CORS, environment variables, API integration)
* Designing clean and responsive UI

---

## 🔮 Future Improvements

* 💬 Real-time chat between buyer and farmer
* 💳 Payment integration (Razorpay/Stripe)
* 🤖 AI-based crop price prediction
* ⭐ Reviews & rating system
* 📦 Order tracking system

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📬 Contact

* GitHub: [https://github.com/Sarthaktanpure](https://github.com/Sarthaktanpure)
* LinkedIn: *(Add your LinkedIn link here)*

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!

---

Just say **“make it elite level”** 😄🔥
