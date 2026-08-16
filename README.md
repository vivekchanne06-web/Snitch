# 🛍️ Snitch — Premium Fashion Marketplace

<p align="center">
  <strong>A full-stack fashion marketplace built with React, Node.js, Express, MongoDB, Redis and Razorpay.</strong>
</p>

<p align="center">
  <a href="https://snitch-theta.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Website-A95A3A?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/vivekchanne06-web/Snitch">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <a href="https://www.linkedin.com/in/vivek-channe">
    <img src="https://img.shields.io/badge/LinkedIn-Vivek%20Channe-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
  </a>
</p>

---

## 🌐 Live Links

### 🚀 Live Application

https://snitch-theta.vercel.app

### ⚙️ Production Backend

https://snitch-pkfb.onrender.com

### ❤️ Backend Health Check

https://snitch-pkfb.onrender.com/health

### 📦 GitHub Repository

https://github.com/vivekchanne06-web/Snitch

### 👨‍💻 LinkedIn

https://www.linkedin.com/in/vivek-channe

---

# 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Project Goals](#-project-goals)
- [Key Features](#-key-features)
- [Customer Features](#-customer-features)
- [Seller Features](#-seller-features)
- [Authentication](#-authentication)
- [Shopping Flow](#-shopping-flow)
- [Cart System](#-cart-system)
- [Address Management](#-address-management)
- [Payment System](#-payment-system)
- [Order Management](#-order-management)
- [Inventory Management](#-inventory-management)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [API Overview](#-api-overview)
- [Authentication Flow](#-authentication-flow)
- [Payment Flow](#-payment-flow)
- [Order Flow](#-order-flow)
- [Database](#-database)
- [Redis](#-redis)
- [Image Management](#-image-management)
- [UI & Design System](#-ui--design-system)
- [Responsive Design](#-responsive-design)
- [Security](#-security)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Production Architecture](#-production-architecture)
- [Engineering Decisions](#-engineering-decisions)
- [Future Improvements](#-future-improvements)
- [Developer](#-developer)
- [License](#-license)

---

# 🧩 About the Project

**Snitch** is a full-stack fashion marketplace designed to provide a complete modern e-commerce experience for customers and sellers.

The project covers the complete shopping lifecycle, including:

- Authentication
- Product discovery
- Product variants
- Shopping cart
- Address management
- Checkout
- Cash on Delivery
- Razorpay payments
- Payment verification
- Inventory management
- Order creation
- Order history
- Seller product management
- Responsive user interface

The application is built using a separate React frontend and Node.js/Express backend and is deployed using Vercel and Render.

---

# 🎯 Project Goals

The main goals of Snitch are:

- Build a complete full-stack marketplace from scratch.
- Implement real authentication and protected resources.
- Create a scalable feature-based frontend architecture.
- Build REST APIs using Node.js and Express.
- Use MongoDB for persistent application data.
- Use Redis for supporting backend operations.
- Implement product and variant management.
- Implement a persistent shopping cart.
- Implement delivery address management.
- Integrate Cash on Delivery.
- Integrate Razorpay for online payments.
- Verify Razorpay payments securely on the backend.
- Manage product inventory during successful orders.
- Provide authenticated order history.
- Build a responsive UI for desktop, tablet and mobile.
- Deploy the application to production.
- Handle production CORS, OAuth and API routing.

---

# ✨ Key Features

## 👤 Customer Features

- User registration
- User login
- Google OAuth login
- Protected routes
- Product browsing
- Product categories
- Product details
- Product variants
- Variant-specific pricing
- Variant-specific stock
- Product images
- Add to cart
- Increase cart quantity
- Decrease cart quantity
- Remove cart items
- Address management
- Delivery address selection
- Buy Now flow
- Checkout flow
- Cash on Delivery
- Razorpay online payment
- Razorpay payment verification
- Order creation
- Order history
- User-specific orders
- Cart clearing after successful order
- Responsive navigation
- Orders shortcut in Navbar
- Toast notifications
- Responsive UI

---

# 🏪 Seller Features

The marketplace includes seller-oriented functionality for managing products.

Seller functionality includes:

- Seller product dashboard
- Add products
- Edit products
- Delete products
- Product images
- Product variants
- Variant pricing
- Variant stock
- Variant image management
- Product management

The product system uses variants to support different versions of a product with independent pricing, inventory and images.

---

# 🔐 Authentication

Snitch supports authenticated user sessions and protected application functionality.

## Authentication Methods

### Traditional Authentication

Users can register and log in through the application's authentication system.

### Google OAuth

Google OAuth is implemented through the backend authentication flow.

Production flow:

```text
User
  ↓
Snitch Frontend
  ↓
/api/auth/google
  ↓
Snitch Backend
  ↓
Google OAuth
  ↓
/api/auth/google/callback
  ↓
Authentication
  ↓
Frontend
```

The production OAuth callback is configured through an environment variable.

---

# 🛡️ Protected Features

Authenticated users can access user-specific features such as:

* Cart
* Addresses
* Checkout
* Orders
* Account information

User-specific resources are associated with the authenticated user's ID.

For example:

```text
User A
 ├── Cart A
 ├── Address A
 ├── Order A1
 └── Order A2

User B
 ├── Cart B
 ├── Address B
 └── Order B1
```

User A should only be able to access User A's protected resources.

---

# 🛒 Shopping Flow

Snitch supports two main purchase flows.

## Cart Checkout

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Cart
      ↓
Select Address
      ↓
Proceed to Checkout
      ↓
Select Payment
      ├── Cash on Delivery
      └── Razorpay
      ↓
Order Created
      ↓
Order Page
```

---

# ⚡ Buy Now Flow

Buy Now allows a user to purchase a product without first adding it to the cart.

```text
Product
   ↓
Buy Now
   ↓
Select Address
   ↓
Select Payment
   ├── COD
   └── Razorpay
   ↓
Order Created
   ↓
Order Page
```

The Buy Now flow does not require the normal cart checkout flow.

---

# 🛍️ Cart System

The cart supports:

* Add product variant
* Increase quantity
* Decrease quantity
* Remove product variant
* Retrieve current cart
* Calculate cart total
* Clear cart after successful order

Cart operations are authenticated.

The frontend uses Redux for cart state while the backend remains responsible for persistent cart data.

---

# 🏠 Address Management

Users can manage their delivery addresses.

Address information can include:

* Full name
* Phone number
* Email
* Address line 1
* Address line 2
* City
* State
* Postal code

During checkout, the backend verifies that the selected address belongs to the authenticated user.

---

# 💳 Payment System

Snitch supports two payment methods:

## 1. Cash on Delivery

COD flow:

```text
Cart
 ↓
Address
 ↓
COD
 ↓
Create Order
 ↓
Create Payment Record
 ↓
Payment Pending
 ↓
Stock Reduction
 ↓
Cart Cleared
 ↓
Orders Page
```

---

# 💰 Razorpay Payment

The application integrates Razorpay for online payments.

Flow:

```text
Customer
   ↓
Checkout
   ↓
Create Internal Order
   ↓
Create Razorpay Order
   ↓
Open Razorpay Checkout
   ↓
Customer Completes Payment
   ↓
Razorpay Response
   ↓
Backend Verification
   ↓
Signature Validation
   ↓
Payment Completed
   ↓
Stock Reduction
   ↓
Cart Cleared
   ↓
Orders Page
```

The payment is not considered successful simply because the frontend receives a successful-looking response.

The backend verifies the Razorpay payment signature before completing the payment.

---

# 📦 Order Management

Orders store an immutable snapshot of the purchased product information.

An order can contain:

* User
* Product
* Product variant
* Product title
* Product description
* Quantity
* Price
* Currency
* Product images
* Shipping address
* Payment method
* Payment information
* Estimated delivery date
* Order timestamps

This approach prevents future changes to a product from altering historical order information.

---

# 📋 Order History

Authenticated users can access their order history through:

```text
/orders
```

The Navbar also provides an authenticated Orders shortcut.

The Orders shortcut:

* Is visible only to logged-in users.
* Uses the existing application router.
* Navigates to `/orders`.
* Uses the same Navbar styling and responsive behavior.

---

# 📦 Inventory Management

Product inventory is managed at the variant level.

Example:

```text
T-Shirt
 ├── Small
 │    └── Stock: 10
 │
 ├── Medium
 │    └── Stock: 7
 │
 └── Large
      └── Stock: 4
```

Before creating an order, the backend validates the latest stock.

After a successful order/payment, the relevant variant stock is reduced.

---

# 🧱 Technology Stack

## Frontend

| Technology    | Purpose                               |
| ------------- | ------------------------------------- |
| React         | User interface                        |
| Vite          | Frontend tooling and production build |
| JavaScript    | Application logic                     |
| React Router  | Client-side routing                   |
| Redux         | Global state management               |
| Axios         | API communication                     |
| Framer Motion | Animations                            |
| CSS           | Styling and responsive design         |

---

## Backend

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| Node.js      | Backend runtime               |
| Express.js   | REST API                      |
| MongoDB      | Primary database              |
| Mongoose     | MongoDB ODM                   |
| Redis        | Backend supporting operations |
| Passport     | Authentication                |
| Google OAuth | Social authentication         |
| Razorpay     | Online payment processing     |
| ImageKit     | Image storage and delivery    |

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      User Browser   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Vercel Frontend    │
                         │  React + Vite       │
                         └──────────┬──────────┘
                                    │
                                  /api/*
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Render Backend    │
                         │   Node + Express    │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        ┌───────────┐         ┌───────────┐        ┌───────────┐
        │  MongoDB  │         │   Redis   │        │  ImageKit │
        └───────────┘         └───────────┘        └───────────┘
                                    │
                                    ▼
                              ┌───────────┐
                              │ Razorpay  │
                              └───────────┘
```

---

# 📁 Project Structure

```text
Snitch/
│
├── Backend/
│   │
│   ├── src/
│   │   ├── app/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dao/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── ...
│   │
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── address/
│   │   │   └── order/
│   │   │
│   │   ├── shared/
│   │   └── ...
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

# 🎨 Frontend Architecture

The frontend follows a feature-based architecture.

```text
src/
│
├── app/
│   ├── app.routes.jsx
│   ├── app.store.js
│   └── AppLayout.jsx
│
├── features/
│   │
│   ├── auth/
│   │   ├── pages/
│   │   ├── hook/
│   │   ├── services/
│   │   └── state/
│   │
│   ├── products/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hook/
│   │   ├── services/
│   │   └── state/
│   │
│   ├── cart/
│   │   ├── pages/
│   │   ├── hook/
│   │   ├── service/
│   │   └── state/
│   │
│   ├── address/
│   │   ├── pages/
│   │   ├── hook/
│   │   ├── service/
│   │   └── state/
│   │
│   └── order/
│       ├── pages/
│       ├── components/
│       ├── hook/
│       └── service/
│
└── shared/
    ├── components/
    └── utils/
```

This structure separates application features and keeps pages, hooks, API services and state management organized.

---

# 🔌 API Overview

The frontend communicates with the backend through relative `/api` endpoints.

## Authentication

```text
/api/auth
```

Used for:

* Registration
* Login
* Logout
* Current user
* Google OAuth
* OAuth callback

## Products

```text
/api/products
```

Used for:

* Product listing
* Product details
* Seller products
* Product management
* Variant operations

## Cart

```text
/api/cart
```

Used for:

* Add item
* Get cart
* Increase quantity
* Decrease quantity
* Remove item

## Address

```text
/api/address
```

Used for:

* Create address
* Retrieve addresses
* Update address
* Delete address

## Orders

```text
/api/orders
```

Used for:

* Create COD order
* Create Razorpay order
* Verify Razorpay payment
* Retrieve authenticated user's orders

---

# 🔄 API Architecture

The frontend uses relative API paths rather than hardcoding the production backend URL throughout the application.

```text
Frontend
   │
   ├── /api/auth
   ├── /api/products
   ├── /api/cart
   ├── /api/address
   └── /api/orders
            │
            ▼
       Vercel Rewrite
            │
            ▼
       Render Backend
```

This allows the same frontend API architecture to work across local development and production.

---

# 🔐 Security

Security-related validation is performed on the backend.

## Authentication

Protected APIs require an authenticated user.

## User Ownership

User-specific resources are queried using the authenticated user's identity.

## Address Ownership

The selected checkout address is verified against the authenticated user.

## Order Ownership

Order retrieval is restricted to orders belonging to the authenticated user.

## Payment Verification

Razorpay payment signatures are verified on the backend.

## Inventory Validation

The backend validates current stock before processing orders.

## Secrets

Sensitive environment variables are kept outside the repository.

---

# 💾 Database

MongoDB is used as the primary persistent database.

The application contains data domains such as:

```text
Users
Products
Cart
Addresses
Orders
Payments
```

Mongoose is used to define schemas and interact with MongoDB.

---

# ⚡ Redis

Redis is integrated into the backend architecture for fast in-memory operations and supporting backend functionality.

The production backend connects to Redis during startup.

---

# 🖼️ Image Management

Product images are managed through ImageKit.

The application stores image URLs/references rather than storing large binary image files directly inside MongoDB.

This helps keep:

* MongoDB focused on application data.
* Backend storage lightweight.
* Image delivery optimized through an external service.

---

# 🎨 UI & Design System

Snitch follows a premium editorial fashion aesthetic.

The design direction focuses on:

* Minimal layouts
* Premium typography
* Strong visual hierarchy
* Generous spacing
* Neutral surfaces
* Terracotta accents
* Subtle borders
* Smooth animations
* Responsive layouts

## Color Palette

```text
Primary Terracotta
#A95A3A

Dark Hover
#8B4A2F

Warm Off-White
#FAF9F5

Linen / Card
#F5F4EF

Near Black
#3D3929

Muted Text
#6E6D68
```

The UI uses reusable components and consistent interaction patterns.

---

# 📱 Responsive Design

The frontend is designed to adapt across:

* Desktop
* Laptop
* Tablet
* Mobile

Responsive behavior is implemented across:

* Navbar
* Product grids
* Product detail pages
* Cart
* Checkout
* Address selection
* Payment modal
* Orders
* Seller dashboard

The objective is to preserve usability and visual hierarchy across different screen sizes.

---

# 🚀 Deployment

The application is deployed using separate frontend and backend services.

## Frontend

```text
GitHub
   ↓
Vercel
   ↓
React + Vite Build
   ↓
https://snitch-theta.vercel.app
```

## Backend

```text
GitHub
   ↓
Render
   ↓
Node.js + Express
   ↓
https://snitch-pkfb.onrender.com
```

---

# 🌍 Production URLs

| Service         | URL                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------ |
| 🌐 Frontend     | [https://snitch-theta.vercel.app](https://snitch-theta.vercel.app)                         |
| ⚙️ Backend      | [https://snitch-pkfb.onrender.com](https://snitch-pkfb.onrender.com)                       |
| ❤️ Health Check | [https://snitch-pkfb.onrender.com/health](https://snitch-pkfb.onrender.com/health)         |
| 📦 GitHub       | [https://github.com/vivekchanne06-web/Snitch](https://github.com/vivekchanne06-web/Snitch) |
| 💼 LinkedIn     | [https://www.linkedin.com/in/vivek-channe](https://www.linkedin.com/in/vivek-channe)       |

---

# 🔧 Environment Variables

Never commit `.env` files or secret credentials to GitHub.

The application uses environment variables for external services and deployment configuration.

Typical backend configuration includes:

```text
MONGODB_URI
REDIS_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_URL_ENDPOINT
FRONTEND_URL
```

Production frontend URL:

```text
FRONTEND_URL=https://snitch-theta.vercel.app
```

Production Google OAuth callback:

```text
GOOGLE_CALLBACK_URL=https://snitch-pkfb.onrender.com/api/auth/google/callback
```

Actual credentials must be stored in the deployment platform's environment-variable settings.

---

# 💻 Local Development

## Clone the Repository

```bash
git clone https://github.com/vivekchanne06-web/Snitch.git
```

```bash
cd Snitch
```

---

# Frontend Setup

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Backend Setup

Open another terminal:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file with the required configuration.

Start the backend:

```bash
npm start
```

Backend:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "message": "server is running"
}
```

---

# 🔄 Local Development Architecture

```text
Browser
   ↓
http://localhost:5173
   ↓
Vite Development Server
   ↓
/api/*
   ↓
Vite Proxy
   ↓
http://localhost:3000
   ↓
Express Backend
   ↓
MongoDB / Redis / External Services
```

---

# 🧪 Production Build

To build the frontend:

```bash
cd Frontend
npm run build
```

Vite generates the production build inside:

```text
Frontend/dist/
```

---

# ☁️ Vercel Configuration

The frontend is configured as a Vite application.

Recommended Vercel settings:

```text
Root Directory:
Frontend

Framework:
Vite

Build Command:
npm run build

Output Directory:
dist
```

The Vercel configuration also handles:

* `/api/*` requests
* SPA fallback
* Client-side React Router routes

---

# 🖥️ Render Configuration

The backend runs as a Node.js service.

Install command:

```bash
npm install
```

Start command:

```bash
npm start
```

Render provides the production port through the environment.

The backend exposes:

```text
GET /health
```

for health monitoring.

---

# 🔁 Production Request Example

For example, when the frontend requests products:

```text
Browser
   ↓
https://snitch-theta.vercel.app/api/products
   ↓
Vercel
   ↓
Vercel Rewrite
   ↓
https://snitch-pkfb.onrender.com/api/products
   ↓
Express
   ↓
MongoDB
   ↓
JSON Response
   ↓
Frontend
```

---

# 🧾 COD Order Flow

```text
Customer
   ↓
Cart
   ↓
Address Selection
   ↓
Payment Selection
   ↓
Cash on Delivery
   ↓
POST /api/orders/cod
   ↓
Validate User
   ↓
Validate Address
   ↓
Validate Product
   ↓
Validate Variant
   ↓
Validate Stock
   ↓
Create Order
   ↓
Create Payment Record
   ↓
Reduce Stock
   ↓
Clear Cart
   ↓
Orders Page
```

---

# 💳 Razorpay Order Flow

```text
Customer
   ↓
Cart / Buy Now
   ↓
Address Selection
   ↓
Razorpay
   ↓
POST /api/orders/razorpay
   ↓
Create Internal Order
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment
   ↓
Razorpay Response
   ↓
Backend Signature Verification
   ↓
Payment Completed
   ↓
Reduce Stock
   ↓
Clear Cart
   ↓
Orders Page
```

---

# 🧠 Engineering Decisions

## Feature-Based Frontend

Instead of keeping all frontend code in one large folder, functionality is grouped by feature:

```text
auth
products
cart
address
order
```

This improves maintainability and makes future feature development easier.

---

## Backend Validation

Critical operations are validated on the backend instead of trusting the frontend.

Examples:

* Stock
* Address ownership
* User ownership
* Payment verification
* Order creation

---

## Immutable Order Snapshots

Orders store product information at the time of purchase.

This ensures historical orders remain consistent even if a product is later edited.

---

## Relative API Architecture

The frontend uses relative API paths:

```text
/api/auth
/api/products
/api/cart
/api/address
/api/orders
```

Production routing is handled by Vercel.

---

## Separate Deployment

Frontend and backend are deployed independently.

This allows:

* Independent builds
* Independent scaling
* Easier debugging
* Clear separation of responsibilities

---

# 📈 Future Improvements

Possible future improvements include:

* Advanced product search
* Product filtering
* Product sorting
* Wishlist
* Product reviews
* Product ratings
* Seller analytics
* Admin dashboard
* Order tracking
* Shipment integration
* Email notifications
* SMS notifications
* Coupon system
* Discount management
* Refund workflow
* Return management
* Payment webhooks
* Inventory reservation
* Automated testing
* CI/CD pipeline
* Structured logging
* Advanced monitoring
* Product recommendations
* Personalized shopping experience
* Improved image optimization

---

# 🐛 Production Considerations

The production application depends on several external services:

* Vercel
* Render
* MongoDB
* Redis
* Google OAuth
* Razorpay
* ImageKit

Correct environment variables and external service configuration are required for the application to operate correctly.

Sensitive credentials should never be committed to the Git repository.

---

# 📊 Project Highlights

Snitch demonstrates practical implementation of:

```text
React
     +
Feature-Based Architecture
     +
Redux
     +
REST APIs
     +
Node.js
     +
Express
     +
MongoDB
     +
Redis
     +
Google OAuth
     +
Razorpay
     +
ImageKit
     +
Vercel
     +
Render
```

The project covers both frontend engineering and backend engineering, including production deployment and third-party service integration.

---

# 👨‍💻 Developer

## Vivek Channe

Full-stack development enthusiast focused on building practical and production-oriented web applications.

### GitHub

[https://github.com/vivekchanne06-web](https://github.com/vivekchanne06-web)

### LinkedIn

[https://www.linkedin.com/in/vivek-channe](https://www.linkedin.com/in/vivek-channe)

---

# 🌐 Project Links

### 🚀 Live Demo

[https://snitch-theta.vercel.app](https://snitch-theta.vercel.app)

### 📦 GitHub Repository

[https://github.com/vivekchanne06-web/Snitch](https://github.com/vivekchanne06-web/Snitch)

### ⚙️ Backend

[https://snitch-pkfb.onrender.com](https://snitch-pkfb.onrender.com)

### ❤️ Backend Health

[https://snitch-pkfb.onrender.com/health](https://snitch-pkfb.onrender.com/health)

### 💼 LinkedIn

[https://www.linkedin.com/in/vivek-channe](https://www.linkedin.com/in/vivek-channe)

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is primarily intended as a personal and portfolio full-stack development project.

Please check the repository for the applicable license before using, modifying, or redistributing the code.

---

<p align="center">
  Built with React, Node.js, Express, MongoDB, Redis and Razorpay.
</p>

<p align="center">
  <strong>Snitch — Premium Fashion Marketplace</strong>
</p>
