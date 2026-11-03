# ShopNow — Premium E-Commerce Web Application

A full-stack modern e-commerce web platform built with the **MERN** stack (MongoDB, Express, React, Node.js) and styled with clean, luxury editorial UI design.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Modern Homepage:** Curated spotlight hero, interactive bento collection cards, and live metrics.
- **Product Catalog:** Real-time search, category filters, price sorting, and pagination.
- **Product Details:** High-resolution product showcase, stock availability tracker, interactive quantity selector, and instant checkout.
- **Shopping Cart & Wishlist:** Persistent local & state management with Redux Toolkit.
- **Checkout Experience:** Express delivery details, Cash on Delivery (COD) and Card payment simulation, and printable order receipts.
- **Order History:** Full order tracking and customer invoice view.
- **User Authentication:** Secure JWT authentication with user profile management.

### 👑 Admin Management Portal (CRM)
- **Executive Dashboard:** Live business metrics, real-time total revenue calculation, active customer count, order statistics, and 7-day revenue trend charts.
- **Product Management:** Full CRUD operations — add, edit, stock adjustments, and discount management.
- **Order Fulfillment:** Live order statuses, one-click payment recording, and delivery dispatch updates.
- **Customer Directory:** View registered customer accounts and order histories.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Redux Toolkit, React Router v6, React Hot Toast, Recharts
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js
- **Styling:** Modular CSS, SVG vector iconography, Responsive Flex/Grid design

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed locally or MongoDB Atlas connection URI

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/munees-mehboob/ecommerce-web-app.git
cd ecommerce-web-app
```

#### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder (refer to `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Admin Initial Seed Credentials
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@shopnow.com
ADMIN_PASSWORD=admin123456
```

Seed initial products & admin account:
```bash
node utils/seeder.js
```

Start backend server:
```bash
npm run dev
# or
npm start
```

#### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and communicate with the backend at `http://localhost:5000`.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
